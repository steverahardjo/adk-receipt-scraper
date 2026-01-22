import asyncio
import logging
from datetime import datetime
from expense_tracker_agent.sub_agents.saver_agent import ExpenseSchema
from expense_tracker_agent.agent_typing import ExpenseSchema, Currency, Expense, ExpenseType, PaymentMethod
from expense_tracker_agent.config import ExpenseTrackerConfig

# Setup logging to see what's happening
logging.basicConfig(level=logging.INFO)

async def test_manual_save():
    config = ExpenseTrackerConfig()
    
    # 1. Manually Initialize Mongo
    print("--- Initializing MongoDB ---")
    await config.mongodb.init()

    # 2. Create a Mock Schema (simulating AI output)
    # Note: Ensure your ExpenseSchema has 'date_input' field as fixed previously
    mock_data = ExpenseSchema(
        item="Manual Test Coffee",
        amount=15.50,
        currency=Currency.MYR,
        date_input="today",
        category=ExpenseType.FOOD,
        payment_method=PaymentMethod.CASH,
        description="Testing the save_expense function manually"
    )

    print(f"--- Converting Schema to Document ---")
    try:
        # Convert to Beanie Document
        expense_doc = await mock_data.to_document()
        
        # 3. Save manually using your MongoTool method
        print("--- Attempting Save ---")
        saved_id_str = await config.mongodb.save_expense(expense_doc)
        
        print(f"✅ SUCCESS! Saved Expense ID/Str: {saved_id_str}")
        
        # 4. Verify by searching
        print("--- Verifying Search ---")
        results = await config.mongodb.search_expenses(limit=1)
        print(f"Found in DB: {results}")

    except Exception as e:
        print(f"❌ FAILED: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_manual_save())