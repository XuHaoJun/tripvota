use crate::auth::jwt;
use crate::auth::password;
use crate::proto::auth::*;
use anyhow::Result;
use chrono::Utc;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, EntityTrait, ExprTrait, QueryFilter, Set, TransactionTrait,
};
use uuid::Uuid;
use workspace_entity::{account_realm_roles, accounts, realms, roles};

// This state should be injected in main.rs.
// For now, we'll assume the handler has access to the connection.
// The current pattern in main.rs passes state via .with_state(state).
// We need to extract it in the handler if we want to use it.
// However, axum-connect handlers can take State as an argument.

use crate::AppState;
use axum::extract::State;
use axum::http::{self, HeaderMap};
use axum_connect::error::RpcError;
use axum_connect::parts::RpcFromRequestParts;
use prost::Message;

// Wrapper type to allow HeaderMap as an extractor in axum-connect handlers
pub struct Headers(pub HeaderMap);

impl std::ops::Deref for Headers {
    type Target = HeaderMap;
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

// Implement RpcFromRequestParts for our local Headers type
#[async_trait::async_trait]
impl<M> RpcFromRequestParts<M, crate::AppState> for Headers
where
    M: Message,
{
    type Rejection = RpcError;

    async fn rpc_from_request_parts(
        parts: &mut http::request::Parts,
        _state: &crate::AppState,
    ) -> Result<Self, Self::Rejection> {
        Ok(Headers(parts.headers.clone()))
    }
}

pub async fn register(
    State(state): State<AppState>,
    request: RegisterRequest,
) -> Result<RegisterResponse, crate::error::Error> {
    // Validate input
    if request.email.is_empty() || request.password.is_empty() || request.username.is_empty() {
        // In a real app we'd want specific error codes, but for now Internal/Anyhow will do or we extend Error enum
        return Err(crate::error::Error::Anyhow(anyhow::anyhow!(
            "Missing fields"
        )));
    }

    // Check if account exists
    let existing_account = accounts::Entity::find()
        .filter(
            accounts::Column::Email
                .eq(&request.email)
                .or(accounts::Column::Username.eq(&request.username)),
        )
        .one(&state.conn)
        .await
        .map_err(|e| crate::error::Error::Anyhow(anyhow::Error::new(e)))?;

    if existing_account.is_some() {
        return Ok(RegisterResponse {
            success: false,
            message: "Account already exists".to_string(),
        });
    }

    // Hash password
    let password_hash =
        password::hash_password(&request.password).map_err(crate::error::Error::Anyhow)?;

    // Create account
    let new_account = accounts::ActiveModel {
        id: Set(Uuid::now_v7()),
        email: Set(request.email),
        username: Set(request.username),
        password_hash: Set(Some(password_hash)),
        email_verified: Set(false),
        is_active: Set(true),
        created_at: Set(Utc::now().into()),
        updated_at: Set(Utc::now().into()),
        ..Default::default()
    };

    new_account
        .insert(&state.conn)
        .await
        .map_err(|e| crate::error::Error::Anyhow(anyhow::Error::new(e)))?;

    Ok(RegisterResponse {
        success: true,
        message: "Registration successful".to_string(),
    })
}

pub async fn login(
    State(state): State<AppState>,
    request: LoginRequest,
) -> Result<LoginResponse, crate::error::Error> {
    // Find account by email
    // Note: request field is named 'email' but logic says it can be username too?
    // Let's support both if we want, or strict email. The proto comment says "Can be email or username".

    let account = accounts::Entity::find()
        .filter(
            accounts::Column::Email.eq(&request.email), // .or(accounts::Column::Username.eq(&request.email)) // Uncomment to allow username login
        )
        .one(&state.conn)
        .await
        .map_err(|e| crate::error::Error::Anyhow(anyhow::Error::new(e)))?;

    let account = match account {
        Some(a) => a,
        None => {
            return Ok(LoginResponse {
                success: false,
                account: None,
                access_token: "".to_string(),
                refresh_token: "".to_string(),
            });
        } // Or return Error::Forbidden
    };

    // Verify password
    let valid = if let Some(hash) = &account.password_hash {
        password::verify_password(&request.password, hash).map_err(crate::error::Error::Anyhow)?
    } else {
        false // No password hash (federated only?)
    };

    if !valid {
        return Ok(LoginResponse {
            success: false,
            account: None,
            access_token: "".to_string(),
            refresh_token: "".to_string(),
        });
    }

    // Generate tokens
    let access_token = jwt::sign_token(&account.id.to_string(), &state.jwt_secret, 3600, None) // 1 hour
        .map_err(crate::error::Error::Anyhow)?;
    let refresh_token =
        jwt::sign_token(&account.id.to_string(), &state.jwt_secret, 86400 * 7, None) // 7 days
            .map_err(crate::error::Error::Anyhow)?;

    // Update last login
    let mut active_account: accounts::ActiveModel = account.clone().into();
    active_account.last_login_at = Set(Some(Utc::now().into()));
    active_account
        .update(&state.conn)
        .await
        .map_err(|e| crate::error::Error::Anyhow(anyhow::Error::new(e)))?;

    Ok(LoginResponse {
        success: true,
        account: Some(Account {
            id: account.id.to_string(),
            email: account.email,
            username: account.username,
            created_at: account.created_at.to_rfc3339(),
        }),
        access_token,
        refresh_token,
    })
}

pub async fn refresh_token(
    State(state): State<AppState>,
    request: RefreshTokenRequest,
) -> Result<RefreshTokenResponse, crate::error::Error> {
    // Verify refresh token
    let claims = jwt::verify_token(&request.refresh_token, &state.jwt_secret)
        .map_err(|_| crate::error::Error::Forbidden)?; // Use proper error for invalid token

    // In a real app, we should check if the account still exists and is active.
    // We should also support token rotation (invalidating the old refresh token).

    // Extract and validate realm_id if provided
    let realm_id_str = if !request.realm_id.is_empty() {
        let realm_id = Uuid::parse_str(&request.realm_id)
            .map_err(|_| crate::error::Error::Anyhow(anyhow::anyhow!("Invalid realm_id format")))?;

        // Validate that user has access to this realm
        let account_id = Uuid::parse_str(&claims.sub).map_err(|_| {
            crate::error::Error::Anyhow(anyhow::anyhow!("Invalid account ID in token"))
        })?;

        let has_access = account_realm_roles::Entity::find()
            .filter(account_realm_roles::COLUMN.account_id.eq(account_id))
            .filter(account_realm_roles::COLUMN.realm_id.eq(realm_id))
            .one(&state.conn)
            .await
            .map_err(|e| crate::error::Error::Anyhow(anyhow::Error::new(e)))?;

        if has_access.is_none() {
            return Err(crate::error::Error::Forbidden);
        }

        Some(request.realm_id.as_str())
    } else {
        None
    };

    let access_token = jwt::sign_token(&claims.sub, &state.jwt_secret, 3600, realm_id_str)
        .map_err(crate::error::Error::Anyhow)?;

    // Optionally rotate refresh token
    let new_refresh_token =
        jwt::sign_token(&claims.sub, &state.jwt_secret, 86400 * 7, realm_id_str)
            .map_err(crate::error::Error::Anyhow)?;

    Ok(RefreshTokenResponse {
        success: true,
        access_token,
        refresh_token: new_refresh_token,
    })
}

pub async fn logout(
    State(_state): State<AppState>,
    _request: LogoutRequest,
) -> Result<LogoutResponse, crate::error::Error> {
    // In stateless JWT, we can't really "invalidate" the token without a blacklist.
    // The client is responsible for deleting the token.
    Ok(LogoutResponse { success: true })
}

fn extract_account_id_from_headers(
    headers: &Headers,
    jwt_secret: &str,
) -> Result<Uuid, crate::error::Error> {
    // Extract Authorization header
    let auth_header = headers
        .get("authorization")
        .ok_or(crate::error::Error::Forbidden)?
        .to_str()
        .map_err(|_| crate::error::Error::Forbidden)?;

    // Parse Bearer token
    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or(crate::error::Error::Forbidden)?;

    // Verify token and extract account ID
    let claims =
        jwt::verify_token(token, jwt_secret).map_err(|_| crate::error::Error::Forbidden)?;

    let account_id = Uuid::parse_str(&claims.sub).map_err(|_| crate::error::Error::Forbidden)?;

    Ok(account_id)
}

pub async fn me(
    State(state): State<AppState>,
    headers: Headers,
    _request: MeRequest,
) -> Result<MeResponse, crate::error::Error> {
    let account_id = extract_account_id_from_headers(&headers, &state.jwt_secret)?;

    let account = accounts::Entity::find_by_id(account_id)
        .one(&state.conn)
        .await
        .map_err(|e| crate::error::Error::Anyhow(anyhow::Error::new(e)))?;

    if let Some(account) = account {
        Ok(MeResponse {
            account: Some(Account {
                id: account.id.to_string(),
                email: account.email,
                username: account.username,
                created_at: account.created_at.to_rfc3339(),
            }),
        })
    } else {
        Err(crate::error::Error::NotFound)
    }
}

pub async fn list_realms(
    State(state): State<AppState>,
    headers: Headers,
    _request: ListRealmsRequest,
) -> Result<ListRealmsResponse, crate::error::Error> {
    let account_id = extract_account_id_from_headers(&headers, &state.jwt_secret)?;

    // Query account_realm_roles to get user's realms
    let realm_roles = account_realm_roles::Entity::find()
        .filter(account_realm_roles::COLUMN.account_id.eq(account_id))
        .find_also_related(realms::Entity)
        .all(&state.conn)
        .await
        .map_err(|e| crate::error::Error::Anyhow(anyhow::Error::new(e)))?;

    // Filter to active realms and map to proto messages
    let realms_list: Vec<Realm> = realm_roles
        .into_iter()
        .filter_map(|(_, realm)| realm)
        .filter(|r| r.is_active)
        .map(|r| Realm {
            id: r.id.to_string(),
            name: r.name,
            display_name: r.display_name,
            description: r.description.unwrap_or_default(),
            is_active: r.is_active,
            created_at: r.created_at.to_rfc3339(),
        })
        .collect();

    Ok(ListRealmsResponse {
        realms: realms_list,
    })
}

pub async fn create_realm(
    State(state): State<AppState>,
    headers: Headers,
    request: CreateRealmRequest,
) -> Result<CreateRealmResponse, crate::error::Error> {
    // Extract account_id from JWT headers
    let account_id = extract_account_id_from_headers(&headers, &state.jwt_secret)?;

    // Validate input
    if request.name.is_empty() || request.display_name.is_empty() {
        return Err(crate::error::Error::Anyhow(anyhow::anyhow!(
            "Name and display_name are required"
        )));
    }

    // Check if realm name already exists (unique constraint)
    let existing_realm = realms::Entity::find()
        .filter(realms::COLUMN.name.eq(&request.name))
        .one(&state.conn)
        .await
        .map_err(|e| crate::error::Error::Anyhow(anyhow::Error::new(e)))?;

    if existing_realm.is_some() {
        return Ok(CreateRealmResponse {
            success: false,
            message: format!("Realm with name '{}' already exists", request.name),
            realm: None,
        });
    }

    // Start transaction for atomic realm, role, and account_realm_role creation
    let txn = state
        .conn
        .begin()
        .await
        .map_err(|e| crate::error::Error::Anyhow(anyhow::Error::new(e)))?;

    // Create realm
    let new_realm = realms::ActiveModel {
        id: Set(Uuid::now_v7()),
        name: Set(request.name.clone()),
        display_name: Set(request.display_name.clone()),
        description: Set(if request.description.is_empty() {
            None
        } else {
            Some(request.description.clone())
        }),
        is_active: Set(true),
        created_at: Set(Utc::now().into()),
        updated_at: Set(Utc::now().into()),
        metadata: Set(None),
    };

    let created_realm = realms::Entity::insert(new_realm)
        .exec_with_returning(&txn)
        .await
        .map_err(|e| crate::error::Error::Anyhow(anyhow::Error::new(e)))?;

    let realm_id = created_realm.id;

    // Create "admin" role in the realm
    let admin_role_id = Uuid::now_v7();
    let admin_role = roles::ActiveModel {
        id: Set(admin_role_id),
        realm_id: Set(realm_id),
        name: Set("admin".to_string()),
        description: Set(Some(
            "Administrator role with full access to the realm".to_string(),
        )),
        created_at: Set(Utc::now().into()),
    };

    roles::Entity::insert(admin_role)
        .exec(&txn)
        .await
        .map_err(|e| crate::error::Error::Anyhow(anyhow::Error::new(e)))?;

    // Add creator to account_realm_roles with admin role
    let account_realm_role = account_realm_roles::ActiveModel {
        account_id: Set(account_id),
        realm_id: Set(realm_id),
        role_id: Set(admin_role_id),
        granted_at: Set(Utc::now().into()),
        granted_by: Set(Some(account_id)), // Creator grants themselves the role
    };

    account_realm_roles::Entity::insert(account_realm_role)
        .exec(&txn)
        .await
        .map_err(|e| crate::error::Error::Anyhow(anyhow::Error::new(e)))?;

    // Commit transaction
    txn.commit()
        .await
        .map_err(|e| crate::error::Error::Anyhow(anyhow::Error::new(e)))?;

    Ok(CreateRealmResponse {
        success: true,
        message: "Realm created successfully".to_string(),
        realm: Some(Realm {
            id: created_realm.id.to_string(),
            name: created_realm.name,
            display_name: created_realm.display_name,
            description: created_realm.description.unwrap_or_default(),
            is_active: created_realm.is_active,
            created_at: created_realm.created_at.to_rfc3339(),
        }),
    })
}
