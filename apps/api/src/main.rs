use std::{net::SocketAddr, sync::Arc};
use axum::middleware;
use tokio::net::TcpListener;

mod api;
mod application;
mod auth;
mod config;
mod database;
mod domain;
mod errors;
mod infrastructure;

use crate::{
    api::{create_router, AppState},
    config::AppConfig,
    database::{create_pool, run_migrations, seed_database},
    infrastructure::{create_cors_layer, init_tracing, request_id_and_logging_middleware},
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    init_tracing();

    let config = AppConfig::from_env();
    tracing::info!(
        port = config.port,
        app_env = %config.app_env,
        "Initializing Mira V1 Platform Backend"
    );

    let pool = create_pool(&config.database_url).await?;

    // Check CLI commands: e.g. cargo run -- seed or migrate
    let args: Vec<String> = std::env::args().collect();
    if args.len() > 1 {
        match args[1].as_str() {
            "migrate" => {
                tracing::info!("Running database migrations...");
                run_migrations(&pool).await?;
                println!("Migrations executed successfully.");
                return Ok(());
            }
            "seed" => {
                tracing::info!("Running database seed...");
                run_migrations(&pool).await?;
                seed_database(&pool).await?;
                println!("Database seeded successfully.");
                return Ok(());
            }
            _ => {}
        }
    }

    // Auto-migrate on startup for smooth local development
    run_migrations(&pool).await?;
    // Auto-seed demo accounts if not already present
    seed_database(&pool).await?;

    let state = AppState {
        pool,
        config: Arc::new(config.clone()),
    };

    let cors = create_cors_layer(&config);
    let app = create_router(state)
        .layer(middleware::from_fn(request_id_and_logging_middleware))
        .layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], config.port));
    tracing::info!("Mira API listening on http://{}", addr);

    let listener = TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
