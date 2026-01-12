import asyncio
from dotenv import load_dotenv
from agents.tool import MongoTool
from agents.agent import create_expense_tracker_runner
from agents.tracing import instrument_adk_with_arize

# Instruct ADK to use Arize for tracing and monitoring
print(instrument_adk_with_arize())

load_dotenv()

USER_ID = "steve"
APP_NAME = "expense_tracker"
SESSION_ID = "cli_session"


async def cli_chat():
    mongodb = MongoTool(db_name="user_expense")

    runner = await create_expense_tracker_runner(
        mongo_db_inst=mongodb,
        model_name="gemini-3-flash-preview",
        app_name=APP_NAME,
        user_id=USER_ID,
        session_id=SESSION_ID,
    )

    print("Expense Tracker CLI")
    print("Type 'exit' or 'quit' to stop.\n")

    while True:
        try:
            user_input = input("> ").strip()
            if not user_input:
                continue
            if user_input.lower() in {"exit", "quit"}:
                print("Goodbye.")
                break
            # Run agent
            result = await runner.run_debug(
                session_id=SESSION_ID,
                user_id=USER_ID,
                user_messages=user_input,
            )

            # Print agent output cleanly
            if isinstance(result, list):
                for event in result:
                    if event.is_final_response() and event.content:
                        print(event.content)
                        break
            else:
                print(result)

        except KeyboardInterrupt:
            print("\nInterrupted.")
            break


if __name__ == "__main__":
    asyncio.run(cli_chat())
