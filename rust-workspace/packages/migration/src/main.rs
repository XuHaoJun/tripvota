use sea_orm_migration::prelude::*;
use serde::Deserialize;

#[derive(Deserialize, Debug)]
struct MigrationConfiguration {
    database_url: String,
}

#[tokio::main]
async fn main() {
    // Read configuration from appsettings.json
    let config: MigrationConfiguration = read_app_configuration::read_app_configuration(".")
        .expect("Failed to read migration configuration");

    // Set DATABASE_URL in environment if not already set
    // This allows sea_orm_migration::cli::run_cli to read it
    // Safe: We're setting this at the start of main before any concurrent operations
    if std::env::var("DATABASE_URL").is_err() {
        unsafe {
            std::env::set_var("DATABASE_URL", &config.database_url);
        }
    }

    cli::run_cli(migration::Migrator).await;
}
