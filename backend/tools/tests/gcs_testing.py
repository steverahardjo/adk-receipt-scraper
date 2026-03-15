"""GCS Blob testing utilities."""

import logging

from tools.gcs_tool import GCSBlobService


async def test_gcs_connection() -> bool:
    """
    Test GCS connection and bucket access.

    Returns:
        True if connection successful, False otherwise
    """
    try:
        service = GCSBlobService()
        # Try to list blobs (even if empty, confirms access)
        list(service.bucket.list_blobs(max_results=1))
        logging.info("GCS connection successful")
        return True
    except Exception as e:
        logging.error(f"GCS connection failed: {e}")
        return False


async def upload_test_blob(filename: str, content: bytes = b"test data") -> str:
    """
    Upload a test blob to GCS.

    Args:
        filename: Name for the blob
        content: Bytes to upload

    Returns:
        Blob filename if successful
    """
    try:
        service = GCSBlobService()
        result = service.upload_blob_file(filename, content)
        logging.info(f"Test blob uploaded: {filename}")
        return result
    except Exception as e:
        logging.error(f"Failed to upload test blob: {e}")
        return f"Error: {e}"


async def delete_test_blob(filename: str) -> bool:
    """
    Delete a test blob from GCS.

    Args:
        filename: Name of the blob to delete

    Returns:
        True if successful, False otherwise
    """
    try:
        service = GCSBlobService()
        blob = service.bucket.blob(filename)
        blob.delete()
        logging.info(f"Test blob deleted: {filename}")
        return True
    except Exception as e:
        logging.error(f"Failed to delete test blob: {e}")
        return False


async def list_test_blobs(prefix: str = None, max_results: int = 10) -> list[str]:
    """
    List blobs in the bucket (optionally filtered by prefix).

    Args:
        prefix: Optional prefix filter
        max_results: Maximum number of blobs to return

    Returns:
        List of blob names
    """
    try:
        service = GCSBlobService()
        blobs = service.bucket.list_blobs(prefix=prefix, max_results=max_results)
        return [blob.name for blob in blobs]
    except Exception as e:
        logging.error(f"Failed to list blobs: {e}")
        return []


async def clear_test_blobs(prefix: str = "test_") -> int:
    """
    Delete all test blobs matching a prefix.

    Args:
        prefix: Prefix to match for deletion

    Returns:
        Number of blobs deleted
    """
    try:
        service = GCSBlobService()
        blobs = service.bucket.list_blobs(prefix=prefix)
        count = 0
        for blob in blobs:
            blob.delete()
            count += 1
        logging.info(f"Cleared {count} test blobs with prefix '{prefix}'")
        return count
    except Exception as e:
        logging.error(f"Failed to clear test blobs: {e}")
        return 0
