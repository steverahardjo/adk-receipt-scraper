import os
from google.cloud import storage
from dotenv import load_dotenv

load_dotenv()

class GCSBlobService:
    def __init__(self):
        self.bucket_name = os.getenv("GCS_BUCKET_NAME")
        self.storage_client = storage.Client()
        self.bucket = self.storage_client.bucket(self.bucket_name)

    def upload_blob_file(self, filename: str, data: bytes):
        """Uploads the expense artifact to Google Cloud Storage."""
        blob = self.bucket.blob(filename)
        blob.upload_from_string(data)
        print(f"Upload is working for this {filename}")
        return filename
        
    def download_blob_file(self, filename: str) -> bytes:
        """Downloads the bytes of a file from Google Cloud Storage."""
        blob = self.bucket.blob(filename)
        return blob.download_as_bytes()