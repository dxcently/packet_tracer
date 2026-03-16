use axum::Router;
use tower_http::services::ServeDir;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .nest_service("/css", ServeDir::new("public/css"))
        .nest_service("/home", ServeDir::new("public/home"))
        .nest_service("/login", ServeDir::new("public/login"))
        .nest_service("/register", ServeDir::new("public/register"))
        .fallback_service(ServeDir::new("public/landing"));
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
