use std::env;

#[derive(Clone, Debug)]
pub struct AppConfig {
    pub database_url: String,
    pub jwt_secret: String,
    pub jwt_expiration_hours: i64,
    pub port: u16,
    pub app_env: String,
    pub demo_mode: bool,
    pub cors_origins: Vec<String>,
}

impl AppConfig {
    pub fn from_env() -> Self {
        dotenvy::dotenv().ok();

        let database_url = env::var("DATABASE_URL")
            .unwrap_or_else(|_| "postgres://postgres@127.0.0.1:5433/mira_dev".to_string());

        let jwt_secret = env::var("JWT_SECRET")
            .unwrap_or_else(|_| "mira-v1-foundation-secure-jwt-secret-key-minimum-32-chars".to_string());

        let jwt_expiration_hours = env::var("JWT_EXPIRATION_HOURS")
            .ok()
            .and_then(|v| v.parse().ok())
            .unwrap_or(24);

        let port = env::var("PORT")
            .ok()
            .and_then(|p| p.parse().ok())
            .unwrap_or(4000);

        let app_env = env::var("APP_ENV").unwrap_or_else(|_| "development".to_string());

        // Public demo authentication is available only outside production.
        // The environment switch can disable it for shared development deployments.
        let demo_mode = !app_env.eq_ignore_ascii_case("production")
            && env::var("MIRA_DEMO_MODE")
                .map(|value| value.eq_ignore_ascii_case("true"))
                .unwrap_or(true);

        let cors_origins = env::var("CORS_ORIGINS")
            .unwrap_or_else(|_| "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000".to_string())
            .split(',')
            .map(|s| s.trim().to_string())
            .filter(|s| !s.is_empty())
            .collect();

        Self {
            database_url,
            jwt_secret,
            jwt_expiration_hours,
            port,
            app_env,
            demo_mode,
            cors_origins,
        }
    }
}
