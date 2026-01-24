from expense_tracker_agent.agent_typing import (
    Expense,
    ExpenseSchema,
    PaymentMethod,
    Currency,
    ExpenseType
)
from typing import Optional
from datetime import datetime, date
import logging
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from google.adk.tools import ToolContext
from .sub_agents.viz_agent import visualiser_agent
from google.adk.tools.agent_tool import AgentTool
from typing import Any
from blob_storage import GCSBlobService


MONGO_ADDR = "mongodb://localhost:27017"



class MongoTool:
    def __init__(self, db_name: str, uri: str = MONGO_ADDR):
        self.db_name = db_name
        self.uri = uri
        self.client: Optional[AsyncIOMotorClient] = None
        self.inited: bool = False

    async def init(self):
        if not self.inited:
            self.client = AsyncIOMotorClient(self.uri)
            await init_beanie(
                database=self.client[self.db_name], document_models=[Expense]
            )
            self.inited = True
            logging.info("MongoTool initialized")
    
    async def save_expense(self, expense: ExpenseSchema, blob_filename: str = None) -> str:
        await self.init()
        doc = await expense.to_document()
        
        if blob_filename:
            doc.blob_filename = blob_filename

        res = await doc.insert()

        # Traditional logging
        logging.info(
            "Expense saved: %s | Blob: %s | ID: %s",
            doc.item if hasattr(doc, "item") else "unknown",
            blob_filename,
            getattr(doc, "id", None)
        )

        return str(res)
    
    async def search_expenses(self, limit: int = 50, **filters: Any) -> list[dict]:
        await self.init()
        query = Expense.find(filters)
        results = await query.sort(-Expense.datetime).limit(limit).to_list()

        return [r.model_dump(mode="json") for r in results]

    async def clear_db(self):
        await self.init()
        await Expense.delete_all()
        logging.info("Cleared all expenses from the database")

    async def test_result(self):
        await self.init()
        return await Expense.find().to_list()


async def save_artifact(
    tool_context: ToolContext, file_path: str, artifact_name: str = None
) -> str:
    """
    Save a file as an artifact in the ADK system.
    Args:
        tool_context: ToolContext provided by ADK
        file_path: Path to the file to save
        artifact_name: Optional name for the artifact (defaults to filename)
    Returns:
        Artifact ID or path
    """
    import os

    try:
        # Handle empty or None paths
        if not file_path or not isinstance(file_path, str):
            error_msg = f"Invalid file path: {file_path}"
            logging.error(error_msg)
            return error_msg

        # Normalize the path
        file_path = os.path.abspath(file_path)

        if not os.path.exists(file_path):
            error_msg = f"Error: File not found at {file_path}"
            logging.error(error_msg)
            return error_msg

        filename = artifact_name or os.path.basename(file_path)

        # Check file size
        file_size = os.path.getsize(file_path)
        if file_size == 0:
            error_msg = f"Error: File at {file_path} is empty"
            logging.error(error_msg)
            return error_msg

        # Store in tool_context state for artifact tracking
        tool_context.state["saved_artifact"] = {
            "path": file_path,
            "name": filename,
            "type": "image",
            "size": file_size,
        }
        logging.info(f"Artifact saved: {filename} ({file_size} bytes) at {file_path}")
        return file_path
    except Exception as e:
        error_msg = f"Error saving artifact: {str(e)}"
        logging.error(error_msg)
        return error_msg


async def generate_visual(tool_context: ToolContext, user_request: str, dataset: str):
    """
    This tool generate python code from user request for a visualization
    Task it can do:
    * Compiling and processing data using pandas
    * Creating graph for data viz using matplotlib, seaborn
    Args:
    user_request(str): Form of visualization and processing user desire
    dataset(str): Data passed as a string in json format to processed
    Returns:
    Response from viz agent as a address of the file.
    """
    agent_tool = AgentTool(visualiser_agent)
    output = await agent_tool.run_async(
        args={"request": user_request, "dataset": dataset}, tool_context=tool_context
    )
    tool_context.state["viz_agent_output"] = output
    return output
