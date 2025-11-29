import type { IGraphQLConfig } from "graphql-config";

const config: IGraphQLConfig = {
  schema: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:5000/graphql",
  extensions: {
    codegen: {
      hooks: {
        afterOneFileWrite: ["prettier --write"],
      },
      generates: {
        "lib/graphql/schema.types.ts": {
          plugins: ["typescript"],
          config: {
            skipTypename: true,
            enumsAsTypes: true,
          },
        },
        "lib/graphql/types.ts": {
          preset: "import-types",
          documents: ["app/**/*.{ts,tsx}", "hooks/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
          plugins: ["typescript-operations"],
          config: {
            skipTypename: true,
            enumsAsTypes: true,
            preResolveTypes: false,
            useTypeImports: true,
          },
          presetConfig: {
            typesPath: "./schema.types",
          },
        },
      },
    },
  },
};

export default config;

