
from google.adk.sessions import InMemorySessionService
from google.adk.artifacts import InMemoryArtifactService
from google.adk.memory import InMemoryMemoryService
from dataclasses import dataclass
from .tool import MongoTool


@dataclass
class ExpenseTrackerConfig:
    mongodb = MongoTool(db_name="user_expense")
    root_agent_model: str = "gemini-2.5-flash"
    retriever_agent_model: str = "gemini-3-flash-preview"
    insert_agent_model: str = "gemini-3-flash-preview"
    app_name = "adk-expense-tracker"
    memory_service = InMemoryMemoryService()
    artifact_service = InMemoryArtifactService()
    session_service = InMemorySessionService()
    
@dataclass
class AppRunnerConfig:
    session_id:str
    user_id:str


