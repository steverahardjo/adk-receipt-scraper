"""Google Cloud Storage blob management tools."""

import logging
import os
from datetime import timedelta
from typing import Optional

from dotenv import load_dotenv

load_dotenv()


class GCSBlobService:
    """
    Closed-box Google Cloud Storage service for blob management.

    Singleton pattern - single storage client reused across all operations.
    """

    _instance: Optional["GCSBlobService"] = None
    _initialized: bool = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.bucket_name = os.getenv("GCS_BUCKET_NAME")
            cls._instance.storage_client = None
            cls._instance.bucket = None
            cls._instance._initialized = False
        return cls._instance

    def _ensure_connected(self) -> bool:
        """Lazy initialization of GCS client. Returns False if credentials missing."""
        if not self._initialized:
            try:
                from google.cloud import storage
                self.storage_client = storage.Client()
                self.bucket = self.storage_client.bucket(self.bucket_name)
                self._initialized = True
                logging.info("GCS connection established")
                return True
            except Exception as e:
                logging.warning(f"GCS credentials not available: {e}. GCS features disabled.")
                return False
        return True

    def upload_blob_file(self, filename: str, data: bytes) -> str:
        """Uploads the expense artifact to Google Cloud Storage."""
        if not self._ensure_connected():
            logging.warning("GCS not available, skipping upload")
            return filename
        blob = self.bucket.blob(filename)
        blob.upload_from_string(data)
        logging.info(f"Uploaded blob: {filename}")
        return filename

    def generate_signed_url(self, filename: str) -> str:
        """Generate a temporary signed URL for a GCS object (10 min expiry)."""
        if not self._ensure_connected():
            return ""
        blob = self.bucket.blob(filename)
        url = blob.generate_signed_url(
            version="v4",
            expiration=timedelta(seconds=600),
            method="GET",
        )
        return url

    def complete_clearout(self) -> int:
        """Deletes ALL files in the bucket. Use with caution."""
        if not self._ensure_connected():
            return 0
        blobs = self.bucket.list_blobs()
        count = 0
        for blob in blobs:
            blob.delete()
            count += 1
        logging.info(f"🔥 Bucket wipe complete. {count} files removed.")
        return count
