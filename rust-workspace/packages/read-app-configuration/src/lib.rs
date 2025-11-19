use dotenvy::from_path_override;
use figment::{
    Figment,
    providers::{Env, Format, Json},
};
use serde::Deserialize;

pub trait Extractable: for<'de> Deserialize<'de> {}

impl<T> Extractable for T where T: for<'de> Deserialize<'de> {}

pub fn read_app_configuration<T: Extractable>(
    project_dir: &str,
) -> Result<T, Box<dyn std::error::Error>> {
    // Load environment variables using dotenvy with override behavior
    // This achieves the InputThenEnv behavior where existing env vars take precedence
    from_path_override(format!("{}/.env", project_dir)).ok();

    // Create figment configuration and extract into the requested type
    let config: T = Figment::new()
        .merge(Json::file(format!("{}/appsettings.json", project_dir)))
        .merge(Env::raw())
        .extract()?;

    Ok(config)
}
