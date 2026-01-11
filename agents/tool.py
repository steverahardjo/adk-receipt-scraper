from agents.agent_typing import ExpenseSchema, Expense, PaymentMethod, Currency, ExpenseType
from typing import Optional, List
from datetime import datetime, date
import logging
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from agents.agent_typing import ExpenseSchema
import logging

MONGO_ADDR = "mongodb://localhost:27017"
DB_NAME = "user_expense"

class MongoTool:
    def __init__(self, db_name: str = DB_NAME, uri: str = MONGO_ADDR):
        self.db_name = db_name
        self.uri = uri
        self.client: Optional[AsyncIOMotorClient] = None
        self.inited: bool = False

    async def init(self):
        if not self.inited:
            self.client = AsyncIOMotorClient(self.uri)
            await init_beanie(
                database=self.client[self.db_name],
                document_models=[Expense]
            )
            self.inited = True
            logging.info("MongoTool initialized")


    async def insert_expense(
        self,
        item:str, 
        amount: float,
        currency: Currency,
        date_input: str | datetime | date,
        category: ExpenseType,
        payment_method: PaymentMethod,
        description: str | None = None
    )->None:
        """
        Docstring for insert_expense
        Input:
        - item: str = name of the item purchased
        - amount: str = expense amount
        - currency: Currency = currency code
        - date_input: str | datetime | date = date of expense
        - category: ExpenseType = expense category
        - payment_method: PaymentMethod = payment method used
        - description: Optional[str] = short description
        Output: None
        """
        await self.init()

        # Normalize date_input → date (ONCE, at the boundary)
        if isinstance(date_input, date) and not isinstance(date_input, datetime):
            d = date_input
        elif isinstance(date_input, datetime):
            d = date_input.date()
        elif isinstance(date_input, str):
            if date == "today" and date == "now":
                d = datetime.now().date()
            else:
                d = datetime.fromisoformat(date_input.replace("Z", "+00:00")).date()
        else:
            raise TypeError("date_input must be str, datetime, or date")

        expense = Expense(
            amount=amount,
            currency=currency,
            item =item,
            date_recorded=datetime.now().date(),
            datetime=d,
            category=category,
            payment_method=payment_method,
            description=description
        )
        await expense.insert()
        logging.info(f"Inserted expense: {expense}")
        return None
    
    async def search_expenses(self, limit: int = 50, **filters) -> List[Expense]:
            """
            Accepts dynamic filters (item, category, currency, etc.)
            Example: await tool.search_expenses(category="Food", amount=50.0)
            """
            await self.init()
            
            # We use Expense.find(filters) because Beanie automatically 
            # maps dictionary keys to MongoDB field names.
            query = Expense.find(filters)
            
            # Apply sorting (newest first) and limit
            results = await query.sort("-datetime").limit(limit).to_list()
            
            return results
    
    async def clear_db(self):
        await self.init()
        await Expense.delete_all()
        logging.info("Cleared all expenses from the database")
    
    async def test_result(self):
        await self.init()
        return await Expense.find().to_list()
    

    
class ExpenseAggregator:
    """
    Tool to perform aggregation on expense data.
    """
    def __init__(self, expenses):
        self.expenses = expenses

    def aggregate_by(self, field: str, agg: str = "sum"):
        """
        Aggregate expenses by a given field (category, payment_method, currency, datetime, etc.)
        agg: sum | average | count
        """
        from collections import defaultdict

        result = defaultdict(list)
        for e in self.expenses:
            key = e.get(field)
            result[key].append(e["amount"])

        aggregated = {}
        for k, values in result.items():
            if agg == "sum":
                aggregated[k] = sum(values)
            elif agg == "average":
                aggregated[k] = sum(values)/len(values)
            elif agg == "count":
                aggregated[k] = len(values)
        return aggregated

