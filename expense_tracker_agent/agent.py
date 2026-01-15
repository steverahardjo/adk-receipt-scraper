import logging
import asyncio
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.adk.agents import Agent
from google.adk.tools.agent_tool import AgentTool
from google.adk.artifacts import InMemoryArtifactService
from google.adk.tools import load_memory
from google.adk.memory import InMemoryMemoryService
from google.adk.plugins.save_files_as_artifacts_plugin import SaveFilesAsArtifactsPlugin
from expense_tracker_agent.prompts import ROOT_PROMPT, SAVER_PROMPT, SEARCH_PROMPT
from .tool import generate_visual, MongoTool
from .subagent import visualiser_agent
from google.adk.apps import App
from google.adk.tools import load_artifacts
from dotenv import load_dotenv


load_dotenv()
mongodb = MongoTool(db_name="user_expense")

# --- Agents ---
saver_agent = Agent(
    model="gemini-2.0-flash",
    name="saver_agent",
    instruction=SAVER_PROMPT,
    tools=[mongodb.insert_expense, load_memory, load_artifacts]
)

retrieve_agent = Agent(
    model="gemini-3-flash-preview",
    name="retrieve_agent",
    instruction=SEARCH_PROMPT,
    tools=[mongodb.search_expenses, load_memory]
)

root_agent = Agent(
    model="gemini-2.0-flash",
    name="root_agent",
    instruction=ROOT_PROMPT,
    output_key="root_agent",
    tools=[
        mongodb.clear_db,
        AgentTool(saver_agent),
        AgentTool(retrieve_agent),
        AgentTool(visualiser_agent),
    ]
)

# --- Memory and artifacts ---
memory_service = InMemoryMemoryService()
artifact_service = InMemoryArtifactService()

# --- Session ---
session_service = InMemorySessionService()

logging.info("Expense tracker runner initialized for adk web")

app = App(
    name="expense_tracker_agent",
    root_agent=root_agent,
    plugins = [SaveFilesAsArtifactsPlugin("expense_tracker_files")]
)
runner = Runner(
        app = app,
        session_service=session_service,
        memory_service=memory_service,
        artifact_service=artifact_service,
    )