import os
import asyncio
import logging
from aiogram import Bot, Dispatcher, F
from aiogram.types import Message
from aiogram.filters import Command
from expense_tracker_agent.agent import expense_runner
from expense_tracker_agent.utils import InputType, set_observ, extract_text_from_result, save_multimodal_artifact
import io


TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
bot = Bot(token=TOKEN)
dp = Dispatcher()
set_observ()

async def process_multimodal_request(message: Message)->str:
    """Downloads the file and sends it to the ADK Runner."""
    session_id = f"tg_{message.chat.id}"
    user_id = str(message.from_user.id)

    prompt = message.caption or message.text or "Extract expenses from this file in artifact: "

    file_id = None
    if message.photo:
        file_id = message.photo[-1].file_id
    elif message.document:
        file_id = message.document.file_id
    elif message.voice or message.audio:
        file_id = (message.voice or message.audio).file_id

    buffer = io.BytesIO()
    file_info = await bot.get_file(file_id)
    await bot.download_file(file_info.file_path, destination = buffer)
    buffer.seek(0)
    if message.photo:
        prompt += await save_multimodal_artifact(file_info.file_path, InputType.IMG, expense_runner, buffer, session_id=session_id, user_id = user_id)
    elif message.document:
        prompt+= await save_multimodal_artifact(file_info.file_path, InputType.PDF, expense_runner, buffer, session_id, user_id)
    elif message.voice or message.audio:
        prompt += await save_multimodal_artifact(file_info.file_path, InputType.AUDIO, expense_runner, buffer, session_id, user_id)

    try:
        result = await expense_runner.run_debug(
            session_id=session_id,
            user_id=user_id,
            user_messages=prompt
        )
        await message.answer(
            extract_text_from_result(result, "root_agent"),
            parse_mode = "MarkdownV2"
        )

    except Exception as e:
        logging.error(f"Error processing agent: {e}")
        await message.answer("I couldn't process that file. Please try again.")


# --- HANDLERS ---
@dp.message(Command("start"))
async def start_cmd(message: Message):
    await message.answer(
        "Hello! Send me a photo of a receipt, a PDF invoice, or a voice note of your spending."
    )


@dp.message(F.photo)
async def handle_photo(message: Message):
    await process_multimodal_request(message)


@dp.message(F.document.mime_type == "application/pdf")
async def handle_pdf(message: Message):
    await process_multimodal_request(message)


@dp.message(F.voice | F.audio)
async def handle_audio(message: Message):
    await process_multimodal_request(message)


@dp.message(F.text)
async def handle_text(message: Message):
    session_id = f"tg_{message.chat.id}"
    result = await expense_runner.run_debug(
        session_id=session_id,
        user_id=str(message.from_user.id),
        user_messages=message.text,
    )
    await message.answer(
        extract_text_from_result(result, "root_agent"),
        parse_mode = "MarkdownV2"
    )

async def main():
    logging.basicConfig(level=logging.INFO)
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
