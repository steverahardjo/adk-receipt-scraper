import os
import agentops
from dotenv import load_dotenv
import telegramify_markdown
from google.adk.runners import Runner
import io
import hashlib
import google.genai.types as types
from .agent_typing import InputType
import logging
from .agent_typing import AgentOutput
import json

load_dotenv()


def set_observ():
    """Instrument the ADK with Agentops"""
    AGENTOPS_API_KEY = (
        os.getenv("AGENTOPS_API_KEY") or "cd4d0250-7071-482e-b9e8-ae89515f5c9b"
    )
    agentops.init(api_key=AGENTOPS_API_KEY, default_tags=["google adk"])

def extract_agent_output(result, main_agent_name: str) -> AgentOutput:
    if not result or not isinstance(result, list):
        return AgentOutput(type="text", content="No response generated.")

    last_event = result[-1]
    raw = None

    if hasattr(last_event, "actions") and last_event.actions.state_delta:
        raw = last_event.actions.state_delta.get(main_agent_name)

    if not raw and hasattr(last_event, "content") and last_event.content.parts:
        raw = last_event.content.parts[0].text

    if not raw:
        return AgentOutput(type="text", content="No response generated.")

    if isinstance(raw, str):
        raw = raw.strip()
        try:
            data = json.loads(raw)
            return AgentOutput.model_validate(data)
        except Exception:
            return AgentOutput(type="text", content=raw)

    return AgentOutput.model_validate(raw)


def markdownify(text: str) -> str:
    """Convert text to Telegram-compatible MarkdownV2 format."""
    return telegramify_markdown.telegramify(text)
    
def get_hashed_id(file_id: str) -> str:
    """Creates a deterministic SHA-256 hash of the file_id."""
    return hashlib.sha256(file_id.encode('utf-8')).hexdigest()

async def save_multimodal_artifact(
    file_id: str, 
    t: InputType, 
    runner: "Runner", 
    buffer: io.BytesIO, 
    session_id: str, 
    user_id: str
) -> str:
    """Saves artifact using raw ID to minimize token overhead."""
    mime_type, extension = t.value
    clean_id = file_id.split("/")[-1] 
    filename = f"{clean_id}"

    # 3. Save Artifact
    buffer.seek(0)
    await runner.artifact_service.save_artifact(
        filename=filename,
        artifact=types.Part.from_bytes(data=buffer.read(), mime_type=mime_type),
        app_name=runner.app_name,
        user_id=user_id,
        session_id=session_id
    )
    logging.info("save multimodal artifact succesful")
    return filename



