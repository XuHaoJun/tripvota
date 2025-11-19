use async_stream::stream;
use auth::service::*; // Import auth service handlers
use axum::Router;
use axum_connect::{futures::Stream, prelude::*};
use error::Error;
use proto::auth::*; // Import auth proto
use proto::hello::*;
use sea_orm::{Database, DatabaseConnection};
use serde::Deserialize;
use tower_http::cors::CorsLayer;

// Take a peak at error.rs to see how errors work in axum-connect.
mod auth;
mod error; // Register auth module

#[derive(Clone)]
struct AppState {
    conn: DatabaseConnection,
}

#[derive(Deserialize, Debug)]
struct AppConfiguration {
    database_url: String,
}

mod proto {
    // Include the generated code in a `proto` module.
    pub mod hello {
        include!(concat!(env!("OUT_DIR"), "/hello.rs"));
    }
    pub mod auth {
        include!(concat!(env!("OUT_DIR"), "/auth.rs"));
    }
}

#[tokio::main]
async fn main() {
    let config: AppConfiguration = read_app_configuration::read_app_configuration(".")
        .expect("Failed to read app configuration");
    println!("config: {:?}", config);

    let conn = Database::connect(&config.database_url)
        .await
        .expect("Database connection failed");

    let state = AppState { conn };

    // Build our application with a route. Note the `rpc` method which was added by `axum-connect`.
    let app = Router::new()
        // Hello World Service
        .rpc(HelloWorldService::say_hello(say_hello_unary))
        .rpc(HelloWorldService::say_hello_unary_get(say_hello_unary))
        .rpc(HelloWorldService::say_hello_stream(stream_three_reponses))
        // Auth Service
        .rpc(AuthService::register(register))
        .rpc(AuthService::login(login))
        .rpc(AuthService::refresh_token(refresh_token))
        .rpc(AuthService::logout(logout))
        .rpc(AuthService::me(me))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3030").await.unwrap();
    println!("listening on http://{:?}", listener.local_addr().unwrap());
    axum::serve(listener, app.layer(CorsLayer::very_permissive()))
        .with_graceful_shutdown(shutdown_signal())
        .await
        .unwrap();
}

/// Handle graceful shutdown signals (SIGTERM, SIGINT, etc.)
async fn shutdown_signal() {
    use tokio::signal;

    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install SIGTERM handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {
            println!("Received Ctrl+C, shutting down gracefully...");
        },
        _ = terminate => {
            println!("Received SIGTERM, shutting down gracefully...");
        },
    }
}

/// The bread-and-butter of Connect-Web, a Unary request handler.
async fn say_hello_unary(request: HelloRequest) -> Result<HelloResponse, Error> {
    Ok(HelloResponse {
        message: format!("Hello {}!", request.name.as_deref().unwrap_or("unnamed")),
    })
}

async fn stream_three_reponses(request: HelloRequest) -> impl Stream<Item = HelloResponse> {
    let name = request.name.as_deref().unwrap_or("unnamed").to_string();
    stream! { yield HelloResponse { message: "Hello".to_string() };
        tokio::time::sleep(std::time::Duration::from_secs(1)).await;
        yield HelloResponse { message: name.clone() };
        tokio::time::sleep(std::time::Duration::from_secs(1)).await;
        yield HelloResponse { message: format!("Hello {}", name) };
        tokio::time::sleep(std::time::Duration::from_secs(1)).await;
    }
}
