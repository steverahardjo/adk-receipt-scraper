import os
import io
import asyncio
import logging

from aiogram import Bot, Dispatcher, F, types
from aiogram.types import Message
from aiogram.filters import Command
from aiogram.utils.chat_action import ChatActionSender

from expense_tracker_agent.root_agent import expense_runner
from expense_tracker_agent.utils import (
    InputType,
    set_observ,
    extract_agent_output,
    save_multimodal_artifact,
    markdownify,   # <-- async
)

# ---------------------------------------------------------------------
# BOOTSTRAP
# ---------------------------------------------------------------------

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
bot = Bot(token=TOKEN)
dp = Dispatcher()

logging.basicConfig(level=logging.INFO)
set_observ()

# ---------------------------------------------------------------------
# HELPERS
# ---------------------------------------------------------------------

async def send_agent_output(message: Message, output):
    if not output or not output.content:
        await message.answer("No output.")
        return

    # 1. Flatten content into a string
    if isinstance(output.content, list):
        text = "\n".join(
            part.content
            for part in output.content
            if hasattr(part, "content") and part.content
        )
    else:
        text = str(output.content)

    # 2. Telegram-safe markdown (async!)
    text = await markdownify(text)

    # 3. Send
    if output.url:
        await message.answer(text, parse_mode="MarkdownV2")
        await message.answer(output.url)
    else:
        await message.answer(text, parse_mode="MarkdownV2")

async def process_multimodal_request(message: Message):
    session_id = f"tg_{message.chat.id}"
    user_id = str(message.from_user.id)

    async with ChatActionSender.typing(bot=bot, chat_id=message.chat.id):
        prompt = message.caption or message.text or "Extract expenses from this file."

        file_id = None
        input_type = None

        if message.photo:
            file_id = message.photo[-1].file_id
            input_type = InputType.IMG
        elif message.document:
            file_id = message.document.file_id
            input_type = InputType.PDF
        elif message.voice or message.audio:
            file_id = (message.voice or message.audio).file_id
            input_type = InputType.AUDIO

        if not file_id:
            await message.answer("No file found.")
            return

        buffer = io.BytesIO()
        file_info = await bot.get_file(file_id)
        await bot.download_file(file_info.file_path, destination=buffer)
        buffer.seek(0)

        prompt += await save_multimodal_artifact(
            file_info.file_path,
            input_type,
            expense_runner,
            buffer,
            session_id=session_id,
            user_id=user_id,
        )

        result = await expense_runner.run_debug(
            session_id=session_id,
            user_id=user_id,
            user_messages=prompt,
        )

        output = extract_agent_output(result, "root_agent")
        await send_agent_output(message, output)

# ---------------------------------------------------------------------
# HANDLERS
# ---------------------------------------------------------------------

@dp.message(Command("start"))
async def start_cmd(message: Message):
    await message.answer(
        "Send a receipt photo, PDF invoice, or voice note."
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

    async with ChatActionSender.typing(bot=bot, chat_id=message.chat.id):
        result = await expense_runner.run_debug(
            session_id=session_id,
            user_id=str(message.from_user.id),
            user_messages=message.text,
        )

        output = extract_agent_output(result, "root_agent")
        await send_agent_output(message, output)

# ---------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
