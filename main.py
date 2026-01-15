import asyncio
from expense_tracker_agent.tool import MongoTool
from datetime import datetime, date
mongo = MongoTool("user_expense")

import pandas as pd

async def main():
    today = date.today()

    # query MongoDB
    start = datetime(2026, 1, 15, 0, 0, 0)
    end = datetime(2026, 1, 16, 0, 0, 0)

    results = await mongo.search_expenses(
        limit=10
    )
    # Convert to DataFrame
    df = pd.DataFrame(results)
    print(df)


if __name__ == "__main__":
    asyncio.run(main())
