import asyncio
from expense_tracker_agent.tool import MongoTool
from expense_tracker_agent.config import ExpenseTrackerConfig
from bson.objectid import ObjectId

# Initialize config and tool
config = ExpenseTrackerConfig()
# Make sure to pass the URI if it's not defaults to localhost in your config
mongodb = MongoTool(db_name=config.mongodb_name)

async def main():
    # 1. YOU MUST CALL INIT FIRST
    # This sets self.client from None to a real AsyncIOMotorClient
    await mongodb.init()
    
    # 2. Access the database from the client
    db = mongodb.client["user_expense"]
    collection = db["Expense"] # Beanie usually names the collection after the Class
    
    target_id = "696ef66de8795ba6137d94af"
    
    # 3. YOU MUST AWAIT THE DELETE
    # result = db.delete_one(...) returns a coroutine in Motor
    result = await collection.delete_one({"_id": ObjectId(target_id)})
    
    # 4. Access the attributes of the result object
    print(f"Deleted count: {result.deleted_count}")
    print(await mongodb.search_expenses(10))

if __name__ == "__main__":
    asyncio.run(main())