use crate::errors::AppError;
use sha2::{Digest, Sha256};
use std::path::{Path, PathBuf};
use tokio::fs;

pub fn compute_sha256(bytes: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(bytes);
    format!("{:x}", hasher.finalize())
}

pub trait ObjectStorage: Send + Sync {
    async fn put(&self, key: &str, data: &[u8]) -> Result<(), AppError>;
    async fn get(&self, key: &str) -> Result<Vec<u8>, AppError>;
    async fn delete(&self, key: &str) -> Result<(), AppError>;
    async fn exists(&self, key: &str) -> Result<bool, AppError>;
    async fn presigned_access(&self, key: &str, expires_seconds: u64) -> Result<String, AppError>;
}

#[derive(Clone)]
pub struct LocalStorageAdapter {
    storage_root: PathBuf,
    quarantine_root: PathBuf,
}

impl LocalStorageAdapter {
    pub async fn new(base_path: impl AsRef<Path>) -> Result<Self, AppError> {
        let storage_root = base_path.as_ref().join("safe_store");
        let quarantine_root = base_path.as_ref().join("quarantine");

        fs::create_dir_all(&storage_root).await.map_err(|e| {
            AppError::Internal(format!("Failed to create storage directory: {}", e))
        })?;
        fs::create_dir_all(&quarantine_root).await.map_err(|e| {
            AppError::Internal(format!("Failed to create quarantine directory: {}", e))
        })?;

        Ok(Self {
            storage_root,
            quarantine_root,
        })
    }

    pub fn get_file_path(&self, key: &str) -> PathBuf {
        self.storage_root.join(key)
    }

    pub async fn quarantine_file(&self, key: &str, data: &[u8]) -> Result<(), AppError> {
        let target = self.quarantine_root.join(key);
        fs::write(target, data)
            .await
            .map_err(|e| AppError::Internal(format!("Failed to quarantine file {}: {}", key, e)))
    }
}

impl ObjectStorage for LocalStorageAdapter {
    async fn put(&self, key: &str, data: &[u8]) -> Result<(), AppError> {
        let target = self.storage_root.join(key);
        fs::write(target, data)
            .await
            .map_err(|e| AppError::Internal(format!("Failed to write object {}: {}", key, e)))
    }

    async fn get(&self, key: &str) -> Result<Vec<u8>, AppError> {
        let target = self.storage_root.join(key);
        if !target.exists() {
            return Err(AppError::NotFound(format!(
                "Storage object '{}' not found",
                key
            )));
        }
        fs::read(target)
            .await
            .map_err(|e| AppError::Internal(format!("Failed to read object {}: {}", key, e)))
    }

    async fn delete(&self, key: &str) -> Result<(), AppError> {
        let target = self.storage_root.join(key);
        if target.exists() {
            fs::remove_file(target).await.map_err(|e| {
                AppError::Internal(format!("Failed to delete object {}: {}", key, e))
            })?;
        }
        Ok(())
    }

    async fn exists(&self, key: &str) -> Result<bool, AppError> {
        let target = self.storage_root.join(key);
        Ok(target.exists())
    }

    async fn presigned_access(&self, key: &str, _expires_seconds: u64) -> Result<String, AppError> {
        // Return internal authorized route token / access path
        Ok(format!("/api/v1/documents/storage-stream/{}", key))
    }
}
