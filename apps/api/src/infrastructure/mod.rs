use axum::{
    body::Body,
    http::{header, HeaderName, HeaderValue, Method, Request, Response},
    middleware::Next,
};
use std::time::Instant;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use uuid::Uuid;

use crate::config::AppConfig;

pub const REQUEST_ID_HEADER: &str = "x-request-id";

/// Initialize structured logging with tracing
pub fn init_tracing() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "mira_api=debug,tower_http=info".into()),
        )
        .with(tracing_subscriber::fmt::layer().json())
        .init();
}

/// Request ID and structured request timing middleware
pub async fn request_id_and_logging_middleware(
    mut req: Request<Body>,
    next: Next,
) -> Response<Body> {
    let request_id_str = match req.headers().get(REQUEST_ID_HEADER) {
        Some(v) => v.to_str().unwrap_or_default().to_string(),
        None => Uuid::new_v4().to_string(),
    };

    let request_id = if request_id_str.is_empty() {
        Uuid::new_v4().to_string()
    } else {
        request_id_str
    };

    // Store in header so extractors and downstream services can read it
    if let Ok(header_val) = HeaderValue::from_str(&request_id) {
        req.headers_mut().insert(
            HeaderName::from_static(REQUEST_ID_HEADER),
            header_val.clone(),
        );
    }

    let method = req.method().clone();
    let uri = req.uri().clone();
    let start_time = Instant::now();

    tracing::info!(
        request_id = %request_id,
        method = %method,
        uri = %uri,
        "Incoming HTTP request"
    );

    let mut response = next.run(req).await;
    let latency = start_time.elapsed();

    // Attach request_id to outgoing response headers
    if let Ok(header_val) = HeaderValue::from_str(&request_id) {
        response
            .headers_mut()
            .insert(HeaderName::from_static(REQUEST_ID_HEADER), header_val);
    }

    // Baseline security headers
    response.headers_mut().insert(
        header::X_CONTENT_TYPE_OPTIONS,
        HeaderValue::from_static("nosniff"),
    );
    response
        .headers_mut()
        .insert(header::X_FRAME_OPTIONS, HeaderValue::from_static("DENY"));
    response.headers_mut().insert(
        HeaderName::from_static("x-xss-protection"),
        HeaderValue::from_static("1; mode=block"),
    );

    tracing::info!(
        request_id = %request_id,
        method = %method,
        uri = %uri,
        status = %response.status().as_u16(),
        latency_ms = %latency.as_millis(),
        "Completed HTTP request"
    );

    response
}

/// Create CORS configuration layer
pub fn create_cors_layer(config: &AppConfig) -> CorsLayer {
    let mut layer = CorsLayer::new()
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::PATCH,
            Method::DELETE,
            Method::OPTIONS,
        ])
        .allow_headers([
            header::AUTHORIZATION,
            header::ACCEPT,
            header::CONTENT_TYPE,
            HeaderName::from_static(REQUEST_ID_HEADER),
        ])
        .expose_headers([HeaderName::from_static(REQUEST_ID_HEADER)]);

    if config.cors_origins.is_empty() || config.cors_origins.contains(&"*".to_string()) {
        layer = layer.allow_origin(Any);
    } else {
        let origins: Vec<HeaderValue> = config
            .cors_origins
            .iter()
            .filter_map(|s| s.parse().ok())
            .collect();
        layer = layer.allow_origin(origins);
    }

    layer
}
