import logging
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.adk.agents import Agent
from google.adk.tools.agent_tool import AgentTool
from google.adk.artifacts import InMemoryArtifactService
from google.adk.tools import load_memory
from google.adk.memory import InMemoryMemoryService
from google.adk.plugins.save_files_as_artifacts_plugin import SaveFilesAsArtifactsPlugin
from expense_tracker_agent.prompts import ROOT_PROMPT, SAVER_PROMPT, SEARCH_PROMPT
from .tool import MongoTool
from .subagent import visualiser_agent
from google.adk.apps import App
from google.adk.tools import load_artifacts
from dotenv import load_dotenv
from .config import ExpenseTrackerConfig

config = ExpenseTrackerConfig()

load_dotenv()
mongodb = MongoTool(db_name=config.mongodb_name)

# --- Agents ---
saver_agent = Agent(
    model=config.insert_agent_model,
    name="saver_agent",
    instruction=SAVER_PROMPT,
    tools=[mongodb.insert_expense, load_memory, load_artifacts],
)

retrieve_agent = Agent(
    model=config.retriever_agent_model,
    name="retrieve_agent",
    instruction=SEARCH_PROMPT,
    tools=[mongodb.search_expenses, load_memory],
)

root_agent = Agent(
    model=config.root_agent_model,
    name="root_agent",
    instruction=ROOT_PROMPT,
    output_key="root_agent",
    tools=[
        mongodb.clear_db,
        AgentTool(saver_agent),
        AgentTool(retrieve_agent),
        AgentTool(visualiser_agent),
    ],
)

# --- Memory and artifacts ---
memory_service = InMemoryMemoryService()
artifact_service = InMemoryArtifactService()
session_service = InMemorySessionService()

logging.info("Expense tracker runner initialized for adk web")

x = App(
    name="expense_tracker_agent",
    root_agent=root_agent,
    plugins=[SaveFilesAsArtifactsPlugin("expense_tracker_files")],
)

expense_runner = Runner(
    app=x,
    session_service=session_service,
    memory_service=memory_service,
    artifact_service=artifact_service,
)

expense_runner
