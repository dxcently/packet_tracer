use packet_tracer::database::network::Network;
use packet_tracer::database::user::User;
use sqlx::PgPool;
use testcontainers::runners::AsyncRunner;
use testcontainers_modules::postgres::Postgres;

async fn setup_database() -> (PgPool, testcontainers::ContainerAsync<Postgres>) {
    let container = Postgres::default()
        .start()
        .await
        .expect("Failed to start container");
    let host_ip = container.get_host().await.unwrap();
    let host_port = container.get_host_port_ipv4(5432).await.unwrap();

    let url = format!(
        "postgres://postgres:postgres@{}:{}/postgres",
        host_ip, host_port
    );

    let pool = packet_tracer::database::init_db(&url).await;

    (pool, container)
}

#[tokio::test]
async fn user_creation_assigns_valid_id() {
    let (pool, _container) = setup_database().await;

    let mut user = User::new("user1@example.com".to_string(), "password123".to_string());
    user.create(&pool).await.expect("Failed to create user");

    assert!(user.id > 0);
}

#[tokio::test]
async fn network_creation_links_to_user() {
    let (pool, _container) = setup_database().await;

    let mut user = User::new("user2@example.com".to_string(), "password123".to_string());
    user.create(&pool).await.expect("Failed to create user");

    let mut network = Network::new(
        user.id as i32,
        Some("Test Network".to_string()),
        serde_json::json!({"status": "active"}),
    );

    network
        .create(&pool)
        .await
        .expect("Failed to create network");
    assert!(network.id > 0);
}
