use std::fmt::Debug;

use sqlx::{PgPool, Row, prelude::FromRow};

use super::network::Network;

#[derive(Debug, FromRow)]
pub struct User {
    pub id: i64,
    pub email: String,
    pub password: String,
}

impl User {
    pub fn new(email: String, password: String) -> Self {
        Self {
            id: 0,
            email,
            password,
        }
    }

    pub fn by_id(id: i64) -> Self {
        Self {
            id,
            email: "".into(),
            password: "".into(),
        }
    }

    pub fn by_email(email: String) -> Self {
        Self {
            id: 0,
            email,
            password: "".into(),
        }
    }

    pub async fn fetch(&mut self, pool: &PgPool) -> Result<(), sqlx::Error> {
        let user: User = sqlx::query_as("SELECT * FROM users WHERE email = $1")
            .bind(&self.email)
            .fetch_one(pool)
            .await?;

        self.id = user.id;
        self.password = user.password;

        Ok(())
    }

    pub async fn create(&mut self, pool: &PgPool) -> Result<(), sqlx::Error> {
        let row = sqlx::query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id")
            .bind(&self.email)
            .bind(password_auth::generate_hash(&self.password))
            .fetch_one(pool)
            .await?;

        self.id = row.get::<i32, _>(0) as i64;

        Ok(())
    }

    pub async fn get_networks(&self, pool: &PgPool) -> Result<Vec<Network>, sqlx::Error> {
        sqlx::query_as::<_, Network>("SELECT * FROM networks WHERE owner_id = $1")
            .bind(self.id as i32)
            .fetch_all(pool)
            .await
    }
}
