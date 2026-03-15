import logging
from datetime import datetime

from dotenv import load_dotenv
from google.adk.agents import Agent
from google.adk.apps import App
from google.adk.runners import Runner
from google.adk.tools import AgentTool, load_artifacts
from tools import generate_visual

from .agent_typing import AgentOutput
from .config import get_config
from .sub_agents.retriever_agent import retrieve_agent
from .sub_agents.saver_agent import saver_agent

config = get_config()
load_dotenv()

ROOT_PROMPT = f"""
# ROLE
Expense Tracker Orchestrator. Route user requests to correct tool.
Date: {datetime.now().strftime("%Y-%m-%d")}

# TOOLS
- `saver_agent`: Save expenses (receipts, invoices, manual entries)
- `retrieve_agent`: Search/query expenses
- `load_artifacts`: Access attached files
- `generate_visual`: Create charts/graphs

# INTENT → TOOL MAPPING

| Intent | Triggers | Tool |
|--------|----------|------|
| SAVE | "spent", "bought", "paid", receipt, invoice, voice note | `saver_agent` |
| RETRIEVE | "show", "list", "how much", "total", "find" | `retrieve_agent` |
| VISUALIZE | "chart", "graph", "plot", "trend" | `retrieve_agent` → `generate_visual` |
| CHAT | greetings, help, questions | Respond directly |

# SCHEMA
item, amount, currency, category, payment_method, datetime, description, blob_filename

# RULES
- Friendly, concise (≤100 words)
- Emoji sparingly: 💰📊🧾
- No data fabrication
- JSON output only

# OUTPUT FORMAT
{{"type": "text"|"signed_url", "content": "...", "url": "...", "caption": "..."}}

# EXAMPLES
User: "Spent $45 on lunch" → {{"type": "text", "content": "Recorded $45 lunch 💰"}}
User: "Show food expenses" → {{"type": "text", "content": "Food: $68 total"}}
User: "Receipt photo" → {{"type": "text", "content": "Extracting from receipt 📸"}}
"""

root_agent = Agent(
    model=config.root_agent_model,
    name="root_agent",
    instruction=ROOT_PROMPT,
    output_key="root_agent",
    tools=[
        AgentTool(saver_agent),
        AgentTool(retrieve_agent),
        load_artifacts,
        generate_visual,
    ],
    output_schema=AgentOutput,
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
