use sea_orm::ConnectionTrait;
use sea_orm_migration::prelude::*;
use sea_orm_migration::sea_query::{Expr, ForeignKey, Index};

#[derive(DeriveMigrationName)]
pub struct Migration;

// Helper function to execute raw SQL statements
// Uses ConnectionTrait's execute_unprepared method for PostgreSQL-specific features
// that don't have StatementBuilder implementations (PostGIS, partitioned tables, partial indexes)
async fn exec_raw_sql(manager: &SchemaManager<'_>, sql: &str) -> Result<(), DbErr> {
    manager.get_connection().execute_unprepared(sql).await?;
    Ok(())
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Enable PostGIS extension (if not already enabled)
        // NOTE: Raw SQL execution for PostgreSQL-specific features
        // These need to be executed manually or via a workaround
        exec_raw_sql(manager, "CREATE EXTENSION IF NOT EXISTS postgis").await?;

        // ============================================================================
        // Account and Realm Management
        // ============================================================================

        // Create accounts table
        manager
            .create_table(
                Table::create()
                    .table(Accounts::Table)
                    .col(
                        ColumnDef::new(Accounts::Id)
                            .uuid()
                            .not_null()
                            .default(Expr::cust("uuidv7()"))
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(Accounts::Username)
                            .text()
                            .not_null()
                            .unique_key(),
                    )
                    .col(
                        ColumnDef::new(Accounts::Email)
                            .text()
                            .not_null()
                            .unique_key(),
                    )
                    .col(
                        ColumnDef::new(Accounts::EmailVerified)
                            .boolean()
                            .not_null()
                            .default(false),
                    )
                    .col(ColumnDef::new(Accounts::PasswordHash).text())
                    .col(
                        ColumnDef::new(Accounts::IsActive)
                            .boolean()
                            .not_null()
                            .default(true),
                    )
                    .col(
                        ColumnDef::new(Accounts::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .col(
                        ColumnDef::new(Accounts::UpdatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .col(ColumnDef::new(Accounts::LastLoginAt).timestamp_with_time_zone())
                    .col(ColumnDef::new(Accounts::Metadata).json_binary())
                    .to_owned(),
            )
            .await?;

        // Create realms table
        manager
            .create_table(
                Table::create()
                    .table(Realms::Table)
                    .col(
                        ColumnDef::new(Realms::Id)
                            .uuid()
                            .not_null()
                            .default(Expr::cust("uuidv7()"))
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Realms::Name).text().not_null().unique_key())
                    .col(ColumnDef::new(Realms::DisplayName).text().not_null())
                    .col(ColumnDef::new(Realms::Description).text())
                    .col(
                        ColumnDef::new(Realms::IsActive)
                            .boolean()
                            .not_null()
                            .default(true),
                    )
                    .col(ColumnDef::new(Realms::CreatedBy).uuid().not_null())
                    .col(
                        ColumnDef::new(Realms::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .col(
                        ColumnDef::new(Realms::UpdatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .col(ColumnDef::new(Realms::Metadata).json_binary())
                    .to_owned(),
            )
            .await?;

        // Create foreign key from realms to accounts
        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_realms_created_by")
                    .from(Realms::Table, Realms::CreatedBy)
                    .to(Accounts::Table, Accounts::Id)
                    .to_owned(),
            )
            .await?;

        // Create identity_providers table
        manager
            .create_table(
                Table::create()
                    .table(IdentityProviders::Table)
                    .col(
                        ColumnDef::new(IdentityProviders::Id)
                            .uuid()
                            .not_null()
                            .default(Expr::cust("uuidv7()"))
                            .primary_key(),
                    )
                    .col(ColumnDef::new(IdentityProviders::RealmId).uuid().not_null())
                    .col(
                        ColumnDef::new(IdentityProviders::ProviderType)
                            .text()
                            .not_null()
                            .check(Expr::col(IdentityProviders::ProviderType).is_in(vec![
                                "local", "google", "line", "github", "facebook", "apple", "saml",
                                "oidc",
                            ])),
                    )
                    .col(ColumnDef::new(IdentityProviders::Alias).text().not_null())
                    .col(
                        ColumnDef::new(IdentityProviders::DisplayName)
                            .text()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(IdentityProviders::IsEnabled)
                            .boolean()
                            .not_null()
                            .default(true),
                    )
                    .col(ColumnDef::new(IdentityProviders::ClientId).text())
                    .col(ColumnDef::new(IdentityProviders::ClientSecret).text())
                    .col(ColumnDef::new(IdentityProviders::AuthorizationUrl).text())
                    .col(ColumnDef::new(IdentityProviders::TokenUrl).text())
                    .col(ColumnDef::new(IdentityProviders::UserInfoUrl).text())
                    .col(ColumnDef::new(IdentityProviders::SamlEntityId).text())
                    .col(ColumnDef::new(IdentityProviders::SamlSsoUrl).text())
                    .col(ColumnDef::new(IdentityProviders::SamlCertificate).text())
                    .col(
                        ColumnDef::new(IdentityProviders::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .col(
                        ColumnDef::new(IdentityProviders::UpdatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .col(ColumnDef::new(IdentityProviders::Metadata).json_binary())
                    .to_owned(),
            )
            .await?;

        // Add default_scopes column (TEXT[] array) using raw SQL
        exec_raw_sql(
            manager,
            "ALTER TABLE identity_providers ADD COLUMN default_scopes TEXT[]",
        )
        .await?;

        // Create foreign key from identity_providers to realms
        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_identity_providers_realm")
                    .from(IdentityProviders::Table, IdentityProviders::RealmId)
                    .to(Realms::Table, Realms::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        // Create unique constraint on identity_providers
        manager
            .create_index(
                Index::create()
                    .name("uq_identity_providers_realm_alias")
                    .table(IdentityProviders::Table)
                    .unique()
                    .col(IdentityProviders::RealmId)
                    .col(IdentityProviders::Alias)
                    .to_owned(),
            )
            .await?;

        // Create federated_identities table
        manager
            .create_table(
                Table::create()
                    .table(FederatedIdentities::Table)
                    .col(
                        ColumnDef::new(FederatedIdentities::AccountId)
                            .uuid()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(FederatedIdentities::IdentityProviderId)
                            .uuid()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(FederatedIdentities::ExternalUserId)
                            .text()
                            .not_null(),
                    )
                    .col(ColumnDef::new(FederatedIdentities::ExternalUsername).text())
                    .col(ColumnDef::new(FederatedIdentities::AccessToken).text())
                    .col(ColumnDef::new(FederatedIdentities::RefreshToken).text())
                    .col(
                        ColumnDef::new(FederatedIdentities::TokenExpiry).timestamp_with_time_zone(),
                    )
                    .col(
                        ColumnDef::new(FederatedIdentities::FirstLoginAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .col(
                        ColumnDef::new(FederatedIdentities::LastLoginAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .col(ColumnDef::new(FederatedIdentities::Metadata).json_binary())
                    .primary_key(
                        Index::create()
                            .name("pk_federated_identities")
                            .col(FederatedIdentities::AccountId)
                            .col(FederatedIdentities::IdentityProviderId),
                    )
                    .to_owned(),
            )
            .await?;

        // Create foreign keys for federated_identities
        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_federated_identities_account")
                    .from(FederatedIdentities::Table, FederatedIdentities::AccountId)
                    .to(Accounts::Table, Accounts::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_federated_identities_provider")
                    .from(
                        FederatedIdentities::Table,
                        FederatedIdentities::IdentityProviderId,
                    )
                    .to(IdentityProviders::Table, IdentityProviders::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        // Create unique constraint on federated_identities
        manager
            .create_index(
                Index::create()
                    .name("uq_federated_identities_provider_user")
                    .table(FederatedIdentities::Table)
                    .unique()
                    .col(FederatedIdentities::IdentityProviderId)
                    .col(FederatedIdentities::ExternalUserId)
                    .to_owned(),
            )
            .await?;

        // Create roles table
        manager
            .create_table(
                Table::create()
                    .table(Roles::Table)
                    .col(
                        ColumnDef::new(Roles::Id)
                            .uuid()
                            .not_null()
                            .default(Expr::cust("uuidv7()"))
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Roles::RealmId).uuid().not_null())
                    .col(ColumnDef::new(Roles::Name).text().not_null())
                    .col(ColumnDef::new(Roles::Description).text())
                    .col(
                        ColumnDef::new(Roles::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .to_owned(),
            )
            .await?;

        // Create foreign key from roles to realms
        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_roles_realm")
                    .from(Roles::Table, Roles::RealmId)
                    .to(Realms::Table, Realms::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        // Create unique constraint on roles
        manager
            .create_index(
                Index::create()
                    .name("uq_roles_realm_name")
                    .table(Roles::Table)
                    .unique()
                    .col(Roles::RealmId)
                    .col(Roles::Name)
                    .to_owned(),
            )
            .await?;

        // Create account_realm_roles table
        manager
            .create_table(
                Table::create()
                    .table(AccountRealmRoles::Table)
                    .col(
                        ColumnDef::new(AccountRealmRoles::AccountId)
                            .uuid()
                            .not_null(),
                    )
                    .col(ColumnDef::new(AccountRealmRoles::RealmId).uuid().not_null())
                    .col(ColumnDef::new(AccountRealmRoles::RoleId).uuid().not_null())
                    .col(
                        ColumnDef::new(AccountRealmRoles::GrantedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .col(ColumnDef::new(AccountRealmRoles::GrantedBy).uuid())
                    .primary_key(
                        Index::create()
                            .name("pk_account_realm_roles")
                            .col(AccountRealmRoles::AccountId)
                            .col(AccountRealmRoles::RealmId)
                            .col(AccountRealmRoles::RoleId),
                    )
                    .to_owned(),
            )
            .await?;

        // Create foreign keys for account_realm_roles
        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_account_realm_roles_account")
                    .from(AccountRealmRoles::Table, AccountRealmRoles::AccountId)
                    .to(Accounts::Table, Accounts::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_account_realm_roles_realm")
                    .from(AccountRealmRoles::Table, AccountRealmRoles::RealmId)
                    .to(Realms::Table, Realms::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_account_realm_roles_role")
                    .from(AccountRealmRoles::Table, AccountRealmRoles::RoleId)
                    .to(Roles::Table, Roles::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_account_realm_roles_granted_by")
                    .from(AccountRealmRoles::Table, AccountRealmRoles::GrantedBy)
                    .to(Accounts::Table, Accounts::Id)
                    .to_owned(),
            )
            .await?;

        // Create permissions table
        manager
            .create_table(
                Table::create()
                    .table(Permissions::Table)
                    .col(
                        ColumnDef::new(Permissions::Id)
                            .uuid()
                            .not_null()
                            .default(Expr::cust("uuidv7()"))
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Permissions::RealmId).uuid().not_null())
                    .col(ColumnDef::new(Permissions::RoleId).uuid().not_null())
                    .col(
                        ColumnDef::new(Permissions::ResourceType)
                            .text()
                            .not_null()
                            .check(
                                Expr::col(Permissions::ResourceType)
                                    .is_in(vec!["bot", "trip", "profile", "chat", "realm"]),
                            ),
                    )
                    .col(
                        ColumnDef::new(Permissions::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .to_owned(),
            )
            .await?;

        // Add actions column (TEXT[] array) using raw SQL
        exec_raw_sql(
            manager,
            "ALTER TABLE permissions ADD COLUMN actions TEXT[] NOT NULL",
        )
        .await?;

        // Create foreign keys for permissions
        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_permissions_realm")
                    .from(Permissions::Table, Permissions::RealmId)
                    .to(Realms::Table, Realms::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_permissions_role")
                    .from(Permissions::Table, Permissions::RoleId)
                    .to(Roles::Table, Roles::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        // Create unique constraint on permissions
        manager
            .create_index(
                Index::create()
                    .name("uq_permissions_realm_role_resource")
                    .table(Permissions::Table)
                    .unique()
                    .col(Permissions::RealmId)
                    .col(Permissions::RoleId)
                    .col(Permissions::ResourceType)
                    .to_owned(),
            )
            .await?;

        // Create indexes for accounts and realms
        manager
            .create_index(
                Index::create()
                    .name("idx_accounts_email")
                    .table(Accounts::Table)
                    .col(Accounts::Email)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_accounts_username")
                    .table(Accounts::Table)
                    .col(Accounts::Username)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_accounts_last_login")
                    .table(Accounts::Table)
                    .col(Accounts::LastLoginAt)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_identity_providers_realm")
                    .table(IdentityProviders::Table)
                    .col(IdentityProviders::RealmId)
                    .to_owned(),
            )
            .await?;

        exec_raw_sql(
            manager,
            "CREATE INDEX idx_identity_providers_enabled ON identity_providers (realm_id, is_enabled) WHERE is_enabled = true",
        )
        .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_federated_identities_account")
                    .table(FederatedIdentities::Table)
                    .col(FederatedIdentities::AccountId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_federated_identities_provider")
                    .table(FederatedIdentities::Table)
                    .col(FederatedIdentities::IdentityProviderId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_federated_identities_external_user")
                    .table(FederatedIdentities::Table)
                    .col(FederatedIdentities::IdentityProviderId)
                    .col(FederatedIdentities::ExternalUserId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_realms_created_by")
                    .table(Realms::Table)
                    .col(Realms::CreatedBy)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_roles_realm")
                    .table(Roles::Table)
                    .col(Roles::RealmId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_account_realm_roles_account")
                    .table(AccountRealmRoles::Table)
                    .col(AccountRealmRoles::AccountId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_account_realm_roles_realm")
                    .table(AccountRealmRoles::Table)
                    .col(AccountRealmRoles::RealmId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_permissions_realm_role")
                    .table(Permissions::Table)
                    .col(Permissions::RealmId)
                    .col(Permissions::RoleId)
                    .to_owned(),
            )
            .await?;

        // ============================================================================
        // Channel Bridge Tables
        // ============================================================================

        // Create channel_bridge table
        manager
            .create_table(
                Table::create()
                    .table(ChannelBridge::Table)
                    .col(
                        ColumnDef::new(ChannelBridge::Id)
                            .uuid()
                            .not_null()
                            .default(Expr::cust("uuidv7()"))
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(ChannelBridge::BridgeType)
                            .text()
                            .not_null()
                            .check(
                                Expr::col(ChannelBridge::BridgeType).is_in(vec!["oauth", "api"]),
                            ),
                    )
                    .col(
                        ColumnDef::new(ChannelBridge::ThirdProviderType)
                            .text()
                            .not_null()
                            .check(Expr::col(ChannelBridge::ThirdProviderType).is_in(vec!["line"])),
                    )
                    .col(ColumnDef::new(ChannelBridge::ThirdId).text().not_null())
                    .col(ColumnDef::new(ChannelBridge::ThirdSecret).text().not_null())
                    .col(ColumnDef::new(ChannelBridge::AccessToken).text())
                    .col(ColumnDef::new(ChannelBridge::RefreshToken).text())
                    .col(ColumnDef::new(ChannelBridge::TokenExpiry).timestamp_with_time_zone())
                    .col(ColumnDef::new(ChannelBridge::ApiEndpoint).text())
                    .col(ColumnDef::new(ChannelBridge::ApiVersion).text())
                    .col(
                        ColumnDef::new(ChannelBridge::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .col(
                        ColumnDef::new(ChannelBridge::UpdatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .col(ColumnDef::new(ChannelBridge::Metadata).json_binary())
                    .to_owned(),
            )
            .await?;

        // Add oauth_scopes column (TEXT[] array) using raw SQL
        exec_raw_sql(
            manager,
            "ALTER TABLE channel_bridge ADD COLUMN oauth_scopes TEXT[]",
        )
        .await?;

        // Create unique index on channel_bridge
        manager
            .create_index(
                Index::create()
                    .name("idx_channel_bridge_third_login")
                    .table(ChannelBridge::Table)
                    .unique()
                    .col(ChannelBridge::ThirdProviderType)
                    .col(ChannelBridge::ThirdId)
                    .to_owned(),
            )
            .await?;

        // Create partial index for OAuth token expiry (requires raw SQL for WHERE clause)
        exec_raw_sql(
            manager,
            "CREATE INDEX idx_channel_bridge_oauth_expiry ON channel_bridge (token_expiry) WHERE bridge_type = 'oauth' AND token_expiry IS NOT NULL",
        )
        .await?;

        // Create bots table
        manager
            .create_table(
                Table::create()
                    .table(Bots::Table)
                    .col(
                        ColumnDef::new(Bots::Id)
                            .uuid()
                            .not_null()
                            .default(Expr::cust("uuidv7()"))
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Bots::RealmId).uuid().not_null())
                    .col(ColumnDef::new(Bots::Name).text().not_null())
                    .col(ColumnDef::new(Bots::DisplayName).text().not_null())
                    .col(ColumnDef::new(Bots::Description).text())
                    .col(ColumnDef::new(Bots::ApiChannelBridgeId).uuid())
                    .col(ColumnDef::new(Bots::OauthChannelBridgeId).uuid())
                    .col(
                        ColumnDef::new(Bots::IsActive)
                            .boolean()
                            .not_null()
                            .default(true),
                    )
                    .col(
                        ColumnDef::new(Bots::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .col(
                        ColumnDef::new(Bots::UpdatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .col(ColumnDef::new(Bots::Metadata).json_binary())
                    .to_owned(),
            )
            .await?;

        // Add capabilities column (TEXT[] array) using raw SQL
        exec_raw_sql(manager, "ALTER TABLE bots ADD COLUMN capabilities TEXT[]").await?;

        // Add CHECK constraint for bots (requires raw SQL)
        exec_raw_sql(
            manager,
            "ALTER TABLE bots ADD CONSTRAINT bots_bridge_check CHECK (api_channel_bridge_id IS NOT NULL OR oauth_channel_bridge_id IS NOT NULL)",
        )
        .await?;

        // Create foreign keys from bots to realms and channel_bridge
        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_bots_realm")
                    .from(Bots::Table, Bots::RealmId)
                    .to(Realms::Table, Realms::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_bots_api_channel_bridge")
                    .from(Bots::Table, Bots::ApiChannelBridgeId)
                    .to(ChannelBridge::Table, ChannelBridge::Id)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_bots_oauth_channel_bridge")
                    .from(Bots::Table, Bots::OauthChannelBridgeId)
                    .to(ChannelBridge::Table, ChannelBridge::Id)
                    .to_owned(),
            )
            .await?;

        // Create indexes on bots (with WHERE clauses require raw SQL)
        manager
            .create_index(
                Index::create()
                    .name("idx_bots_realm")
                    .table(Bots::Table)
                    .col(Bots::RealmId)
                    .to_owned(),
            )
            .await?;

        exec_raw_sql(
            manager,
            "CREATE INDEX idx_bots_api_bridge ON bots (api_channel_bridge_id) WHERE api_channel_bridge_id IS NOT NULL",
        )
        .await?;

        exec_raw_sql(
            manager,
            "CREATE INDEX idx_bots_oauth_bridge ON bots (oauth_channel_bridge_id) WHERE oauth_channel_bridge_id IS NOT NULL",
        )
        .await?;

        exec_raw_sql(
            manager,
            "CREATE INDEX idx_bots_active ON bots (is_active) WHERE is_active = true",
        )
        .await?;

        // Create profiles table
        manager
            .create_table(
                Table::create()
                    .table(Profiles::Table)
                    .col(
                        ColumnDef::new(Profiles::Id)
                            .uuid()
                            .not_null()
                            .default(Expr::cust("uuidv7()"))
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Profiles::RealmId).uuid().not_null())
                    .col(ColumnDef::new(Profiles::Username).text().not_null())
                    .col(ColumnDef::new(Profiles::Email).text().not_null())
                    .col(ColumnDef::new(Profiles::Phone).text().not_null())
                    .col(ColumnDef::new(Profiles::ThirdId).text())
                    .col(ColumnDef::new(Profiles::ThirdProviderType).text())
                    .col(ColumnDef::new(Profiles::ChannelBridgeId).uuid())
                    .col(
                        ColumnDef::new(Profiles::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .col(ColumnDef::new(Profiles::Metadata).json_binary())
                    .to_owned(),
            )
            .await?;

        // Create foreign keys from profiles to realms and channel_bridge
        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_profiles_realm")
                    .from(Profiles::Table, Profiles::RealmId)
                    .to(Realms::Table, Realms::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_profiles_channel_bridge")
                    .from(Profiles::Table, Profiles::ChannelBridgeId)
                    .to(ChannelBridge::Table, ChannelBridge::Id)
                    .to_owned(),
            )
            .await?;

        // Create indexes on profiles
        manager
            .create_index(
                Index::create()
                    .name("idx_profiles_realm")
                    .table(Profiles::Table)
                    .col(Profiles::RealmId)
                    .to_owned(),
            )
            .await?;

        // Create unique index on profiles with WHERE clause (requires raw SQL)
        exec_raw_sql(manager, "CREATE UNIQUE INDEX idx_profiles_third_login ON profiles (realm_id, third_provider_type, third_id) WHERE third_id IS NOT NULL AND third_provider_type IS NOT NULL").await?;

        // Create trips table
        manager
            .create_table(
                Table::create()
                    .table(Trips::Table)
                    .col(
                        ColumnDef::new(Trips::Id)
                            .uuid()
                            .not_null()
                            .default(Expr::cust("uuidv7()"))
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Trips::RealmId).uuid().not_null())
                    .col(ColumnDef::new(Trips::CreatedBy).uuid().not_null())
                    .col(ColumnDef::new(Trips::Title).text().not_null())
                    .col(ColumnDef::new(Trips::Description).text())
                    .col(ColumnDef::new(Trips::Destination).text())
                    .col(ColumnDef::new(Trips::StartDate).date())
                    .col(ColumnDef::new(Trips::EndDate).date())
                    .col(
                        ColumnDef::new(Trips::Status)
                            .text()
                            .not_null()
                            .default("planning")
                            .check(Expr::col(Trips::Status).is_in(vec![
                                "planning",
                                "confirmed",
                                "in_progress",
                                "completed",
                                "cancelled",
                            ])),
                    )
                    .col(
                        ColumnDef::new(Trips::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .col(
                        ColumnDef::new(Trips::UpdatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .col(ColumnDef::new(Trips::Metadata).json_binary())
                    .to_owned(),
            )
            .await?;

        // Create foreign keys from trips to realms and profiles
        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_trips_realm")
                    .from(Trips::Table, Trips::RealmId)
                    .to(Realms::Table, Realms::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_trips_created_by")
                    .from(Trips::Table, Trips::CreatedBy)
                    .to(Profiles::Table, Profiles::Id)
                    .to_owned(),
            )
            .await?;

        // Create indexes on trips
        manager
            .create_index(
                Index::create()
                    .name("idx_trips_realm")
                    .table(Trips::Table)
                    .col(Trips::RealmId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_trips_status")
                    .table(Trips::Table)
                    .col(Trips::Status)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_trips_dates")
                    .table(Trips::Table)
                    .col(Trips::StartDate)
                    .col(Trips::EndDate)
                    .to_owned(),
            )
            .await?;

        // Create trip_participants table
        manager
            .create_table(
                Table::create()
                    .table(TripParticipants::Table)
                    .col(ColumnDef::new(TripParticipants::TripId).uuid().not_null())
                    .col(
                        ColumnDef::new(TripParticipants::ProfileId)
                            .uuid()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(TripParticipants::Role)
                            .text()
                            .not_null()
                            .default("participant")
                            .check(Expr::col(TripParticipants::Role).is_in(vec![
                                "owner",
                                "participant",
                                "invited",
                            ])),
                    )
                    .col(
                        ColumnDef::new(TripParticipants::JoinedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .primary_key(
                        Index::create()
                            .name("pk_trip_participants")
                            .col(TripParticipants::TripId)
                            .col(TripParticipants::ProfileId),
                    )
                    .to_owned(),
            )
            .await?;

        // Create foreign keys for trip_participants
        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_trip_participants_trip")
                    .from(TripParticipants::Table, TripParticipants::TripId)
                    .to(Trips::Table, Trips::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_trip_participants_profile")
                    .from(TripParticipants::Table, TripParticipants::ProfileId)
                    .to(Profiles::Table, Profiles::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        // Create indexes on trip_participants
        manager
            .create_index(
                Index::create()
                    .name("idx_trip_participants_profile")
                    .table(TripParticipants::Table)
                    .col(TripParticipants::ProfileId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_trip_participants_trip")
                    .table(TripParticipants::Table)
                    .col(TripParticipants::TripId)
                    .to_owned(),
            )
            .await?;

        // Create trip_cards table
        manager
            .create_table(
                Table::create()
                    .table(TripCards::Table)
                    .col(
                        ColumnDef::new(TripCards::Id)
                            .uuid()
                            .not_null()
                            .default(Expr::cust("uuidv7()"))
                            .primary_key(),
                    )
                    .col(ColumnDef::new(TripCards::TripId).uuid().not_null())
                    .col(ColumnDef::new(TripCards::CreatedBy).uuid().not_null())
                    .col(ColumnDef::new(TripCards::Title).text().not_null())
                    .col(ColumnDef::new(TripCards::Description).text())
                    .col(ColumnDef::new(TripCards::Category).text())
                    .col(ColumnDef::new(TripCards::StartTime).timestamp_with_time_zone())
                    .col(ColumnDef::new(TripCards::EndTime).timestamp_with_time_zone())
                    .col(
                        ColumnDef::new(TripCards::Status)
                            .text()
                            .not_null()
                            .default("draft")
                            .check(Expr::col(TripCards::Status).is_in(vec![
                                "draft",
                                "scheduled",
                                "completed",
                                "cancelled",
                            ])),
                    )
                    .col(ColumnDef::new(TripCards::DisplayOrder).integer().default(0))
                    .col(
                        ColumnDef::new(TripCards::VoteCount)
                            .integer()
                            .not_null()
                            .default(0),
                    )
                    .col(ColumnDef::new(TripCards::VoteData).json_binary())
                    .col(
                        ColumnDef::new(TripCards::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .col(
                        ColumnDef::new(TripCards::UpdatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .col(ColumnDef::new(TripCards::Metadata).json_binary())
                    .to_owned(),
            )
            .await?;

        // Add GEOGRAPHY column for position (PostGIS) using raw SQL
        exec_raw_sql(
            manager,
            "ALTER TABLE trip_cards ADD COLUMN position GEOGRAPHY(POINT, 4326)",
        )
        .await?;

        // Create foreign keys for trip_cards
        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_trip_cards_trip")
                    .from(TripCards::Table, TripCards::TripId)
                    .to(Trips::Table, Trips::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_trip_cards_created_by")
                    .from(TripCards::Table, TripCards::CreatedBy)
                    .to(Profiles::Table, Profiles::Id)
                    .to_owned(),
            )
            .await?;

        // Create indexes on trip_cards
        manager
            .create_index(
                Index::create()
                    .name("idx_trip_cards_trip_status")
                    .table(TripCards::Table)
                    .col(TripCards::TripId)
                    .col(TripCards::Status)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_trip_cards_trip_date")
                    .table(TripCards::Table)
                    .col(TripCards::TripId)
                    .col(TripCards::StartTime)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_trip_cards_created_by")
                    .table(TripCards::Table)
                    .col(TripCards::CreatedBy)
                    .to_owned(),
            )
            .await?;

        // Create partial index on category (requires raw SQL for WHERE clause)
        exec_raw_sql(manager, "CREATE INDEX idx_trip_cards_category ON trip_cards (category) WHERE category IS NOT NULL").await?;

        // Create GIST spatial index on position (requires raw SQL)
        exec_raw_sql(manager, "CREATE INDEX idx_trip_cards_position ON trip_cards USING GIST (position) WHERE position IS NOT NULL").await?;

        // Create trip_card_rich_text table
        manager
            .create_table(
                Table::create()
                    .table(TripCardRichText::Table)
                    .col(
                        ColumnDef::new(TripCardRichText::TripCardId)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(TripCardRichText::Content)
                            .json_binary()
                            .not_null(),
                    )
                    .col(ColumnDef::new(TripCardRichText::LastEditedBy).uuid())
                    .col(
                        ColumnDef::new(TripCardRichText::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .col(
                        ColumnDef::new(TripCardRichText::UpdatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .to_owned(),
            )
            .await?;

        // Create foreign keys for trip_card_rich_text
        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_trip_card_rich_text_trip_card")
                    .from(TripCardRichText::Table, TripCardRichText::TripCardId)
                    .to(TripCards::Table, TripCards::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_trip_card_rich_text_last_edited_by")
                    .from(TripCardRichText::Table, TripCardRichText::LastEditedBy)
                    .to(Profiles::Table, Profiles::Id)
                    .to_owned(),
            )
            .await?;

        // Create trip_card_votes table
        manager
            .create_table(
                Table::create()
                    .table(TripCardVotes::Table)
                    .col(ColumnDef::new(TripCardVotes::TripCardId).uuid().not_null())
                    .col(ColumnDef::new(TripCardVotes::ProfileId).uuid().not_null())
                    .col(
                        ColumnDef::new(TripCardVotes::VoteType)
                            .text()
                            .not_null()
                            .default("upvote")
                            .check(
                                Expr::col(TripCardVotes::VoteType)
                                    .is_in(vec!["upvote", "downvote"]),
                            ),
                    )
                    .col(
                        ColumnDef::new(TripCardVotes::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .primary_key(
                        Index::create()
                            .name("pk_trip_card_votes")
                            .col(TripCardVotes::TripCardId)
                            .col(TripCardVotes::ProfileId),
                    )
                    .to_owned(),
            )
            .await?;

        // Create foreign keys for trip_card_votes
        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_trip_card_votes_trip_card")
                    .from(TripCardVotes::Table, TripCardVotes::TripCardId)
                    .to(TripCards::Table, TripCards::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_trip_card_votes_profile")
                    .from(TripCardVotes::Table, TripCardVotes::ProfileId)
                    .to(Profiles::Table, Profiles::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        // Create indexes on trip_card_votes
        manager
            .create_index(
                Index::create()
                    .name("idx_trip_card_votes_card")
                    .table(TripCardVotes::Table)
                    .col(TripCardVotes::TripCardId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_trip_card_votes_profile")
                    .table(TripCardVotes::Table)
                    .col(TripCardVotes::ProfileId)
                    .to_owned(),
            )
            .await?;

        // Create chats table
        manager
            .create_table(
                Table::create()
                    .table(Chats::Table)
                    .col(
                        ColumnDef::new(Chats::Id)
                            .uuid()
                            .not_null()
                            .default(Expr::cust("uuidv7()"))
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Chats::TripId).uuid())
                    .col(ColumnDef::new(Chats::CreatedBy).uuid().not_null())
                    .col(ColumnDef::new(Chats::Title).text())
                    .col(
                        ColumnDef::new(Chats::IsMain)
                            .boolean()
                            .not_null()
                            .default(false),
                    )
                    .col(
                        ColumnDef::new(Chats::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .col(ColumnDef::new(Chats::Metadata).json_binary())
                    .to_owned(),
            )
            .await?;

        // Create foreign keys for chats
        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_chats_trip")
                    .from(Chats::Table, Chats::TripId)
                    .to(Trips::Table, Trips::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_chats_created_by")
                    .from(Chats::Table, Chats::CreatedBy)
                    .to(Profiles::Table, Profiles::Id)
                    .to_owned(),
            )
            .await?;

        // Create indexes on chats (with WHERE clauses require raw SQL)
        exec_raw_sql(
            manager,
            "CREATE INDEX idx_chats_trip_id ON chats (trip_id) WHERE trip_id IS NOT NULL",
        )
        .await?;
        exec_raw_sql(manager, "CREATE UNIQUE INDEX idx_chats_trip_main ON chats (trip_id) WHERE trip_id IS NOT NULL AND is_main").await?;

        // Create chat_participants table
        manager
            .create_table(
                Table::create()
                    .table(ChatParticipants::Table)
                    .col(ColumnDef::new(ChatParticipants::ChatId).uuid().not_null())
                    .col(
                        ColumnDef::new(ChatParticipants::ProfileId)
                            .uuid()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(ChatParticipants::Role)
                            .text()
                            .not_null()
                            .default("participant")
                            .check(
                                Expr::col(ChatParticipants::Role)
                                    .is_in(vec!["owner", "participant"]),
                            ),
                    )
                    .col(
                        ColumnDef::new(ChatParticipants::JoinedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::cust("now()")),
                    )
                    .primary_key(
                        Index::create()
                            .name("pk_chat_participants")
                            .col(ChatParticipants::ChatId)
                            .col(ChatParticipants::ProfileId),
                    )
                    .to_owned(),
            )
            .await?;

        // Create foreign keys for chat_participants
        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_chat_participants_chat")
                    .from(ChatParticipants::Table, ChatParticipants::ChatId)
                    .to(Chats::Table, Chats::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_chat_participants_profile")
                    .from(ChatParticipants::Table, ChatParticipants::ProfileId)
                    .to(Profiles::Table, Profiles::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        // Create index on chat_participants
        manager
            .create_index(
                Index::create()
                    .name("idx_chat_participants_profile")
                    .table(ChatParticipants::Table)
                    .col(ChatParticipants::ProfileId)
                    .to_owned(),
            )
            .await?;

        // Create messages table (partitioned)
        // Note: Sea-ORM doesn't have built-in support for partitioned tables, so we use raw SQL
        exec_raw_sql(
            manager,
            r#"
            CREATE TABLE messages (
                id uuid DEFAULT uuidv7(),
                chat_id uuid NOT NULL,
                sender_role TEXT NOT NULL CHECK (sender_role IN ('user', 'assistant')),
                content TEXT NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                metadata JSONB,
                UNIQUE (id, created_at),
                PRIMARY KEY (chat_id, id, created_at)
            ) PARTITION BY RANGE (created_at)
        "#,
        )
        .await?;

        // Create foreign key for messages (must use raw SQL after table creation)
        exec_raw_sql(manager, "ALTER TABLE messages ADD CONSTRAINT fk_messages_chat FOREIGN KEY (chat_id) REFERENCES chats(id)").await?;

        // Create index on messages
        exec_raw_sql(
            manager,
            "CREATE INDEX idx_messages_chat_timestamp ON messages (chat_id, created_at DESC)",
        )
        .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Drop tables in reverse order of creation (to handle foreign key dependencies)
        manager
            .drop_table(Table::drop().table(Messages::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(ChatParticipants::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(Chats::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(TripCardVotes::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(TripCardRichText::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(TripCards::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(TripParticipants::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(Trips::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(Profiles::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(Bots::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(ChannelBridge::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(Permissions::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(AccountRealmRoles::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(Roles::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(FederatedIdentities::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(IdentityProviders::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(Realms::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(Accounts::Table).to_owned())
            .await?;

        Ok(())
    }
}

// Define table names as enums for type safety
#[derive(DeriveIden)]
enum Accounts {
    Table,
    Id,
    Username,
    Email,
    EmailVerified,
    PasswordHash,
    IsActive,
    CreatedAt,
    UpdatedAt,
    LastLoginAt,
    Metadata,
}

#[derive(DeriveIden)]
enum Realms {
    Table,
    Id,
    Name,
    DisplayName,
    Description,
    IsActive,
    CreatedBy,
    CreatedAt,
    UpdatedAt,
    Metadata,
}

#[derive(DeriveIden)]
enum IdentityProviders {
    Table,
    Id,
    RealmId,
    ProviderType,
    Alias,
    DisplayName,
    IsEnabled,
    ClientId,
    ClientSecret,
    AuthorizationUrl,
    TokenUrl,
    UserInfoUrl,
    SamlEntityId,
    SamlSsoUrl,
    SamlCertificate,
    #[allow(dead_code)] // DefaultScopes column is added via raw SQL (TEXT[] array type)
    DefaultScopes,
    CreatedAt,
    UpdatedAt,
    Metadata,
}

#[derive(DeriveIden)]
enum FederatedIdentities {
    Table,
    AccountId,
    IdentityProviderId,
    ExternalUserId,
    ExternalUsername,
    AccessToken,
    RefreshToken,
    TokenExpiry,
    FirstLoginAt,
    LastLoginAt,
    Metadata,
}

#[derive(DeriveIden)]
enum Roles {
    Table,
    Id,
    RealmId,
    Name,
    Description,
    CreatedAt,
}

#[derive(DeriveIden)]
enum AccountRealmRoles {
    Table,
    AccountId,
    RealmId,
    RoleId,
    GrantedAt,
    GrantedBy,
}

#[derive(DeriveIden)]
enum Permissions {
    Table,
    Id,
    RealmId,
    RoleId,
    ResourceType,
    #[allow(dead_code)] // Actions column is added via raw SQL (TEXT[] array type)
    Actions,
    CreatedAt,
}

#[derive(DeriveIden)]
enum ChannelBridge {
    Table,
    Id,
    BridgeType,
    ThirdProviderType,
    ThirdId,
    ThirdSecret,
    AccessToken,
    RefreshToken,
    TokenExpiry,
    #[allow(dead_code)] // OauthScopes column is added via raw SQL (TEXT[] array type)
    OauthScopes,
    ApiEndpoint,
    ApiVersion,
    CreatedAt,
    UpdatedAt,
    Metadata,
}

#[derive(DeriveIden)]
enum Bots {
    Table,
    Id,
    RealmId,
    Name,
    DisplayName,
    Description,
    ApiChannelBridgeId,
    OauthChannelBridgeId,
    IsActive,
    #[allow(dead_code)] // Capabilities column is added via raw SQL (TEXT[] array type)
    Capabilities,
    CreatedAt,
    UpdatedAt,
    Metadata,
}

#[derive(DeriveIden)]
enum Profiles {
    Table,
    Id,
    RealmId,
    Username,
    Email,
    Phone,
    ThirdId,
    ThirdProviderType,
    ChannelBridgeId,
    CreatedAt,
    Metadata,
}

#[derive(DeriveIden)]
enum Trips {
    Table,
    Id,
    RealmId,
    CreatedBy,
    Title,
    Description,
    Destination,
    StartDate,
    EndDate,
    Status,
    CreatedAt,
    UpdatedAt,
    Metadata,
}

#[derive(DeriveIden)]
enum TripParticipants {
    Table,
    TripId,
    ProfileId,
    Role,
    JoinedAt,
}

#[derive(DeriveIden)]
enum TripCards {
    Table,
    Id,
    TripId,
    CreatedBy,
    Title,
    Description,
    Category,
    #[allow(dead_code)] // Position column is added via raw SQL (PostGIS GEOGRAPHY type)
    Position,
    StartTime,
    EndTime,
    Status,
    DisplayOrder,
    VoteCount,
    VoteData,
    CreatedAt,
    UpdatedAt,
    Metadata,
}

#[derive(DeriveIden)]
enum TripCardRichText {
    Table,
    TripCardId,
    Content,
    LastEditedBy,
    CreatedAt,
    UpdatedAt,
}

#[derive(DeriveIden)]
enum TripCardVotes {
    Table,
    TripCardId,
    ProfileId,
    VoteType,
    CreatedAt,
}

#[derive(DeriveIden)]
enum Chats {
    Table,
    Id,
    TripId,
    CreatedBy,
    Title,
    IsMain,
    CreatedAt,
    Metadata,
}

#[derive(DeriveIden)]
enum ChatParticipants {
    Table,
    ChatId,
    ProfileId,
    Role,
    JoinedAt,
}

#[derive(DeriveIden)]
enum Messages {
    Table,
}
