use serde_json::Value;
use sqlx::{PgPool, Row, prelude::FromRow};
use std::fmt::Debug;

#[derive(Debug, FromRow)]
pub struct Network {
    pub id: i32,
    pub owner_id: i32,
    pub title: Option<String>,
    pub metadata: Value,
}

impl Network {
    pub fn new(owner_id: i32, title: Option<String>, metadata: Value) -> Self {
        Self {
            id: 0,
            owner_id,
            title,
            metadata,
        }
    }

    pub async fn create(&mut self, pool: &PgPool) -> Result<(), sqlx::Error> {
        let row = sqlx::query(
            "INSERT INTO networks (owner_id, title, metadata) 
             VALUES ($1, $2, $3) 
             RETURNING id",
        )
        .bind(self.owner_id)
        .bind(&self.title)
        .bind(&self.metadata)
        .fetch_one(pool)
        .await?;

        self.id = row.get(0);

        Ok(())
    }
}
