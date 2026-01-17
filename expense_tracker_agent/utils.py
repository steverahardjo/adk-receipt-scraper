import os
import agentops
from dotenv import load_dotenv
import telegramify_markdown
from google.adk.runners import Runner
import io
load_dotenv()

import google.genai.types as types



def set_observ():
    """Instrument the ADK with Agentops"""
    AGENTOPS_API_KEY = (
        os.getenv("AGENTOPS_API_KEY") or "cd4d0250-7071-482e-b9e8-ae89515f5c9b"
    )
    agentops.init(api_key=AGENTOPS_API_KEY, default_tags=["google adk"])

def extract_text_from_result(result, main_agent_name:str):
    """
    Extract the correct last messagge being send by the main agent.
        :param result: Description
        :param main_agent_name: Description
        :type main_agent_name: str
    Output:
        - A proper message in a MarkdownV2 used by the telegram frontend.
    """
    if not result or not isinstance(result, list):
        return "No response generated."

    # 1. Get the last event in the list
    last_event = result[-1]
    result = ""
    if hasattr(last_event, 'content') and last_event.content.parts:
        result = last_event.content.parts[0].text
    if hasattr(last_event, 'actions') and last_event.actions.state_delta:
        result = last_event.actions.state_delta.get(main_agent_name, "")
    
    return telegramify_markdown.standardize(result)
    
class InputType(enumerate):
    PDF = "pdf"
    IMG = "image"
    AUDIO = "audio"

def save_multimodal_artifact(file_id:str, type:InputType, runner:Runner, buffer:io.BytesIO):
    buffer.seek(0)
    file_bytes = buffer.read()
    artifact = None
    if type.IMG == InputType.IMG:
        artifact = types.Part.from_bytes(
            data = file_bytes,
            mime_type = ""
        )

