use axum::Router;

use crate::context::Context;

mod user;

pub async fn api_routes() -> Router<Context> {
    Router::new().nest("/user", user::api_routes())
}
