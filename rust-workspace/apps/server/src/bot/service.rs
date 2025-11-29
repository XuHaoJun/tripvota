use crate::AppState;
use crate::auth::jwt;
use crate::auth::service::Headers;
use crate::error::Error;
use axum::extract::State;
use chrono::Utc;
use sea_orm::{ActiveModelTrait, EntityTrait, QueryFilter, Set, TransactionTrait};
use uuid::Uuid;
use workspace_entity::{account_realm_roles, bots, channel_bridge};

use crate::proto::bot::*;

/// Extract account_id from JWT token in request headers
fn extract_account_id_from_headers(headers: &Headers, jwt_secret: &str) -> Result<Uuid, Error> {
    // Extract Authorization header
    let auth_header = headers
        .get("authorization")
        .ok_or(Error::Forbidden)?
        .to_str()
        .map_err(|_| Error::Forbidden)?;

    // Parse Bearer token
    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or(Error::Forbidden)?;

    // Verify token and extract account ID
    let claims = jwt::verify_token(token, jwt_secret).map_err(|_| Error::Forbidden)?;

    let account_id = Uuid::parse_str(&claims.sub).map_err(|_| Error::Forbidden)?;

    Ok(account_id)
}

/// Extract realm_id from authenticated user's account_id
/// For MVP, we get the first realm_id associated with the account
async fn extract_realm_id_from_account(
    account_id: Uuid,
    db: &sea_orm::DatabaseConnection,
) -> Result<Uuid, Error> {
    let realm_role = account_realm_roles::Entity::find()
        .filter(account_realm_roles::COLUMN.account_id.eq(account_id))
        .one(db)
        .await
        .map_err(|e| Error::Anyhow(anyhow::Error::new(e)))?;

    match realm_role {
        Some(rr) => Ok(rr.realm_id),
        None => Err(Error::Forbidden), // User has no realm access
    }
}

/// Convert protobuf ChannelBridgeInput to channel_bridge::ActiveModel
fn channel_bridge_input_to_active_model(
    input: &ChannelBridgeInput,
) -> Result<channel_bridge::ActiveModel, Error> {
    // Validate bridge_type
    if input.bridge_type != "oauth" && input.bridge_type != "api" {
        return Err(Error::Anyhow(anyhow::anyhow!(
            "Invalid bridge_type: must be 'oauth' or 'api'"
        )));
    }

    let mut active_model = channel_bridge::ActiveModel {
        id: Set(Uuid::now_v7()),
        bridge_type: Set(input.bridge_type.clone()),
        third_provider_type: Set(input.third_provider_type.clone()),
        third_id: Set(input.third_id.clone()),
        third_secret: Set(input.third_secret.clone()),
        created_at: Set(Utc::now().into()),
        updated_at: Set(Utc::now().into()),
        ..Default::default()
    };

    // Set OAuth-specific fields if bridge_type is 'oauth'
    if input.bridge_type == "oauth" {
        if !input.access_token.is_empty() {
            active_model.access_token = Set(Some(input.access_token.clone()));
        }
        if !input.refresh_token.is_empty() {
            active_model.refresh_token = Set(Some(input.refresh_token.clone()));
        }
        if !input.token_expiry.is_empty() {
            // Parse ISO 8601 timestamp string to DateTimeWithTimeZone
            // For now, we'll store it as None if parsing fails
            // In production, you'd want proper date parsing
            active_model.token_expiry = Set(None); // TODO: Parse token_expiry string
        }
        if !input.oauth_scopes.is_empty() {
            active_model.oauth_scopes = Set(Some(input.oauth_scopes.clone()));
        }
    }

    // Set API-specific fields if bridge_type is 'api'
    if input.bridge_type == "api" {
        if !input.api_endpoint.is_empty() {
            active_model.api_endpoint = Set(Some(input.api_endpoint.clone()));
        }
        if !input.api_version.is_empty() {
            active_model.api_version = Set(Some(input.api_version.clone()));
        }
    }

    Ok(active_model)
}

