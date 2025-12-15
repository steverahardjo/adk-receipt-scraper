from agents.types import ExpenseType, ExpenseSchema

import asyncio
import pandas as pd

from pymongo import AsyncMongoClient
from pydantic import BaseModel

from beanie import init_beanie

MONGO_ADDR = ""
class MongoTool:
    def __init__(self, db_name:str, addr:str, uri:str):
        self.uri = uri
        self.db_name = db_name
        self.client = None
        self.inited = False

    async def init(self):
        if not self.initialized:
            self.client = AsyncMongoClient(self.mongo_uri)
            await init_beanie(
                database=self.client[self.db_name],
                document_models=[ExpenseSchema]
            )
            self.initialized = True
        
    async def insert_expense(self, data:dict):
        client = AsyncMongoClient(MONGO_ADDR)
        await init_beanie(database=client.db_name, document_models = [ExpenseSchema])

        if isinstance(data, dict):
            expense = ExpenseSchema.model_validate_json(data)
            await expense.insert()
            return expense

        elif isinstance(data, list):
            inserted = []
            for item in data:
                expense = ExpenseSchema.parse_obj(item)
                await expense.insert()
                inserted.append(expense)
            return inserted

        else:
            raise ValueError("Data must be a dict or a list of dicts")

    async def search_expenses(self, save_csv_path: str = "current_run.csv", **filters)->str:
        """
        Search for expenses using keyword filters.
        Example: search_expenses(type="food", payment_method="cash", save_csv_path="output.csv")
        """
        await self.init()
        query = ExpenseSchema.find({})
        
        # Apply filters
        for field, value in filters.items():
            query = query.find({field: value})
        
        # Execute query
        results = await query.to_list()
        
        return results
