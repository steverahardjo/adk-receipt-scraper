import os
from google.cloud import storage
from dotenv import load_dotenv
from datetime import timedelta

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
        
    def generate_signed_url(self, filename: str) -> str:
        """Generate a temporary signed URL for a GCS object."""
        blob = self.bucket.blob(filename)

        url = blob.generate_signed_url(
            version="v4",
            expiration=timedelta(seconds=600),
            method="GET",
        )

        return url
    
    def complete_clearout(self):
        """Deletes EVERY file in the bucket."""
        blobs = self.bucket.list_blobs()
        count = 0
        
        for blob in blobs:
            blob.delete()
            count += 1
            
        print(f"🔥 Bucket wipe complete. {count} files removed.")
        return count