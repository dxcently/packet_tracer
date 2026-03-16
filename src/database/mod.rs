use sqlx::{Executor, PgPool};
use std::env;

pub mod network;
pub mod user;

pub async fn init_db(database_url: &str) -> PgPool {
    let pool = PgPool::connect(database_url)
        .await
        .expect("can't connect to database");

    pool.execute(include_str!("init.sql")).await.unwrap();
    pool
}
