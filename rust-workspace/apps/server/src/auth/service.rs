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

    // Check if user exists
    let existing_user = accounts::Entity::find()
        .filter(
            accounts::Column::Email
                .eq(&request.email)
                .or(accounts::Column::Username.eq(&request.username)),
        )
        .one(&state.conn)
        .await
        .map_err(|e| crate::error::Error::Anyhow(anyhow::Error::new(e)))?;

    if existing_user.is_some() {
        return Ok(RegisterResponse {
            success: false,
            message: "User already exists".to_string(),
        });
    }

    // Hash password
    let password_hash =
        password::hash_password(&request.password).map_err(|e| crate::error::Error::Anyhow(e))?;

    // Create user
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
    // Find user by email
    // Note: request field is named 'email' but logic says it can be username too?
    // Let's support both if we want, or strict email. The proto comment says "Can be email or username".

    let user = accounts::Entity::find()
        .filter(
            accounts::Column::Email.eq(&request.email), // .or(accounts::Column::Username.eq(&request.email)) // Uncomment to allow username login
        )
        .one(&state.conn)
        .await
        .map_err(|e| crate::error::Error::Anyhow(anyhow::Error::new(e)))?;

    let user = match user {
        Some(u) => u,
        None => {
            return Ok(LoginResponse {
                success: false,
                user: None,
                access_token: "".to_string(),
                refresh_token: "".to_string(),
            });
        } // Or return Error::Forbidden
    };

    // Verify password
    let valid = if let Some(hash) = &user.password_hash {
        password::verify_password(&request.password, hash)
            .map_err(|e| crate::error::Error::Anyhow(e))?
    } else {
        false // No password hash (federated only?)
    };

    if !valid {
        return Ok(LoginResponse {
            success: false,
            user: None,
            access_token: "".to_string(),
            refresh_token: "".to_string(),
        });
    }

    // Generate tokens
    let access_token = jwt::sign_token(&user.id.to_string(), &state.jwt_secret, 3600) // 1 hour
        .map_err(|e| crate::error::Error::Anyhow(e))?;
    let refresh_token = jwt::sign_token(&user.id.to_string(), &state.jwt_secret, 86400 * 7) // 7 days
        .map_err(|e| crate::error::Error::Anyhow(e))?;

    // Update last login
    let mut active_user: accounts::ActiveModel = user.clone().into();
    active_user.last_login_at = Set(Some(Utc::now().into()));
    active_user
        .update(&state.conn)
        .await
        .map_err(|e| crate::error::Error::Anyhow(anyhow::Error::new(e)))?;

    Ok(LoginResponse {
        success: true,
        user: Some(User {
            id: user.id.to_string(),
            email: user.email,
            username: user.username,
            created_at: user.created_at.to_rfc3339(),
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

    // In a real app, we should check if the user still exists and is active.
    // We should also support token rotation (invalidating the old refresh token).

    let access_token = jwt::sign_token(&claims.sub, &state.jwt_secret, 3600)
        .map_err(|e| crate::error::Error::Anyhow(e))?;

    // Optionally rotate refresh token
    let new_refresh_token = jwt::sign_token(&claims.sub, &state.jwt_secret, 86400 * 7)
        .map_err(|e| crate::error::Error::Anyhow(e))?;

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
    // We need to extract the user ID from the context (inserted by middleware).
    // For now, this is just a placeholder as we haven't implemented the middleware yet.
    // TODO: Extract user from request extensions/headers

    // Assuming we passed auth check and have a user ID (mocked for now)
    let user_id = Uuid::nil(); // Replace with actual ID from context

    let user = accounts::Entity::find_by_id(user_id)
        .one(&state.conn)
        .await
        .map_err(|e| crate::error::Error::Anyhow(anyhow::Error::new(e)))?;

    if let Some(user) = user {
        Ok(MeResponse {
            user: Some(User {
                id: user.id.to_string(),
                email: user.email,
                username: user.username,
                created_at: user.created_at.to_rfc3339(),
            }),
        })
    } else {
        Err(crate::error::Error::NotFound)
    }
}
