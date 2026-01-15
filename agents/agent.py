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
from agents.prompts import ROOT_PROMPT, SAVER_PROMPT, SEARCH_PROMPT
from .tool import generate_visual, list_user_files, MongoTool
from .subagent import visualiser_agent

mongodb = MongoTool(db_name="user_expense")

# Create default agents for adk web
saver_agent = Agent(
    model="gemini-2.0-flash-exp",
    name="saver_agent",
    instruction=SAVER_PROMPT,
    tools=[load_memory, mongodb.insert_expense]
)

retrieve_agent = Agent(
    model="gemini-2.0-flash-exp",
    name="retrieve_agent",
    instruction=SEARCH_PROMPT,
    tools=[generate_visual, mongodb.search_expenses]
)

root_agent = Agent(
    model="gemini-2.0-flash-exp",
    name="root_agent",
    instruction=ROOT_PROMPT,
    output_key="root_agent",
    tools=[
        AgentTool(saver_agent),
        AgentTool(retrieve_agent),
        load_memory,
        generate_visual
    ]
)


async def create_expense_tracker_runner(
    mongo_db_inst,
    model_name: str,
    app_name: str,
    user_id: str,
    session_id: str
):
    """
    Sets up all agents, memory, artifacts, session, and returns a runner and session.

    Args:
        mongo_db_inst: Instance of MongoTool with insert/search methods.
        model_name: LLM model name to use for agents.
        app_name: Name of the app.
        user_id: User identifier.
        session_id: Session identifier.
    
    Returns:
        session, runner
    """

    # --- Agents ---
    saver_agent = Agent(
        model=model_name,
        name="saver_agent",
        instruction=SAVER_PROMPT,
        tools=[mongo_db_inst.insert_expense, load_memory]
    )

    retrieve_agent = Agent(
        model=model_name,
        name="retrieve_agent",
        instruction=SEARCH_PROMPT,
        tools=[mongo_db_inst.search_expenses, generate_visual]
    )

    root_agent = Agent(
        model=model_name,
        name="root_agent",
        instruction=ROOT_PROMPT,
        output_key="root_agent",
        tools=[
            AgentTool(saver_agent),
            AgentTool(retrieve_agent),
            load_memory,
            AgentTool(visualiser_agent),
            list_user_files
        ]
    )

    # --- Memory and artifacts ---
    memory_service = InMemoryMemoryService()
    artifact_service = InMemoryArtifactService()

    # --- Session ---
    session_service = InMemorySessionService()
    session = await session_service.create_session(
        app_name=app_name,
        user_id=user_id,
        session_id=session_id,
        state = {
            "current_date": asyncio.get_event_loop().time().__str__()
        }
    )
    runner = Runner(
        agent=root_agent,
        app_name=app_name,
        session_service=session_service,
        memory_service=memory_service,
        artifact_service=artifact_service,
        plugins = [SaveFilesAsArtifactsPlugin("expense_tracker_files")]
    )

    logging.info(f"Runner and session ready for user {user_id} in app {app_name}")

    return runner