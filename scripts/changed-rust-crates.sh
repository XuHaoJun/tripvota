#!/usr/bin/env bash
set -euo pipefail

# Run cargo tests only for crates that changed since the base ref

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# Determine base ref (priority: CLI arg > BASE_REF env > GITHUB_BASE_REF env > origin default > main/master)
CLI_BASE_REF=${1:-}
BASE_CANDIDATE=${CLI_BASE_REF:-${BASE_REF:-${GITHUB_BASE_REF:-}}}

if [[ -n "$BASE_CANDIDATE" ]]; then
  if git show-ref --verify --quiet "refs/remotes/origin/${BASE_CANDIDATE}"; then
    BASE="origin/${BASE_CANDIDATE}"
  else
    BASE="$BASE_CANDIDATE"
  fi
else
  # Try origin/HEAD to detect default branch
  if git show-ref --verify --quiet refs/remotes/origin/HEAD; then
    DEFAULT_REMOTE_REF=$(git symbolic-ref -q --short refs/remotes/origin/HEAD || true)
    if [[ -n "$DEFAULT_REMOTE_REF" ]]; then
      BASE="$DEFAULT_REMOTE_REF" # already like origin/main
    fi
  fi
  # Fallbacks
  if [[ -z "${BASE:-}" ]]; then
    if git show-ref --verify --quiet refs/remotes/origin/main; then
      BASE=origin/main
    else
      BASE=origin/master
    fi
  fi
fi

# If workspace dir doesn't exist, nothing to do
if [[ ! -d rust-workspace ]]; then
  echo "rust-workspace not found; skipping"
  exit 0
fi

pushd rust-workspace >/dev/null

# If top-level Cargo.toml or workspace Cargo.lock changed, test all
if git diff --name-only "$BASE"...HEAD -- Cargo.toml Cargo.lock | grep -q .; then
  echo "Workspace manifest/lockfile changed; running tests for all crates"
  cargo test --workspace --all-targets --all-features
  popd >/dev/null
  exit 0
fi

changed_files=$(git diff --name-only "$BASE"...HEAD -- . || true)
if [[ -z "$changed_files" ]]; then
  echo "No Rust changes detected; skipping tests"
  popd >/dev/null
  exit 0
fi

# Build map of crate_dir -> package name
if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required for changed crate detection" >&2
  exit 1
fi

mapfile -t crate_lines < <(cargo metadata --no-deps --format-version 1 \
  | jq -r '.packages[] | [.name, (.manifest_path | rtrimstr("/Cargo.toml"))] | @tsv')

declare -A dir_to_pkg
for line in "${crate_lines[@]}"; do
  pkg_name="${line%%$'\t'*}"
  pkg_dir="${line#*$'\t'}"
  # Normalize to relative path (from rust-workspace)
  pkg_dir_rel="${pkg_dir#$PWD/}"
  dir_to_pkg["$pkg_dir_rel"]="$pkg_name"
done

declare -A changed_pkgs
workspace_prefix="$(basename "$PWD")/"

while IFS= read -r f; do
  # Skip non-file lines
  [[ -z "$f" ]] && continue
  # Normalize to paths relative to rust-workspace (Git may output repo-root-relative paths)
  if [[ "$f" == "$workspace_prefix"* ]]; then
    f="${f#"$workspace_prefix"}"
  fi
  for dir in "${!dir_to_pkg[@]}"; do
    if [[ "$f" == "$dir"/* ]] || [[ "$f" == "$dir"/Cargo.toml ]]; then
      changed_pkgs["${dir_to_pkg[$dir]}"]=1
    fi
  done
done <<< "$changed_files"

if [[ ${#changed_pkgs[@]} -eq 0 ]]; then
  echo "No crate-level changes detected; skipping tests"
  popd >/dev/null
  exit 0
fi

echo "Testing changed crates: ${!changed_pkgs[@]}"
cargo test --all-targets --all-features $(printf ' -p %q' "${!changed_pkgs[@]}")

popd >/dev/null

