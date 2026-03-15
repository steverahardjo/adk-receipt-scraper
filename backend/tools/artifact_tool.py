"""Artifact and visualization tools."""

import logging
import os

from google.adk.tools import ToolContext
from google.adk.tools.agent_tool import AgentTool


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
    Generate visualization code from user request.

    Args:
        user_request: Visualization type and processing requirements
        dataset: Expense data as JSON string
    Returns:
        File path to generated visualization
    """
    from expense_tracker_agent.sub_agents.viz_agent import visualiser_agent

    # Reuse agent tool instance (no need to recreate each time)
    agent_tool = AgentTool(visualiser_agent)
    output = await agent_tool.run_async(
        args={"request": user_request, "dataset": dataset}, tool_context=tool_context
    )
    tool_context.state["viz_agent_output"] = output
    return output
