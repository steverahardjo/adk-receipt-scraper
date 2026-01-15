import asyncio
from agents.tool import MongoTool

mongo = MongoTool("user_expense")

import pandas as pd

async def main():
    expenses = await mongo.search_expenses()

    # Convert to DataFrame
    df = pd.DataFrame(expenses)

    # Ensure datetime is datetime
    df["datetime"] = pd.to_datetime(df["datetime"])

    # Example 1: total amount by category
    by_category = (
        df.groupby("category", as_index=False)["amount"]
          .sum()
    )

    print(by_category)
    print("Number of data points: ", df.__len__())

    # Example 2: monthly total expenses
    df["month"] = df["datetime"].dt.to_period("M")

    by_month = (
        df.groupby("month", as_index=False)["amount"]
          .sum()
    )

    print(by_month)


if __name__ == "__main__":
    asyncio.run(main())
