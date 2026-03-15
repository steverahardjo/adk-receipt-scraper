import logging
from dataclasses import dataclass, field
from typing import Optional

from google.adk.artifacts import InMemoryArtifactService
from google.adk.memory import InMemoryMemoryService
from google.adk.sessions import InMemorySessionService
from tools import GCSBlobService, MongoTool


@dataclass
class ExpenseTrackerConfig:
    mongodb: Optional[MongoTool] = None
    gcs: Optional[GCSBlobService] = None
    root_agent_model: str = "gemini-2.5-flash"
    retriever_agent_model: str = "gemini-3-flash-preview"
    insert_agent_model: str = "gemini-3-flash-preview"
    app_name: str = "adk-expense-tracker"
    memory_service: InMemoryMemoryService = field(default_factory=InMemoryMemoryService)
    artifact_service: InMemoryArtifactService = field(default_factory=InMemoryArtifactService)
    session_service: InMemorySessionService = field(default_factory=InMemorySessionService)

    def __post_init__(self):
        """Initialize services after dataclass creation."""
        if self.mongodb is None:
            self.mongodb = MongoTool(db_name="user_expense")
        if self.gcs is None:
            self.gcs = GCSBlobService()
        logging.info("ExpenseTrackerConfig initialized with MongoDB and GCS services")


# Global config instance (lazy initialization)
_config: ExpenseTrackerConfig | None = None


def get_config() -> ExpenseTrackerConfig:
    """Get or create the global config singleton."""
    global _config
    if _config is None:
        _config = ExpenseTrackerConfig()
    return _config


async def initialize_services() -> None:
    """
    Pre-initialize all external services (MongoDB, GCS).
    Call this at application startup to establish connections eagerly.
    """
    config = get_config()
    try:
        await config.mongodb._ensure_connected()
    except Exception as e:
        logging.warning(f"MongoDB initialization failed: {e}")
    logging.info("Service initialization attempted")
