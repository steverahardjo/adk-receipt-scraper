from fileinput import filename
from agents.agent_typing import ExpenseSchema, Expense, PaymentMethod, Currency, ExpenseType
from typing import Dict, Optional, List
from datetime import datetime, date
import logging
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from agents.agent_typing import ExpenseSchema
import logging
import json
import io
from google.adk.tools import ToolContext
import google.genai.types as types


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
    
    async def search_expenses(self, limit: int = 50, **filters):
        await self.init()
        
        query = Expense.find(filters)
        results = await query.sort("-datetime").limit(limit).to_list()
        
        json_results = [r.model_dump(mode="json") for r in results]

        buffer = io.StringIO()
        json.dump(json_results, buffer, indent=2)
        buffer.seek(0)

        return buffer.getvalue()
    
    async def clear_db(self):
        await self.init()
        await Expense.delete_all()
        logging.info("Cleared all expenses from the database")
    
    async def test_result(self):
        await self.init()
        return await Expense.find().to_list()
    

async def save_generated_visual(context: ToolContext, image_data: bytes, filename:str="gen_visual.jpeg"):
    """
    Saves the generated visualization image to a file.
    args:
        context: ToolContext - The tool context to save the artifact.
        image_data: bytes - The image data in bytes.
        filename: str - The filename to save the image as, decided based on user request.
    """
    visual_artifact = types.Part.from_bytes(
        data = image_data,
        mime_type="image/jpeg",
    )
    try:
        await context.save_artifact(
            artifact = visual_artifact,
            filename = f"temp/{filename}",
        )
        logging.info(f"Visualization image saved in temp as artifact '{filename}'")

    except Exception as e:
        logging.error(f"Failed to save visualization image: {e}")
    