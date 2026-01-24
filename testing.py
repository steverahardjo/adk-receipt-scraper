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
    res = await config.mongodb.search_expenses(3)
    print(res)
if __name__ == "__main__":
    asyncio.run(test_manual_save())