"""End-to-end testing utilities."""

import logging

from backend.tools.tests.db_testing import clear_test_db, seed_test_expenses
from backend.tools.tests.gcs_testing import clear_test_blobs, test_gcs_connection, upload_test_blob
from tools.mongo_tool import MongoTool


async def run_full_system_test() -> dict:
    """
    Run a full system test covering database and GCS.

    Returns:
        Dictionary with test results
    """
    results = {
        "db_connection": False,
        "db_seed": False,
        "db_retrieve": False,
        "db_clear": False,
        "gcs_connection": False,
        "gcs_upload": False,
        "gcs_clear": False,
    }

    # Test Database
    logging.info("=== Database Tests ===")
    try:
        db = MongoTool()
        await db._ensure_connected()
        results["db_connection"] = True
        logging.info("✓ Database connection established")
    except Exception as e:
        logging.error(f"✗ Database connection failed: {e}")
        return results

    try:
        ids = await seed_test_expenses(3)
        results["db_seed"] = len(ids) > 0
        logging.info(f"✓ Seeded {len(ids)} test expenses")
    except Exception as e:
        logging.error(f"✗ Database seed failed: {e}")

    try:
        expenses = await db.test_result()
        results["db_retrieve"] = len(expenses) > 0
        logging.info(f"✓ Retrieved {len(expenses)} expenses")
    except Exception as e:
        logging.error(f"✗ Database retrieve failed: {e}")

    try:
        await clear_test_db()
        results["db_clear"] = True
        logging.info("✓ Database cleared")
    except Exception as e:
        logging.error(f"✗ Database clear failed: {e}")

    # Test GCS
    logging.info("\n=== GCS Tests ===")
    results["gcs_connection"] = await test_gcs_connection()
    if results["gcs_connection"]:
        logging.info("✓ GCS connection established")
    else:
        logging.error("✗ GCS connection failed")
        return results

    try:
        await upload_test_blob("test_blob.txt", b"test content")
        results["gcs_upload"] = True
        logging.info("✓ GCS upload successful")
    except Exception as e:
        logging.error(f"✗ GCS upload failed: {e}")

    try:
        deleted = await clear_test_blobs(prefix="test_")
        results["gcs_clear"] = True
        logging.info(f"✓ GCS cleared ({deleted} blobs)")
    except Exception as e:
        logging.error(f"✗ GCS clear failed: {e}")

    return results


async def reset_test_environment() -> str:
    """
    Reset the entire test environment.

    Returns:
        Status message
    """
    logging.info("Resetting test environment...")

    try:
        await clear_test_db()
        logging.info("Database cleared")
    except Exception as e:
        logging.error(f"Database clear failed: {e}")

    try:
        await clear_test_blobs(prefix="test_")
        logging.info("Test blobs cleared")
    except Exception as e:
        logging.error(f"GCS clear failed: {e}")

    return "Test environment reset complete"
