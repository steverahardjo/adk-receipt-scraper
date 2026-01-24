import logging
from google.adk.runners import Runner
from google.adk.agents import Agent
from google.adk.tools import load_memory, load_artifacts
from google.adk.tools import ToolContext
from ..config import ExpenseTrackerConfig
from dotenv import load_dotenv
from blob_storage import GCSBlobService
from ..agent_typing import ExpenseSchema, ExpenseType, PaymentMethod
from datetime import datetime
import re
from pydantic import ValidationError
import json

config = ExpenseTrackerConfig()
load_dotenv()

# Updated Prompt to include filename context
SAVER_PROMPT_TEMPLATE = """
# IMPORTANT INFORMATION
Current date: {current_date}
System Mode: Saver Agent (MongoDB / Expense Recording Specialist)
Processing File: {file_name} 

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
- Extract all available information from user input and the attached file: {file_name}
- If information is missing, make reasonable assumptions or ask for clarification.
- Always validate that amount is a valid number.

# TOOLS
**Loading on Demand**: Use `load_artifacts()` to retrieve the file: {file_name}
"""

blob_service = GCSBlobService()

saver_agent = Agent(
    model=config.insert_agent_model,
    name="saver_agent",
    instruction=SAVER_PROMPT_TEMPLATE.format(
        current_date=datetime.now().strftime("%Y-%m-%d"),
        file_name="None", 
        categories=list(ExpenseType.__members__.keys()),
        payment_methods=list(PaymentMethod.__members__.keys())
    ),
    tools=[load_memory, load_artifacts],
    output_schema=ExpenseSchema
)

saver_runner = Runner(
    app=None,
    app_name=config.app_name,
    agent=saver_agent,
    memory_service=config.memory_service,
    artifact_service=config.artifact_service,
    session_service=config.session_service
)

async def saver_agent_func(saver_runner, message, filename:str, has_artifact):
    """
    Processes a user message through the saver_agent, extracts JSON, 
    and validates it against the ExpenseSchema.
    """
    
    # 1. Setup Instructions
    instruction = SAVER_PROMPT_TEMPLATE.format(
        current_date=datetime.now().strftime("%Y-%m-%d"),
        file_name=filename if has_artifact else "No file attached",
        categories=list(ExpenseType.__members__.keys()),
        payment_methods=list(PaymentMethod.__members__.keys()),
    )
    
    # We assume saver_agent is accessible or part of the runner state
    # saver_agent.instruction = instruction 

    try:
        # 2. Run the Agent
        # result_schema here is likely an AgentResponse or similar object
        raw_response = await saver_runner.run_debug(
            user_id="saver_agent",
            session_id="sesh_1",
            user_messages=message,
        )
        raw_response.type()

        # 3. The Bridge: Extract and Clean
        # Extract the string content (adjust '.content' based on your specific framework)
        content = raw_response.content if hasattr(raw_response, 'content') else str(raw_response)
        
        # Strip Markdown code blocks if the LLM included them (e.g., ```json ... ```)
        clean_json = re.sub(r"```json\s?|\s?```", "", content).strip()

        # 4. Validation
        expense_data = ExpenseSchema.model_validate_json(clean_json)
        
        print("Successfully parsed expense!")
        return expense_data

    except ValidationError as ve:
        print(f"Schema Mismatch: The LLM returned invalid data structures. \n{ve}")
    except json.JSONDecodeError:
        print(f"JSON Error: The runner did not return valid JSON. Content: {content}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
    
    return None

# Example usage: