from google.adk.agents import Agent
from google.adk.tools.agent_tool import AgentTool
from google.adk.tools.load_memory_tool import load_artifacts, load_memory
from retriever_agent import retrieve_agent

from expense_tracker_agent.config import get_config

config = get_config()

BANK_AGENT_PROMPT = """
# ROLE
You handle bank statement reconciliation. Help users compare their expenses against bank statements.

# TOOLS
- `get_monthly_expenses`: Get expenses for a month
- `export_monthly_csv`: Export expenses to CSV

# WORKFLOW

## Reconciliation
1. User asks to reconcile a month
2. Get expenses via `get_monthly_expenses`
3. Compare against bank statement
4. Report matches and discrepancies

## Export
1. User requests CSV export
2. Call `export_monthly_csv` with month/year
3. Return file path to user

# OUTPUT
Be concise. Report:
- Total expenses tracked
- Total from bank statement
- Discrepancies (if any)
- Unmatched items
"""

bank_agent = Agent(
    model=config.retriever_agent_model,
    name="bank_agent",
    instruction=BANK_AGENT_PROMPT,
    tools=[
        AgentTool(retrieve_agent),
        config.mongodb.export_monthly_csv,
        load_memory,
        load_artifacts,
    ],
)
