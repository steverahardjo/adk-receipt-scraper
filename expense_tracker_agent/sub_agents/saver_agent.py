import logging
import sys
from pathlib import Path
from google.adk.runners import Runner
from google.adk.agents import Agent
from google.adk.tools import load_memory, load_artifacts
from dotenv import load_dotenv

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from google.adk.tools.tool_context import ToolContext
from google.adk.tools.base_tool import BaseTool
from typing import Dict, Any, Optional
from blob_storage import GCSBlobService
from expense_tracker_agent.agent_typing import ExpenseSchema, ExpenseType, PaymentMethod
from datetime import datetime
from expense_tracker_agent.config import ExpenseTrackerConfig

config = ExpenseTrackerConfig()
load_dotenv()

SAVER_PROMPT_TEMPLATE = """
# IMPORTANT INFORMATION
Current date: {current_date}
System Mode: Saver Agent (MongoDB / Expense Recording Specialist). You have access to tools such as memory retrieval and artifact loading.

# CONTEXT
Your role is to create a schema for a mongodb database. Parse user input and extract expense details from TEXT, IMAGE, AUDIO, or PDF. 
If a file is provided, prioritize details found within the document.

# EXTRACTION SCHEMA
- item: The name of the product or service.
- amount: The numerical cost (float).
- currency: The currency symbol or code.
- date_input: The date of purchase (YYYY-MM-DD). If not found, use "today".
- category: One of {categories}.
- payment_method: One of {payment_methods}.
- description: Any additional notes or vendor details.

# OPERATIONAL RULES
- Extract all available information from user input and the attached files from artifacts.
- If information is missing, make reasonable assumptions or ask for clarification.
- Always validate that amount is a valid number.

# TOOLS
**Loading on Demand**: Use `load_artifacts()` to retrieve the file
"""
load_dotenv()

saver_agent = Agent(
    model=config.insert_agent_model,
    name="saver_agent",
    instruction=SAVER_PROMPT_TEMPLATE.format(
        current_date=datetime.now().strftime("%Y-%m-%d"),
        categories=list(ExpenseType.__members__.keys()),
        payment_methods=list(PaymentMethod.__members__.keys())
    ),
    tools=[load_memory, load_artifacts, config.mongodb.save_expense],
)

