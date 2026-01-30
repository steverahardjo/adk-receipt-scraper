import asyncio
import logging
from expense_tracker_agent.config import ExpenseTrackerConfig
from .testing  import GCSBlobService

logging.basicConfig(level=logging.INFO)

blob_service = GCSBlobService()

async def test_manual_save():
    config = ExpenseTrackerConfig()
    await config.mongodb.clear_db()
    blob_service.complete_clearout()
if __name__ == "__main__":
    asyncio.run(test_manual_save())