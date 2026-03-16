use sqlx::PgPool;
use std::env;

use crate::database;

#[derive(Clone)]
pub struct Context {
    pub pool: PgPool,
}

impl Context {
    pub async fn new() -> Self {
        Self {
            pool: database::init_db(
                &env::var("DATABASE_URL").expect("Failed to read DATABASE_URL from ENV"),
            )
            .await,
        }
    }
}
