import os
from agents.prompts import ROOT_PROMPT, SAVER_PROMPT, SEARCH_PROMPT, VISUALIZER_PROMPT
from agents.types import ExpenseSchema
import logging
from google.adk.utils import instructions_utils

from google.adk.agents import Agent, SequentialAgent
from google.adk.tools.agent_tool import AgentTool
from google.adk.artifacts import InMemoryArtifactService
from agents.tool import MongoTool, ExpenseAggregator

artifact_service = InMemoryArtifactService()
mongodb = MongoTool("user_expense", "", "")
aggregator = ExpenseAggregator()

MODEL_NAME = "gemini-2.5-flash"

logging.info(f"Using model: {MODEL_NAME}")

saver_agent = Agent(
    model = MODEL_NAME,
    name = "saver_agent",
    instruction =  SAVER_PROMPT,
    tool = mongodb.insert_expense,
    output_schema= ExpenseSchema
)

visualiser_agent = Agent(
    model = MODEL_NAME,
    name = "visualiser_agent",
    instruction = VISUALIZER_PROMPT
)


retrieve_agent = Agent(
    model = MODEL_NAME, 
    name = "retrieve_agent",
    instruction = SEARCH_PROMPT,
    tools = [AgentTool(visualiser_agent), mongodb.search_expenses ]
)

root_agent = Agent(
    model = MODEL_NAME,
    name = "root_agent",
    instruction = ROOT_PROMPT,
    output_key = "root_vis",
    tools = [
        AgentTool(saver_agent),
        AgentTool(retrieve_agent)

    ]
)