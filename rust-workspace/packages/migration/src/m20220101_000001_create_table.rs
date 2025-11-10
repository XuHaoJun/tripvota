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
                    .col(ColumnDef::new(ChannelBridge::ThirdId).text().not_null())
                    .col(ColumnDef::new(ChannelBridge::ThirdSecret).text().not_null())
                    .col(
                        ColumnDef::new(ChannelBridge::ThirdProviderType)
                            .text()
                            .not_null()
                            .check(Expr::col(ChannelBridge::ThirdProviderType).is_in(vec!["line"])),
                    )
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

        // Create foreign key from profiles to channel_bridge
        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_profiles_channel_bridge")
                    .from(Profiles::Table, Profiles::ChannelBridgeId)
                    .to(ChannelBridge::Table, ChannelBridge::Id)
                    .to_owned(),
            )
            .await?;

        // Create unique index on profiles with WHERE clause (requires raw SQL)
        exec_raw_sql(manager, "CREATE UNIQUE INDEX idx_profiles_third_login ON profiles (third_provider_type, third_id) WHERE third_id IS NOT NULL AND third_provider_type IS NOT NULL").await?;

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

        // Create foreign key from trips to profiles
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
            .drop_table(Table::drop().table(ChannelBridge::Table).to_owned())
            .await?;

        Ok(())
    }
}

// Define table names as enums for type safety
#[derive(DeriveIden)]
enum ChannelBridge {
    Table,
    Id,
    ThirdId,
    ThirdSecret,
    ThirdProviderType,
    CreatedAt,
    UpdatedAt,
    Metadata,
}

#[derive(DeriveIden)]
enum Profiles {
    Table,
    Id,
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
