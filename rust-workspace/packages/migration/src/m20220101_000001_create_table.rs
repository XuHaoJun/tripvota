use sea_orm_migration::prelude::*;
use sea_orm_migration::sea_query::{Expr, ForeignKey, Index, IndexOrder};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let mut fk_conversations_user_id = ForeignKey::create()
            .name("fk_conversations_user_id")
            .from(Conversations::Table, Conversations::UserId)
            .to(Users::Table, Users::Id)
            .to_owned();

        manager
            .create_table(
                Table::create()
                    .table(Users::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Users::Id)
                            .uuid()
                            .not_null()
                            .default(Expr::cust("uuidv7()"))
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(Users::Username)
                            .text()
                            .not_null()
                            .unique_key(),
                    )
                    .col(
                        ColumnDef::new(Users::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(Conversations::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Conversations::Id)
                            .uuid()
                            .not_null()
                            .default(Expr::cust("uuidv7()"))
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Conversations::UserId).uuid().not_null())
                    .col(ColumnDef::new(Conversations::Title).text())
                    .col(
                        ColumnDef::new(Conversations::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(ColumnDef::new(Conversations::Metadata).json_binary())
                    .foreign_key(&mut fk_conversations_user_id)
                    .to_owned(),
            )
            .await?;

        let mut messages_pk = Index::create()
            .name("pk_messages")
            .col(Messages::ConversationId)
            .col(Messages::Id)
            .col(Messages::CreatedAt)
            .to_owned();

        let mut fk_messages_conversation_id = ForeignKey::create()
            .name("fk_messages_conversation_id")
            .from(Messages::Table, Messages::ConversationId)
            .to(Conversations::Table, Conversations::Id)
            .to_owned();

        manager
            .create_table(
                Table::create()
                    .table(Messages::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Messages::Id)
                            .uuid()
                            .not_null()
                            .default(Expr::cust("uuidv7()")),
                    )
                    .col(ColumnDef::new(Messages::ConversationId).uuid().not_null())
                    .col(ColumnDef::new(Messages::SenderRole).text().not_null())
                    .col(ColumnDef::new(Messages::Content).text().not_null())
                    .col(
                        ColumnDef::new(Messages::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(ColumnDef::new(Messages::Metadata).json_binary())
                    .check(Expr::col(Messages::SenderRole).is_in(["user", "assistant"]))
                    .primary_key(&mut messages_pk)
                    .foreign_key(&mut fk_messages_conversation_id)
                    .extra("PARTITION BY RANGE (created_at)")
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name(INDEX_MESSAGES_CONVERSATION_TIMESTAMP)
                    .table(Messages::Table)
                    .col(Messages::ConversationId)
                    .col((Messages::CreatedAt, IndexOrder::Desc))
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_index(
                Index::drop()
                    .name(INDEX_MESSAGES_CONVERSATION_TIMESTAMP)
                    .table(Messages::Table)
                    .if_exists()
                    .to_owned(),
            )
            .await?;

        manager
            .drop_table(Table::drop().table(Messages::Table).if_exists().to_owned())
            .await?;

        manager
            .drop_table(
                Table::drop()
                    .table(Conversations::Table)
                    .if_exists()
                    .to_owned(),
            )
            .await?;

        manager
            .drop_table(Table::drop().table(Users::Table).if_exists().to_owned())
            .await
    }
}

const INDEX_MESSAGES_CONVERSATION_TIMESTAMP: &str = "idx_messages_conversation_timestamp";

#[derive(Iden)]
enum Users {
    Table,
    Id,
    Username,
    CreatedAt,
}

#[derive(Iden)]
enum Conversations {
    Table,
    Id,
    UserId,
    Title,
    CreatedAt,
    Metadata,
}

#[derive(Iden)]
enum Messages {
    Table,
    Id,
    ConversationId,
    SenderRole,
    Content,
    CreatedAt,
    Metadata,
}