/// Convert bots::Model to protobuf Bot
fn bot_to_proto(bot: &bots::Model) -> Bot {
    Bot {
        id: bot.id.to_string(),
        realm_id: bot.realm_id.to_string(),
        name: bot.name.clone(),
        display_name: bot.display_name.clone(),
        description: bot.description.clone().unwrap_or_default(),
        api_channel_bridge_id: bot
            .api_channel_bridge_id
            .map(|id| id.to_string())
            .unwrap_or_default(),
        oauth_channel_bridge_id: bot
            .oauth_channel_bridge_id
            .map(|id| id.to_string())
            .unwrap_or_default(),
        api_channel_bridge: None,   // Not loaded by default
        oauth_channel_bridge: None, // Not loaded by default
        is_active: bot.is_active,
        capabilities: bot.capabilities.clone().unwrap_or_default(),
        created_at: bot.created_at.to_rfc3339(),
        updated_at: bot.updated_at.to_rfc3339(),
    }
}

/// Create Bot handler
pub async fn create_bot(
    State(state): State<AppState>,
    headers: Headers,
    request: CreateBotRequest,
) -> Result<CreateBotResponse, Error> {
    // Extract account_id and realm_id from JWT
    let account_id = extract_account_id_from_headers(&headers, &state.jwt_secret)?;
    let realm_id = if request.realm_id.is_empty() {
        // Extract from authenticated user's context
        extract_realm_id_from_account(account_id, &state.conn).await?
    } else {
        // Validate that provided realm_id belongs to user
        let provided_realm_id = Uuid::parse_str(&request.realm_id)
            .map_err(|_| Error::Anyhow(anyhow::anyhow!("Invalid realm_id format")))?;

        // Verify user has access to this realm
        let has_access = account_realm_roles::Entity::find()
            .filter(account_realm_roles::COLUMN.account_id.eq(account_id))
            .filter(account_realm_roles::COLUMN.realm_id.eq(provided_realm_id))
            .one(&state.conn)
            .await
            .map_err(|e| Error::Anyhow(anyhow::Error::new(e)))?;

        if has_access.is_none() {
            return Err(Error::Forbidden);
        }

        provided_realm_id
    };

    // Validate: at least one channel bridge must be provided
    if request.api_channel_bridge.is_none() && request.oauth_channel_bridge.is_none() {
        return Err(Error::Anyhow(anyhow::anyhow!(
            "At least one channel bridge (API or OAuth) is required"
        )));
    }

    // Validate: bot name uniqueness within realm
    let existing_bot = bots::Entity::find()
        .filter(bots::COLUMN.realm_id.eq(realm_id))
        .filter(bots::COLUMN.name.eq(&request.name))
        .one(&state.conn)
        .await
        .map_err(|e| Error::Anyhow(anyhow::Error::new(e)))?;

    if existing_bot.is_some() {
        return Err(Error::Anyhow(anyhow::anyhow!(
            "Bot name '{}' already exists in this realm",
            request.name
        )));
    }

    // Start transaction for atomic bot and bridge creation
    let txn = state
        .conn
        .begin()
        .await
        .map_err(|e| Error::Anyhow(anyhow::Error::new(e)))?;

    // Create channel bridges if provided
    let mut api_bridge_id: Option<Uuid> = None;
    let mut oauth_bridge_id: Option<Uuid> = None;

    if let Some(api_bridge_input) = &request.api_channel_bridge {
        let api_bridge_active = channel_bridge_input_to_active_model(api_bridge_input)?;
        let api_bridge_res = channel_bridge::Entity::insert(api_bridge_active)
            .exec(&txn)
            .await
            .map_err(|e| Error::Anyhow(anyhow::Error::new(e)))?;
        api_bridge_id = Some(api_bridge_res.last_insert_id);
    }

    if let Some(oauth_bridge_input) = &request.oauth_channel_bridge {
        let oauth_bridge_active = channel_bridge_input_to_active_model(oauth_bridge_input)?;
        let oauth_bridge_res = channel_bridge::Entity::insert(oauth_bridge_active)
            .exec(&txn)
            .await
            .map_err(|e| Error::Anyhow(anyhow::Error::new(e)))?;
        oauth_bridge_id = Some(oauth_bridge_res.last_insert_id);
    }

    // Create bot record
    let new_bot = bots::ActiveModel {
        id: Set(Uuid::now_v7()),
        realm_id: Set(realm_id),
        name: Set(request.name.clone()),
        display_name: Set(request.display_name.clone()),
        description: Set(if request.description.is_empty() {
            None
        } else {
            Some(request.description.clone())
        }),
        api_channel_bridge_id: Set(api_bridge_id),
        oauth_channel_bridge_id: Set(oauth_bridge_id),
        is_active: Set(request.is_active),
        capabilities: Set(if request.capabilities.is_empty() {
            None
        } else {
            Some(request.capabilities.clone())
        }),
        created_at: Set(Utc::now().into()),
        updated_at: Set(Utc::now().into()),
        ..Default::default()
    };

    let created_bot = bots::Entity::insert(new_bot)
        .exec_with_returning(&txn)
        .await
        .map_err(|e| Error::Anyhow(anyhow::Error::new(e)))?;

    // Commit transaction
    txn.commit()
        .await
        .map_err(|e| Error::Anyhow(anyhow::Error::new(e)))?;

    Ok(CreateBotResponse {
        success: true,
        message: "Bot created successfully".to_string(),
        bot: Some(bot_to_proto(&created_bot)),
    })
}

