import os
from azure.storage.blob import BlobServiceClient
from dotenv import load_dotenv

load_dotenv()

class BlobService:
    def __init__(self):
        account_name = os.getenv("AZURE_STORAGE_ACCOUNT_NAME", "devstoreaccount1")
        account_key = os.getenv("AZURE_STORAGE_ACCOUNT_KEY")
        
        self.connection_string = (
            f"DefaultEndpointsProtocol=http;"
            f"AccountName={account_name};"
            f"AccountKey={account_key};"
            f"BlobEndpoint=http://127.0.0.1:11002/{account_name};"
        )
        
        self.service_client = BlobServiceClient.from_connection_string(self.connection_string)
        self.container_name = "receipts"

    def upload_blob_file(self, filename: str, data: bytes):
        """Uploads the expense artifact to the local Docker blob storage."""
        blob_client = self.service_client.get_blob_client(
            container=self.container_name, 
            blob=filename
        )
        blob_client.upload_blob(data, overwrite=True)
        return f"Successfully uploaded {filename}"
    
    def download_blob_file(self, filename: str) -> bytes:
        """Downloads the bytes of a file from the local blob storage."""
        blob_client = self.service_client.get_blob_client(
                container=self.container_name, 
                blob=filename
        )
        download_stream = blob_client.download_blob()
        return download_stream.readall()