"""MongoDB database tools for expense tracking."""

import csv
import logging
from datetime import date
from typing import Any, Optional
from google.adk.tools import ToolContext


from beanie import init_beanie
from expense_tracker_agent.agent_typing import (
    Currency,
    Expense,
    ExpenseSchema,
    ExpenseType,
    PaymentMethod,
)
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_ADDR = "mongodb://localhost:27017"


class MongoTool:
    """
    Closed-box MongoDB service for expense tracking.

    Manages its own connection lifecycle internally - callers just use the methods.
    Connection is established lazily on first operation and reused thereafter.
    """

    _instance: Optional["MongoTool"] = None
    _initialized: bool = False

    def __new__(cls, db_name: str = "expenses", uri: str = MONGO_ADDR):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.db_name = db_name
            cls._instance.uri = uri
            cls._instance.client = AsyncIOMotorClient(
                uri,
                maxPoolSize=50,
                minPoolSize=10,
                maxIdleTimeMS=30000,
            )
        return cls._instance

    async def _ensure_connected(self) -> bool:
        """Internal: Ensure database connection is established. Returns False if unavailable."""
        if not self._initialized:
            try:
                self.client = AsyncIOMotorClient(self.uri)
                await init_beanie(
                    database=self.client[self.db_name],
                    document_models=[Expense],
                )
                self._initialized = True
                logging.info("MongoDB connection established")
                return True
            except Exception as e:
                logging.warning(f"MongoDB not available: {e}. MongoDB features disabled.")
                return False
        return True

    async def save_expense(
        self,
        item: str,
        amount: float,
        currency: Currency,
        category: ExpenseType,
        payment_method: PaymentMethod,
        tool_context: ToolContext,
        datetime: str = "today",
        description: str | None = None,
        blob_filename: str | None = None,
    ) -> str:
        """Save an expense to the database. Connection handled automatically."""
        await self._ensure_connected()

        expense = ExpenseSchema(
            item=item,
            amount=amount,
            currency=currency,
            category=category,
            payment_method=payment_method,
            datetime=datetime,
            description=description,
            blob_filename=blob_filename,
        )
        doc = await expense.to_document(tool_context=tool_context)
        res = await doc.insert()
        return str(res)

    async def search_expenses(self, limit: int = 50, **filters: Any) -> list[dict]:
        """Search expenses with filters. Connection handled automatically."""
        await self._ensure_connected()

        query = Expense.find(filters)
        results = await query.sort(-Expense.datetime).limit(limit).to_list()
        return [r.model_dump(mode="json") for r in results]

    async def clear_db(self):
        """Clear all expenses from the database. Connection handled automatically."""
        await self._ensure_connected()
        await Expense.delete_all()
        logging.info("Cleared all expenses from the database")

    async def test_result(self):
        """Get all expenses for testing."""
        await self._ensure_connected()
        return await Expense.find().to_list()

    async def get_monthly_expenses(self, month: int, year: int) -> list[dict]:
        """Get all expenses for a specific month."""
        await self._ensure_connected()

        month_start = date(year, month, 1)
        month_end = date(year, month + 1, 1) if month < 12 else date(year + 1, 1, 1)

        expenses = await Expense.find(
            Expense.datetime >= month_start, Expense.datetime < month_end
        ).to_list()

        return [e.model_dump(mode="json") for e in expenses]

    async def export_monthly_csv(self, month: int, year: int, output_path: str) -> str:
        """Export monthly expenses to CSV."""
        await self._ensure_connected()

        expenses = await self.get_monthly_expenses(month, year)

        if not expenses:
            return ""

        with open(output_path, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=expenses[0].keys())
            writer.writeheader()
            writer.writerows(expenses)

        return output_path