/// Update Bot handler
pub async fn update_bot(
    State(state): State<AppState>,
    headers: Headers,
    request: UpdateBotRequest,
) -> Result<UpdateBotResponse, Error> {
    // Extract account_id and realm_id from JWT
    let account_id = extract_account_id_from_headers(&headers, &state.jwt_secret)?;
    let realm_id = extract_realm_id_from_account(account_id, &state.conn).await?;

    // Parse bot ID
    let bot_id = Uuid::parse_str(&request.id)
        .map_err(|_| Error::Anyhow(anyhow::anyhow!("Invalid bot ID format")))?;

    // Validate bot exists and belongs to user's realm
    let existing_bot = bots::Entity::find_by_id(bot_id)
        .one(&state.conn)
        .await
        .map_err(|e| Error::Anyhow(anyhow::Error::new(e)))?;

    let bot = existing_bot.ok_or(Error::NotFound)?;

    if bot.realm_id != realm_id {
        return Err(Error::Forbidden);
    }

    // Validate: bot name uniqueness within realm (excluding current bot)
    if !request.name.is_empty() && request.name != bot.name {
        let duplicate = bots::Entity::find()
            .filter(bots::COLUMN.realm_id.eq(realm_id))
            .filter(bots::COLUMN.name.eq(&request.name))
            .filter(bots::COLUMN.id.ne(bot_id))
            .one(&state.conn)
            .await
            .map_err(|e| Error::Anyhow(anyhow::Error::new(e)))?;

        if duplicate.is_some() {
            return Err(Error::Anyhow(anyhow::anyhow!(
                "Bot name '{}' already exists in this realm",
                request.name
            )));
        }
    }

    // Validate: at least one channel bridge must remain
    let final_api_bridge_id = if !request.api_channel_bridge_id.is_empty() {
        Some(
            Uuid::parse_str(&request.api_channel_bridge_id)
                .map_err(|_| Error::Anyhow(anyhow::anyhow!("Invalid API bridge ID format")))?,
        )
    } else {
        bot.api_channel_bridge_id
    };

    let final_oauth_bridge_id = if !request.oauth_channel_bridge_id.is_empty() {
        Some(
            Uuid::parse_str(&request.oauth_channel_bridge_id)
                .map_err(|_| Error::Anyhow(anyhow::anyhow!("Invalid OAuth bridge ID format")))?,
        )
    } else {
        bot.oauth_channel_bridge_id
    };

    if final_api_bridge_id.is_none() && final_oauth_bridge_id.is_none() {
        return Err(Error::Anyhow(anyhow::anyhow!(
            "At least one channel bridge (API or OAuth) must remain"
        )));
    }

    // Validate bridge IDs exist and belong to realm (if provided)
    if let Some(api_bridge_id) = final_api_bridge_id {
        let bridge = channel_bridge::Entity::find_by_id(api_bridge_id)
            .one(&state.conn)
            .await
            .map_err(|e| Error::Anyhow(anyhow::Error::new(e)))?;
        if bridge.is_none() {
            return Err(Error::Anyhow(anyhow::anyhow!(
                "API channel bridge not found"
            )));
        }
    }

    if let Some(oauth_bridge_id) = final_oauth_bridge_id {
        let bridge = channel_bridge::Entity::find_by_id(oauth_bridge_id)
            .one(&state.conn)
            .await
            .map_err(|e| Error::Anyhow(anyhow::Error::new(e)))?;
        if bridge.is_none() {
            return Err(Error::Anyhow(anyhow::anyhow!(
                "OAuth channel bridge not found"
            )));
        }
    }

    // Convert Model to ActiveModel and update fields
    let mut bot_active: bots::ActiveModel = bot.into();

    if !request.name.is_empty() {
        bot_active.name = Set(request.name.clone());
    }
    if !request.display_name.is_empty() {
        bot_active.display_name = Set(request.display_name.clone());
    }
    // Description: empty string means clear, non-empty means update
    // Note: protobuf doesn't support "omit to keep unchanged" for non-optional fields,
    // so frontend should send current value if unchanged, or empty string to clear
    if !request.description.is_empty() {
        bot_active.description = Set(Some(request.description.clone()));
    } else {
        // Empty string means clear
        bot_active.description = Set(None);
    }
    if let Some(is_active) = request.is_active {
        bot_active.is_active = Set(is_active);
    }
    if !request.capabilities.is_empty() {
        bot_active.capabilities = Set(Some(request.capabilities.clone()));
    }

    bot_active.api_channel_bridge_id = Set(final_api_bridge_id);
    bot_active.oauth_channel_bridge_id = Set(final_oauth_bridge_id);
    bot_active.updated_at = Set(Utc::now().into());

    // Update bot
    let updated_bot = bot_active
        .update(&state.conn)
        .await
        .map_err(|e| Error::Anyhow(anyhow::Error::new(e)))?;

    Ok(UpdateBotResponse {
        success: true,
        message: "Bot updated successfully".to_string(),
        bot: Some(bot_to_proto(&updated_bot)),
    })
}

