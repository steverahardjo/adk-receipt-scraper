import asyncio
from agents.tool import MongoTool

mongo = MongoTool("user_expense")

async def main():
    print( await mongo.search_expenses(limit =5))

if __name__ == "__main__":
    asyncio.run(main())
