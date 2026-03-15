#!/usr/bin/env python3
"""Test runner for tools module."""

import asyncio
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))


async def test_mongo():
    """Test MongoDB operations."""
    print("\n=== MongoDB Tests ===")
    from tools.mongo_tool import MongoTool

    db = MongoTool()
    try:
        await db._ensure_connected()
        print("✓ MongoDB connection established")

        # Test clear
        await db.clear_db()
        print("✓ Database cleared")

        # Test retrieve
        expenses = await db.test_result()
        print(f"✓ Retrieved {len(expenses)} expenses")

        # Test monthly
        monthly = await db.get_monthly_expenses(3, 2026)
        print(f"✓ Retrieved {len(monthly)} expenses for March 2026")

        return True
    except Exception as e:
        print(f"✗ MongoDB test failed: {e}")
        return False


async def test_gcs():
    """Test GCS operations."""
    print("\n=== GCS Tests ===")
    from tools.gcs_tool import GCSBlobService

    try:
        service = GCSBlobService()
        # Test connection by listing blobs
        blobs = list(service.bucket.list_blobs(max_results=1))
        print(f"✓ GCS connection established (bucket has {len(blobs)}+ blobs)")

        # Test upload
        test_filename = "test/test_blob.txt"
        service.upload_blob_file(test_filename, b"test content")
        print(f"✓ Uploaded test blob: {test_filename}")

        # Test signed URL
        url = service.generate_signed_url(test_filename)
        print(f"✓ Generated signed URL (expires in 10 min)")

        # Cleanup
        blob = service.bucket.blob(test_filename)
        blob.delete()
        print(f"✓ Cleaned up test blob")

        return True
    except Exception as e:
        print(f"✗ GCS test failed: {e}")
        return False


async def test_db_seed():
    """Test database seeding."""
    print("\n=== DB Seed Tests ===")
    from backend.tools.tests.db_testing import (
        clear_test_db,
        get_all_test_expenses,
        seed_test_expenses,
    )

    try:
        # Clear first
        await clear_test_db()
        print("✓ Test DB cleared")

        # Seed
        ids = await seed_test_expenses(3)
        print(f"✓ Seeded {len(ids)} test expenses")

        # Retrieve
        expenses = await get_all_test_expenses()
        print(f"✓ Retrieved {len(expenses)} expenses")

        # Cleanup
        await clear_test_db()
        print("✓ Test DB cleared after test")

        return True
    except Exception as e:
        print(f"✗ DB seed test failed: {e}")
        return False


async def test_gcs_helpers():
    """Test GCS helper functions."""
    print("\n=== GCS Helper Tests ===")
    from backend.tools.tests.gcs_testing import (
        clear_test_blobs,
        list_test_blobs,
        test_gcs_connection,
        upload_test_blob,
    )

    try:
        # Test connection
        connected = await test_gcs_connection()
        print(f"✓ GCS connection test: {connected}")

        if not connected:
            print("⊘ Skipping GCS helper tests (no connection)")
            return True

        # Test upload
        result = await upload_test_blob("test_helper.txt", b"helper test")
        print(f"✓ Upload via helper: {result}")

        # Test list
        blobs = await list_test_blobs(prefix="test_")
        print(f"✓ Listed {len(blobs)} test blobs")

        # Cleanup
        deleted = await clear_test_blobs(prefix="test_")
        print(f"✓ Cleared {deleted} test blobs")

        return True
    except Exception as e:
        print(f"✗ GCS helper test failed: {e}")
        return False


async def main():
    """Run all tests."""
    print("=" * 50)
    print("TOOLS TEST SUITE")
    print("=" * 50)

    results = {
        "MongoDB": await test_mongo(),
        "GCS": await test_gcs(),
        "Artifact": await test_artifact(),
        "DB Seed": await test_db_seed(),
        "GCS Helpers": await test_gcs_helpers(),
    }

    print("\n" + "=" * 50)
    print("SUMMARY")
    print("=" * 50)

    passed = sum(results.values())
    total = len(results)

    for name, result in results.items():
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{name}: {status}")

    print(f"\nTotal: {passed}/{total} test suites passed")

    if passed == total:
        print("\n🎉 All tests passed!")
        return 0
    else:
        print("\n⚠️  Some tests failed")
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