/// Delete Bot handler
pub async fn delete_bot(
    State(state): State<AppState>,
    headers: Headers,
    request: DeleteBotRequest,
) -> Result<DeleteBotResponse, Error> {
    // Extract account_id and realm_id from JWT
    let account_id = extract_account_id_from_headers(&headers, &state.jwt_secret)?;
    let realm_id = extract_realm_id_from_account(account_id, &state.conn).await?;

    // Parse bot ID
    let bot_id = Uuid::parse_str(&request.id)
        .map_err(|_| Error::Anyhow(anyhow::anyhow!("Invalid bot ID format")))?;

    // Validate bot exists and belongs to user's realm
    let existing_bot = bots::Entity::find_by_id(bot_id)
        .one(&state.conn)
        .await
        .map_err(|e| Error::Anyhow(anyhow::Error::new(e)))?;

    let bot = existing_bot.ok_or(Error::NotFound)?;

    if bot.realm_id != realm_id {
        return Err(Error::Forbidden);
    }

    // TODO: Check if bot is in use (e.g., referenced by profiles, trips, chats, etc.)
    // For now, we'll allow deletion. CASCADE will handle related records per schema.

    // Delete bot
    let bot_active: bots::ActiveModel = bot.into();
    bot_active
        .delete(&state.conn)
        .await
        .map_err(|e| Error::Anyhow(anyhow::Error::new(e)))?;

    Ok(DeleteBotResponse {
        success: true,
        message: "Bot deleted successfully".to_string(),
    })
}
