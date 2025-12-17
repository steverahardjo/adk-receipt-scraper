import os
from agents.prompts import ROOT_PROMPT, SAVER_PROMPT, SEARCH_PROMPT, VISUALIZER_PROMPT
from agents.types import ExpenseSchema, Payload, PayloadType
import logging
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.adk.agents import Agent, SequentialAgent
from google.adk.tools.agent_tool import AgentTool
from google.adk.artifacts import InMemoryArtifactService
from agents.tool import MongoTool
from google.adk.tools import load_memory
from google.adk.memory import InMemoryMemoryService


"""
List of features:
- Accepting picture of receipt
- Root agent that can remember the current time, last upload
- Saver agent
- retrieve agent
- aggregation agent
"""
mongodb = MongoTool("user_expense", "", "")
MODEL_NAME = "gemini-2.5-flash"
logging.info(f"Using model: {MODEL_NAME}")

saver_agent = Agent(
    model = MODEL_NAME,
    name = "saver_agent",
    instruction =  SAVER_PROMPT,
    tool = mongodb.insert_expense,
    output_schema= ExpenseSchema
)

visualiser_agent = Agent(
    model = MODEL_NAME,
    name = "visualiser_agent",
    instruction = VISUALIZER_PROMPT
)


retrieve_agent = Agent(
    model = MODEL_NAME, 
    name = "retrieve_agent",
    instruction = SEARCH_PROMPT,
    tools = [AgentTool(visualiser_agent), mongodb.search_expenses ]
)

root_agent = Agent(
    model = MODEL_NAME,
    name = "root_agent",
    instruction = ROOT_PROMPT,
    output_key = "root_vis",
    tools = [
        AgentTool(saver_agent),
        AgentTool(retrieve_agent),
        load_memory
    ]
)

APP_NAME = "expense_tracker"
USER_ID = "steve"
SESSION_ID = "session_001"

memory_service = InMemoryMemoryService()
artifact_service = InMemoryArtifactService()

async def setup_session_and_runner():
    session_service = InMemorySessionService()
    session = await session_service.create_session(app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID)
    runner = Runner(
        agent=root_agent, 
        app_name=APP_NAME, 
        session_service=session_service,
        artifact_service = artifact_service,
        )
    return session, runner