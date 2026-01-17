# File created to set and regulate config of the whole application

import google.auth
import os
from dataclasses import dataclass


@dataclass
class ExpenseTrackerConfig:
    mongodb_name = "user_expense"
    root_agent_model: str = "gemini-2.5-flash"
    retriever_agent_model: str = "gemini-3-flash-preview"
    insert_agent_model: str = "gemini-3-flash-preview"

