import os
import agentops
from dotenv import load_dotenv

load_dotenv()


def set_observ():
    """Instrument the ADK with Agentops"""
    AGENTOPS_API_KEY = (
        os.getenv("AGENTOPS_API_KEY") or "cd4d0250-7071-482e-b9e8-ae89515f5c9b"
    )
    agentops.init(api_key=AGENTOPS_API_KEY, default_tags=["google adk"])
