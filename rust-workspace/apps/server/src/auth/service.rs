use crate::auth::jwt;
use crate::auth::password;
use crate::proto::auth::*;
use anyhow::Result;
use chrono::Utc;
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, ExprTrait, QueryFilter, Set};
use uuid::Uuid;
use workspace_entity::accounts;

// This state should be injected in main.rs.
// For now, we'll assume the handler has access to the connection.
// The current pattern in main.rs passes state via .with_state(state).
// We need to extract it in the handler if we want to use it.
// However, axum-connect handlers can take State as an argument.

use crate::AppState;
use axum::extract::State;

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
    let access_token = jwt::sign_token(&account.id.to_string(), &state.jwt_secret, 3600) // 1 hour
        .map_err(crate::error::Error::Anyhow)?;
    let refresh_token = jwt::sign_token(&account.id.to_string(), &state.jwt_secret, 86400 * 7) // 7 days
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

    let access_token = jwt::sign_token(&claims.sub, &state.jwt_secret, 3600)
        .map_err(crate::error::Error::Anyhow)?;

    // Optionally rotate refresh token
    let new_refresh_token = jwt::sign_token(&claims.sub, &state.jwt_secret, 86400 * 7)
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

pub async fn me(
    State(state): State<AppState>,
    _request: MeRequest,
) -> Result<MeResponse, crate::error::Error> {
    // We need to extract the account ID from the context (inserted by middleware).
    // For now, this is just a placeholder as we haven't implemented the middleware yet.
    // TODO: Extract account from request extensions/headers

    // Assuming we passed auth check and have an account ID (mocked for now)
    let account_id = Uuid::nil(); // Replace with actual ID from context

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
