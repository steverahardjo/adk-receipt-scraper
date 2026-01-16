import os
import asyncio
import logging
from aiogram import Bot, Dispatcher, F
from aiogram.types import Message
from aiogram.filters import Command
from expense_tracker_agent.agent import expense_runner
from expense_tracker_agent.tracing import set_observ

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
bot = Bot(token=TOKEN)
dp = Dispatcher()
set_observ()

def extract_text_from_result(result):
    if not result or not isinstance(result, list):
        return "No response generated."

    # 1. Get the last event in the list
    last_event = result[-1]
    if hasattr(last_event, 'content') and last_event.content.parts:
        return last_event.content.parts[0].text
    if hasattr(last_event, 'actions') and last_event.actions.state_delta:
        return last_event.actions.state_delta.get('root_agent', "")


async def process_multimodal_request(message: Message, file_ext: str)->str:
    """Downloads the file and sends it to the ADK Runner."""
    session_id = f"tg_{message.chat.id}"
    user_id = str(message.from_user.id)

    # Text context (caption if it's a photo, or general prompt)
    prompt = message.caption or message.text or "Extract expenses from this file."

    # 1. Download the file from Telegram
    file_id = None
    if message.photo:
        file_id = message.photo[-1].file_id
    elif message.document:
        file_id = message.document.file_id
    elif message.voice or message.audio:
        file_id = (message.voice or message.audio).file_id

    file_info = await bot.get_file(file_id)
    local_filename = f"input_{file_id}.{file_ext}"
    await bot.download_file(file_info.file_path, local_filename)

    try:
        result = await expense_runner.run_debug(
            session_id=session_id,
            user_id=user_id,
            user_messages=prompt,
            files=[local_filename],
        )
        return extract_text_from_result(result)

    except Exception as e:
        logging.error(f"Error processing agent: {e}")
        await message.answer("I couldn't process that file. Please try again.")

    finally:
        # 4. Cleanup local file
        if os.path.exists(local_filename):
            os.remove(local_filename)


# --- HANDLERS ---
@dp.message(Command("start"))
async def start_cmd(message: Message):
    await message.answer(
        "Hello! Send me a photo of a receipt, a PDF invoice, or a voice note of your spending."
    )


@dp.message(F.photo)
async def handle_photo(message: Message):
    await process_multimodal_request(message, "jpg")


@dp.message(F.document.mime_type == "application/pdf")
async def handle_pdf(message: Message):
    await process_multimodal_request(message, "pdf")


@dp.message(F.voice | F.audio)
async def handle_audio(message: Message):
    # Telegram voice is usually .ogg
    await process_multimodal_request(message, "ogg")


@dp.message(F.text)
async def handle_text(message: Message):
    session_id = f"tg_{message.chat.id}"
    result = await expense_runner.run_debug(
        session_id=session_id,
        user_id=str(message.from_user.id),
        user_messages=message.text,
    )
    await message.answer(extract_text_from_result(result))


async def main():
    logging.basicConfig(level=logging.INFO)
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
