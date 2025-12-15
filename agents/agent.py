import os
from agents.prompts import ROOT_PROMPT
import logging
import agents.types import ExpenseSchema

from google.adk.agents import Agent, SequentialAgent

MODEL_NAME = "gemini-2.5-flash"

logging.info(f"Using model: {MODEL_NAME}")

saver_agent = Agent(
    model = MODEL_NAME,
    name = "saver_agent",
    instruction = 
)

visualiser_agent = Agent(

)

retrieve_agent = Agent(

)




root_agent = Agent(
    model = MODEL_NAME,
    name = "root_agent",
    instruction = ROOT_PROMPT,
)


