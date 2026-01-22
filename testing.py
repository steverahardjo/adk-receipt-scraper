import asyncio
from expense_tracker_agent.tool import MongoTool
from expense_tracker_agent.config import ExpenseTrackerConfig
from bson.objectid import ObjectId

# Initialize config and tool
config = ExpenseTrackerConfig()
# Make sure to pass the URI if it's not defaults to localhost in your config
mongodb = config.mongodb

from datetime import datetime, time

def get_today_range():
    # Get the start and end of the current day
    today_start = datetime.combine(datetime.now(), time.min)
    today_end = datetime.combine(datetime.now(), time.max)
    return today_start, today_end

# Example range: 2026-01-20 00:00:00 to 2026-01-20 23:59:59

async def main():
    # 1. YOU MUST CALL INIT FIRST
    # This sets self.client from None to a real AsyncIOMotorClient
    await mongodb.init()
    
    # 2. Access the database from the client
    db = mongodb.client["user_expense"]
    collection = db["Expense"] # Beanie usually names the collection after the Class
    
    target_id = "696f10ef8fa966eda5b1d53c"
    
    # 3. YOU MUST AWAIT THE DELETE
    # result = db.delete_one(...) returns a coroutine in Motor
    result = await collection.delete_one({"_id": ObjectId(target_id)})
    print(f"Deleted count: {result.deleted_count}")
    print(await mongodb.search_expenses(30))

if __name__ == "__main__":
    asyncio.run(main())