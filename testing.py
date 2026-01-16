from expense_tracker_agent.agent import expense_runner as runner
import asyncio


print("Expense Tracker CLI")
print("Type 'exit' or 'quit' to stop.\n")

USER_ID = "steve"
APP_NAME = "expense_tracker"
SESSION_ID = "cli_session"

def extract_text_from_result(result):
    if not result or not isinstance(result, list):
        return "No response generated."

    # 1. Get the last event in the list
    last_event = result[-1]
    if hasattr(last_event, 'content') and last_event.content.parts:
        return last_event.content.parts[0].text
    if hasattr(last_event, 'actions') and last_event.actions.state_delta:
        return last_event.actions.state_delta.get('root_agent', "")

async def testing():
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
            print(extract_text_from_result(result))
        except KeyboardInterrupt:
            print("\nInterrupted.")
            break


if __name__ == "__main__":
    asyncio.run(testing())