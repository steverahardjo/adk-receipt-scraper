import asyncio
from agents.tool import MongoTool

async def test_insert():
    mongo = MongoTool(db_name="user_expense")
    print("Test Results:", await mongo.test_result())
    await mongo.clear_db()


asyncio.run(test_insert())