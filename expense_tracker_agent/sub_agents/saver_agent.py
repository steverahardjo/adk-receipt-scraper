import logging
from google.adk.runners import Runner
from google.adk.agents import Agent
from google.adk.tools import load_memory
from ..config import ExpenseTrackerConfig
from google.adk.tools import load_artifacts
from dotenv import load_dotenv
from blob_storage import GCSBlobService
from ..agent_typing import Expense
from datetime import datetime

config = ExpenseTrackerConfig()
load_dotenv()

SAVER_PROMPT = f"""
# IMPORTANT INFORMATION
Current date: {datetime.now().strftime("%Y-%m-%d")}
System Mode: Saver Agent (MongoDB / Expense Recording Specialist)

# CONTEXT
Your role is to create for a mongodb database. Parse user input and extract expense details in TEXT, IMAGE, AUDIO, PDF.

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

# OUTPUT
1. You must use the `create_expense` tool to save the data.
2. IMMEDIATELY after calling `create_expense`, you must stop. 
3. DO NOT provide a conversational summary, confirmation message, or "straight answer" text.
4. Your final action should be the tool call itself.
# TOOLS
**Loading on Demand**: The `load_artifacts()` are loading available Artifacts in the session
"""
blob_service = GCSBlobService()
mongodb = config.mongodb
saver_agent = Agent(
    model=config.insert_agent_model,
    name="saver_agent",
    instruction=SAVER_PROMPT,
    tools=[mongodb.create_expense, load_memory, load_artifacts],
)

saver_runner = Runner(
    app = None,
    app_name = config.app_name,
    agent = saver_agent,
    memory_service= config.memory_service,
    artifact_service=config.artifact_service,
    session_service = config.session_service)

async def saver_agent_func(message: str, has_artifact: bool, session_id: str, user_id: str):
    """
    Logic: 
    1. Determine if we use raw text or multimodal artifacts.
    2. Run runner to get an Expense object.
    3. If artifact exists: Load it, save it to blob storage, and update Expense.
    """

    result = await saver_runner.run_debug(
        session_id=session_id,
        user_id=user_id,
        user_messages=message,
    )
    if isinstance(result, Expense):
        if hasattr(result, 'date_recorded') and isinstance(result.date_recorded, datetime.date):
                    result.date_recorded = result.date_recorded.isoformat()
        
        if hasattr(result, 'datetime') and isinstance(result.datetime, datetime.date):
            result.datetime = result.datetime.isoformat()
        if has_artifact:
            filename = await saver_runner.artifact_service.list_artifacts(
                app_name=config.app_name,
                session_id=session_id,
                user_id=user_id
            )

            artifact_part = await saver_runner.artifact_service.load_artifact(
                app_name=config.app_name,
                filename=filename[0],
                session_id=session_id,
                user_id=user_id
            )
            blob_id = await blob_service.save(
                data = artifact_part.inline_data,
                filename = filename[0],
                mime_type=artifact_part.inline_data.mime_type
            ) 
            result.add_child(
                name = blob_id,
                clas= "blob_filename"
            )
    else:
        raise KeyError("Sub agent, saver agent unable to process after function calling")
    if isinstance(result, Expense) and hasattr(result, 'insert'):
        await result.insert()
        logging.info(f"Finalized Expense Saved: {result.item} with Blob linked.")
        return result
    return str(result)
