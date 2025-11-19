use async_stream::stream;
use axum::Router;
use axum_connect::{futures::Stream, prelude::*};
use error::Error;
use proto::hello::*;
use sea_orm::{Database, DatabaseConnection};
use serde::Deserialize;
use tower_http::cors::CorsLayer;

// Take a peak at error.rs to see how errors work in axum-connect.
mod error;

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
    //
    // Note: I'm not super happy with this pattern. I hope to add support to `protoc-gen-prost` in
    // the near-ish future instead see:
    // https://github.com/neoeinstein/protoc-gen-prost/issues/82#issuecomment-1877107220 That will
    // better align with Buf.build's philosophy. This is how it works for now though.
    pub mod hello {
        include!(concat!(env!("OUT_DIR"), "/hello.rs"));
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
    // It expect a service method handler, wrapped in it's respective type. The handler (below) is
    // just a normal Rust function. Just like Axum, it also supports extractors!
    let app = Router::new()
        // A standard unary (POST based) Connect-Web request handler.
        .rpc(HelloWorldService::say_hello(say_hello_unary))
        // A GET version of the same thing, which has well-defined semantics for caching.
        .rpc(HelloWorldService::say_hello_unary_get(say_hello_unary))
        // A server-streaming request handler. Very useful when you need them!
        .rpc(HelloWorldService::say_hello_stream(stream_three_reponses))
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
///
/// Just to demo error handling, I've chose to return a `Result` here. If your method is
/// infallible, you could just as easily return a `HellResponse` directly. The error type I'm using
/// is defined in `error.rs` and is worth taking a quick peak at.
///
/// Like Axum, both the request AND response types just need to implement RpcFromRequestParts` and
/// `RpcIntoResponse` respectively. This allows for a ton of flexibility in what your handlers
/// actually accept/return. This is a concept very core to Axum, so I won't go too deep into the
/// ideology here.
async fn say_hello_unary(request: HelloRequest) -> Result<HelloResponse, Error> {
    Ok(HelloResponse {
        message: format!("Hello {}!", request.name.as_deref().unwrap_or("unnamed")),
    })
}

/// This is a server-streaming request handler. Much more rare to see one in the wild, but they
/// sure are useful when you need them! axum-connect has only partial support for everything
/// connect-web defines in server-streaming requests. For example, it doesn't define a way to
/// return trailers. I've never once actually needed them, so it feels weird to muddy the API just
/// to support such a niche use. Trailers are IMO the worst single decision gRPC made, locking them
/// into HTTP/2 forever. I'm not a fan -.-
///
/// You can however return a stream of anything that converts `RpcIntoResponse`, just like the
/// unary handlers. Again, very flexible. In this case I'm using the amazing `async-stream` crate
/// to make the code nice and readable.
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
