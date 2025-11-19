use serde::Deserialize;
use dotenvy::{EnvLoader, EnvSequence};
use figment::{Figment, providers::{Json, Env}};

#[derive(Deserialize)]
pub struct AppConfiguration {
    pub database_url: String,
}

pub fn read_configuration() -> Result<AppConfiguration, Box<dyn std::error::Error>> {
    // Load environment variables using dotenvy with the specified pattern
    let loader = EnvLoader::with_path("../env-example").sequence(EnvSequence::InputThenEnv);
    unsafe { loader.load_and_modify() }?;

    // Use figment to extract configuration
    let config: AppConfiguration = Figment::new()
        .merge(Json::file("appsettings.json"))
        .merge(Env::raw().only(&["DATABASE_URL"]))
        .extract()?;

    Ok(config)
}
