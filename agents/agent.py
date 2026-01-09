import logging
import asyncio
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.adk.agents import Agent, SequentialAgent
from google.adk.tools.agent_tool import AgentTool
from google.adk.artifacts import InMemoryArtifactService
from google.adk.tools import load_memory
from google.adk.memory import InMemoryMemoryService
from google.adk.tools import load_memory
from agents.prompts import ROOT_PROMPT, SAVER_PROMPT, SEARCH_PROMPT, VISUALIZER_PROMPT
from google.adk.code_executors import BuiltInCodeExecutor

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

    visualiser_agent = Agent(
        model=model_name,
        name="visualiser_agent",
        instruction=VISUALIZER_PROMPT,
        code_executor=BuiltInCodeExecutor(),
        
    )

    retrieve_agent = Agent(
        model=model_name,
        name="retrieve_agent",
        instruction=SEARCH_PROMPT,

        tools=[AgentTool(visualiser_agent), mongo_db_inst.search_expenses]
    )

    root_agent = Agent(
        model=model_name,
        name="root_agent",
        instruction=ROOT_PROMPT,
        output_key="root_vis",
        tools=[
            AgentTool(saver_agent),
            AgentTool(retrieve_agent),
            load_memory
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
        session_id=session_id
    )
    runner = Runner(
        agent=root_agent,
        app_name=app_name,
        session_service=session_service,
        memory_service=memory_service,
        artifact_service=artifact_service,
    )

    logging.info(f"Runner and session ready for user {user_id} in app {app_name}")

    return session, runner
