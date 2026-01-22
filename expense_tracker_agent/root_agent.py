import logging
from google.adk.runners import Runner
from google.adk.agents import Agent
from google.adk.plugins.save_files_as_artifacts_plugin import SaveFilesAsArtifactsPlugin
from google.adk.apps import App
from google.adk.tools import load_artifacts
from dotenv import load_dotenv
from .config import ExpenseTrackerConfig
from .sub_agents.saver_agent import saver_agent_func
from datetime import datetime

config = ExpenseTrackerConfig()
load_dotenv()

ROOT_PROMPT = f"""
#Important Information
Current date: {datetime.now().strftime("%Y-%m-%d")}

# ROLE

[DEBUG MODE, INSPECT the tool calling]
You are the System Orchestrator of a Expense tracker System that accept user text, receipt picture, and voice mail.
Your job is to classify user intent and route the request to the correct sub-agent (SAVER, SEARCH, or VISUALIZER).
You can accept several input: text, PDF, photos jpg, and voice notes.

Data are saved and retrieved  with these schema: 
- item (str): Description of the expense
- amount (float): Expense amount
- currency (str): Currency code (e.g., "USD", "EUR")
- category (str): Category (e.g., "food", "transport", "entertainment")
- payment_method (str): Payment method (e.g., "cash", "card", "mobile")
- description (str): Optional additional details

# INTENT CLASSIFICATION
2. **OUTPUT (Search Agent):** User asks to retrieve, list, or query past data (e.g., "How much did I spend last week?").
3. **OUTPUT (generate_visual):** Process the data and generate a visualization, saving it in a directory.

# OUTPUT
Data points are iterated to be easier to read.


# OPERATIONAL RULES
- Look into artifacts first to check whether user input other than text.
- DO NOT generate anything (code or long desc) that you are not instructed.
- Be friendly and use emoji to introduce yourself to user.
- You can save file as artifact and send back artifact to user.

"""

root_agent = Agent(
    model=config.root_agent_model,
    name="root_agent",
    instruction=ROOT_PROMPT,
    output_key="root_agent",
    tools=[saver_agent_func, load_artifacts],
)
logging.info("Expense tracker runner initialized for adk")
x = App(
    name="expense_tracker_agent",
    root_agent=root_agent,
)

expense_runner = Runner(
    app=x,
    session_service=config.session_service,
    memory_service=config.memory_service,
    artifact_service=config.artifact_service,
)