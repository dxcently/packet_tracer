use axum::Router;
use dotenvy::dotenv;
use tower_http::services::ServeDir;

pub mod api;
pub mod context;
pub mod database;

#[tokio::main]
async fn main() {
    dotenv().ok();
    let app = Router::new()
        .nest("/api", api::api_routes().await)
        .nest_service("/css", ServeDir::new("public/css"))
        .nest_service("/home", ServeDir::new("public/home"))
        .nest_service("/login", ServeDir::new("public/login"))
        .nest_service("/register", ServeDir::new("public/register"))
        .fallback_service(ServeDir::new("public/landing"))
        .with_state(context::Context::new().await);
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
