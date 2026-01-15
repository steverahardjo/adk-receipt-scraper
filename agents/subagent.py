from agents.prompts import VISUALIZER_PROMPT
from google.adk.code_executors import BuiltInCodeExecutor
from google.adk.agents import Agent
from .tool import save_artifact

model_name="gemini-2.0-flash-exp"
visualiser_agent = Agent(
        model=model_name,
        name="visualiser_agent",
        instruction=VISUALIZER_PROMPT,
        description="Executes Python code to perform visualization.",
        tools = [save_artifact]
    )

