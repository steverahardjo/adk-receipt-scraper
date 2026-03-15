"""Database testing utilities."""

import logging
from typing import Any

from expense_tracker_agent.agent_typing import (
    Currency,
    ExpenseType,
    PaymentMethod,
)

from tools.mongo_tool import MongoTool


async def seed_test_expenses(count: int = 5) -> list[str]:
    """
    Seed the database with test expenses.

    Args:
        count: Number of test expenses to create

    Returns:
        List of inserted expense IDs
    """
    db = MongoTool()

    # Create a minimal mock for ToolContext
    class MockToolContext:
        def __init__(self):
            self.state = {}

        async def load_artifact(self, name):
            class MockData:
                inline_data = type("obj", (object,), {"data": b"mock_image_data"})()

            return MockData()

    tool_context = MockToolContext()

    test_data = [
        {
            "item": "Coffee",
            "amount": 20000,
            "currency": Currency.IDR,
            "category": ExpenseType.FOOD,
            "payment_method": PaymentMethod.EWALLET,
            "datetime": "2026-03-13",
            "description": "Morning coffee",
        },
        {
            "item": "Bus Ticket",
            "amount": 5000,
            "currency": Currency.IDR,
            "category": ExpenseType.TRANSPORT,
            "payment_method": PaymentMethod.CASH,
            "datetime": "2026-03-13",
            "description": "Daily commute",
        },
        {
            "item": "Lunch",
            "amount": 35000,
            "currency": Currency.IDR,
            "category": ExpenseType.FOOD,
            "payment_method": PaymentMethod.DEBIT_CARD,
            "datetime": "2026-03-12",
            "description": "Office lunch",
        },
        {
            "item": "Netflix Subscription",
            "amount": 186000,
            "currency": Currency.IDR,
            "category": ExpenseType.ENTERTAINMENT,
            "payment_method": PaymentMethod.BANK_TRANSFER,
            "datetime": "2026-03-01",
            "description": "Monthly subscription",
        },
        {
            "item": "Electricity Bill",
            "amount": 150000,
            "currency": Currency.IDR,
            "category": ExpenseType.UTILITIES,
            "payment_method": PaymentMethod.BANK_TRANSFER,
            "datetime": "2026-03-05",
            "description": "Monthly electricity",
        },
    ]

    inserted_ids = []
    for data in test_data[:count]:
        try:
            expense_id = await db.save_expense(
                **data,
                tool_context=tool_context,
            )
            inserted_ids.append(expense_id)
            logging.info(f"Inserted test expense: {data['item']}")
        except Exception as e:
            logging.error(f"Failed to insert test expense: {e}")

    return inserted_ids


async def clear_test_db() -> str:
    """
    Clear all test data from the database.

    Returns:
        Status message
    """
    db = MongoTool()
    await db.clear_db()
    return "Test database cleared"


async def get_all_test_expenses() -> list[dict]:
    """
    Retrieve all expenses for testing/verification.

    Returns:
        List of expense records
    """
    db = MongoTool()
    return await db.test_result()


async def search_test_expenses(**filters: Any) -> list[dict]:
    """
    Search expenses with filters.

    Args:
        **filters: Filter criteria (category, payment_method, etc.)

    Returns:
        Matching expense records
    """
    db = MongoTool()
    return await db.search_expenses(**filters)
