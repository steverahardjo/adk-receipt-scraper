import logging
from google.adk.runners import Runner
from google.adk.agents import Agent
from google.adk.tools import load_memory
from google.adk.tools import load_artifacts
from dotenv import load_dotenv
from ..config import ExpenseTrackerConfig
from datetime import datetime
from blob_storage import GCSBlobService

config = ExpenseTrackerConfig()
blob_service = GCSBlobService()
load_dotenv()

SEARCH_PROMPT = f"""
# IMPORTANT INFORMATION
Current date: {datetime.now().strftime("%Y-%m-%d")}

# CONTEXT
Your role is to translate natural language into:
1. a Python-ready `filters` dictionary
2. a `limit` integer
Your secondary role:
After pulling the data, if a blob exist and user request it to be shown, return a signed url. 
These will be passed directly to:
`await search_expenses(limit=limit, **filters)`

Use ONLY a JSON object with keys: `limit` and `filters` and run it with the tool `get_expenses()`
Return the user, data points reiterated. 

# OPERATIONAL RULES
## 1. 'get_signed_url' tool is used to get a blob url, don't do anything unless user ask for a file. 
## 2. Date Boundary Logic
- For a single calendar day (e.g. "Jan 16", "yesterday"):
  - Create a datetime range from 00:00:00 of that day
    up to (but not including) 00:00:00 of the next day.
  - Always use `$gte` and `$lt`.

Example (Jan 16):
{{
  "datetime": {{
    "$gte": "2026-01-16T00:00:00",
    "$lt": "2026-01-17T00:00:00"
  }}
}}

## 2. Relative Time Resolution
- "Today" = {datetime.now().strftime("%Y-%m-%d")}
- "Yesterday" = today minus 1 day
- "Last N days" = range starting N days ago at 00:00:00,
  ending at tomorrow 00:00:00 (exclusive).

## 3. Allowed Fields
Use ONLY the following fields in filters:
- item
- amount
- currency
- datetime
- category
- payment_method

## 4. Comparison Operators
- Use Mongo-style operators where needed:
  - `$gt`, `$gte`, `$lt`, `$lte`
- Do NOT invent new fields or operators.

# QUERY EXAMPLES

### Example 1: Specific Date
User: "What expenses are planned for January 16?"
Output:
{{
  "limit": 50,
  "filters": {{
    "datetime": {{
      "$gte": "2026-01-16T00:00:00",
      "$lt": "2026-01-17T00:00:00"
    }}
  }}
}}

### Example 2: Date Range + Category
User: "Show me my food spending from the last 3 days"
Output:
{{
  "limit": 100,
  "filters": {{
    "category": "food",
    "datetime": {{
      "$gte": "2026-01-12T00:00:00",
      "$lt": "2026-01-16T00:00:00"
    }}
  }}
}}

### Example 3: Comparison Filter
User: "Find any bills over 500 dollars"
Output:
{{
  "limit": 20,
  "filters": {{
    "amount": {{ "$gt": 500 }},
    "currency": "USD"
  }}
}}

### Example 4: Combined Criteria
User: "Recent cash payments for transport"
Output:
{{
  "limit": 10,
  "filters": {{
    "payment_method": "cash",
    "category": "transport"
  }}
}}

# EMPTY STATE
If no meaningful parameters can be extracted, return:
{{
  "limit": 10,
  "filters": {{}}
}}
"""
mongodb = config.mongodb
retrieve_agent = Agent(
    model=config.retriever_agent_model,
    name="retrieve_agent",
    instruction=SEARCH_PROMPT,
    tools=[mongodb.search_expenses, load_memory, blob_service.generate_signed_url],
)