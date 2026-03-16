use std::{
    env,
    time::{SystemTime, UNIX_EPOCH},
};

use axum::{
    Router,
    extract::{FromRequestParts, Json, State},
    http::{StatusCode, header::AUTHORIZATION, request::Parts},
    routing::post,
};
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation, decode, encode};
use serde::{Deserialize, Serialize};

use crate::{context::Context, database::user::User};

pub fn api_routes() -> Router<Context> {
    Router::new()
        .route("/create", post(create))
        .route("/login", post(login))
}

#[derive(Deserialize)]
struct CreateBody {
    email: String,
    password: String,
}

async fn create(state: State<Context>, Json(body): Json<CreateBody>) -> StatusCode {
    let res = User::new(body.email, body.password)
        .create(&state.pool)
        .await;

    if res.is_ok() {
        StatusCode::CREATED
    } else {
        StatusCode::BAD_REQUEST
    }
}

#[derive(Deserialize)]
struct LoginBody {
    email: String,
    password: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: i64,
    exp: usize,
}

impl<S> FromRequestParts<S> for Claims
where
    S: Send + Sync,
{
    type Rejection = StatusCode;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let auth_header = parts
            .headers
            .get(AUTHORIZATION)
            .and_then(|value| value.to_str().ok())
            .ok_or(StatusCode::UNAUTHORIZED)?;

        if !auth_header.starts_with("Bearer ") {
            return Err(StatusCode::UNAUTHORIZED);
        }

        let token = &auth_header[7..];

        let secret = env::var("JWT_SECRET").map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?; // FIX: Pass JWT_SECRET through Axum context

        let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(secret.as_bytes()),
            &Validation::default(),
        )
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

        Ok(token_data.claims)
    }
}

#[derive(Serialize)]
struct LoginResponse {
    token: String,
}

async fn login(
    state: State<Context>,
    Json(body): Json<LoginBody>,
) -> Result<Json<LoginResponse>, StatusCode> {
    let mut user = User::by_email(body.email);

    let res = user.fetch(&state.pool).await;
    if res.is_err() {
        return Err(StatusCode::UNAUTHORIZED);
    }

    if password_auth::verify_password(body.password, &user.password).is_ok() {
        let expiration = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs()
            + (24 * 60 * 60); // valid for 24h

        let claims = Claims {
            sub: user.id,
            exp: expiration as usize,
        };

        let secret = env::var("JWT_SECRET").map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?; // FIX: Pass JWT_SECRET through Axum context

        let token = encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(secret.as_bytes()),
        )
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        Ok(Json(LoginResponse { token }))
    } else {
        Err(StatusCode::UNAUTHORIZED)
    }
}
