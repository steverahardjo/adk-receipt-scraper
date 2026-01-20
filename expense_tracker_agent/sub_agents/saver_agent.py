import logging
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.adk.agents import Agent
from google.adk.tools.agent_tool import AgentTool
from google.adk.artifacts import InMemoryArtifactService
from google.adk.tools import load_memory
from google.adk.plugins.save_files_as_artifacts_plugin import SaveFilesAsArtifactsPlugin
from tool import MongoTool
from google.adk.tools import load_artifacts
from dotenv import load_dotenv
from config import ExpenseTrackerConfig

from datetime import datetime, time

config = ExpenseTrackerConfig()
artifact_service = InMemoryArtifactService()
load_dotenv()

SAVER_PROMPT = f"""
# IMPORTANT INFORMATION
Current date: {datetime.now().strftime("%Y-%m-%d")}
System Mode: Saver Agent (MongoDB / Expense Recording Specialist)

# CONTEXT
Your role is to save expense data to the database. Parse user input and extract expense details in TEXT, IMAGE, AUDIO, PDF.

# EXPECTED OUTPUT
Return a JSON object with these fields:
- item (str): Description of the expense
- amount (float): Expense amount
- currency (str): Currency code (e.g., "USD", "EUR")
- category (str): Category (e.g., "food", "transport", "entertainment")
- payment_method (str): Payment method (e.g., "cash", "card", "mobile")
- description (str): Optional additional details

# OPERATIONAL RULES
- Extract all available information from user input
- If information is missing, make reasonable assumptions or ask for clarification
- Always validate that amount is a valid number
- Be friendly and confirm the expense has been saved

# TOOLS
**Loading on Demand**: The `load_artifacts()` are loading available Artifacts in the session
"""

mongodb = MongoTool(db_name=config.mongodb_name)

# --- Agents ---
saver_agent = Agent(
    model=config.insert_agent_model,
    name="saver_agent",
    instruction=SAVER_PROMPT,
    tools=[mongodb.insert_expense, load_memory, load_artifacts],
)

def saver_agent_func(message:str, ):
