import asyncio
from agents.tool import MongoTool
from agents.agent import create_expense_tracker_runner
USER_ID = "steve"
from dotenv import load_dotenv

load_dotenv()
async def main():
    mongodb = MongoTool(db_name="user_expense")
    session, runner = await create_expense_tracker_runner(
        mongo_db_inst=mongodb,
        model_name="gemini-3-flash-preview",
        app_name="expense_tracker",
        user_id="steve",
        session_id="session_001"
    )
    print("Session and runner ready!")

    content= "I bought chicken rice for 8 ringgit."
    # Run the root agent
    result = await runner.run_debug(
        session_id = "debug_sesh",
        user_messages=content,
        user_id = USER_ID,
    )
    print(result)   

asyncio.run(main())
