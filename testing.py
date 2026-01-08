import asyncio
from agents.tool import MongoTool

async def test_insert():
    mongo = MongoTool(db_name="user_expense")
    
    result = await mongo.insert_expense(
        amount=100.0,
        currency="USD",
        date_input="2023-10-15",
        category="food",
        payment_method="debit_card",
        description="Lunch at cafe"
    )
    print("Insert Result:", result)
    print("Test Results:", await mongo.test_result())
    await mongo.clear_db()


asyncio.run(test_insert())