import os
import asyncio
import logging
import io
import aiohttp
from aiogram import Bot, Dispatcher, F, types
from aiogram.types import Message, BufferedInputFile
from aiogram.filters import Command
from aiogram.utils.chat_action import ChatActionSender
from expense_tracker_agent.agent_typing import AgentOutput
from expense_tracker_agent.root_agent import expense_runner
from expense_tracker_agent.utils import (
    InputType, 
    set_observ, 
    save_multimodal_artifact, 
    extract_agent_output,
    markdownify
)

async def fetch_signed_url_bytes(url: str) -> bytes:
    async with aiohttp.ClientSession(
        headers={"Host": "storage.googleapis.com"},
        skip_auto_headers={
            "User-Agent",
            "Accept",
            "Accept-Encoding",
        },
    ) as session:
        async with session.get(url) as resp:
            resp.raise_for_status()
            return await resp.read()


TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
bot = Bot(token=TOKEN)
dp = Dispatcher()
set_observ()


async def run_agent(session_id: str, user_id: str, prompt: str) -> AgentOutput:
    """Run the expense agent and extract output."""
    result = await expense_runner.run_debug(
        session_id=session_id,
        user_id=user_id,
        user_messages=prompt
    )
    return extract_agent_output(result, "root_agent")


async def send_agent_response(message: Message, output: AgentOutput) -> None:
    """Send agent output to Telegram, handling both text and image responses."""
    if output.type == "text":
        await message.answer(
            text=await markdownify(output.content),
            parse_mode="MarkdownV2"
        )
    elif output.type == "signed_url":
        file_bytes = await fetch_signed_url_bytes(output.url)
        file = BufferedInputFile(file_bytes, filename="receipt.jpg")
        await message.answer_photo(
            photo=file,
            caption=await markdownify(output.caption) or "",
            parse_mode="MarkdownV2"
        )


async def process_multimodal_request(message: Message):
    """Downloads the file and sends it to the ADK Runner."""
    session_id = f"tg_{message.chat.id}"
    user_id = str(message.from_user.id)

    async with ChatActionSender.typing(bot=bot, chat_id=message.chat.id):
        prompt = message.caption or message.text or "Extract expenses from this file: "

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
            return await message.answer("I couldn't find a file to process.")

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
            user_id=user_id
        )

        try:
            output = await run_agent(session_id, user_id, prompt)
            await send_agent_response(message, output)
        except Exception as e:
            logging.error(f"Error processing agent: {e}")
            await message.answer("I encountered an error processing your request.")

@dp.message(Command("start"))
async def start_cmd(message: Message):
    await message.answer(
        "Hello! Send me a photo of a receipt, a PDF invoice, or a voice note of your spending."
    )


@dp.callback_query(F.data == "run_agent")
async def handle_agent_run(callback: types.CallbackQuery):
    await callback.answer("Agent starting...")
    async with ChatActionSender.typing(bot=bot, chat_id=callback.message.chat.id):
        await asyncio.sleep(1) 
    await callback.message.answer("Agent task complete!")


@dp.message(F.photo | (F.document & (F.document.mime_type == "application/pdf")) | F.voice | F.audio)
async def handle_multimodal(message: Message):
    await process_multimodal_request(message)


@dp.message(F.text)
async def handle_text(message: Message):
    session_id = f"tg_{message.chat.id}"
    user_id = str(message.from_user.id)

    async with ChatActionSender.typing(bot=bot, chat_id=message.chat.id):
        try:
            output = await run_agent(session_id, user_id, message.text)
            await send_agent_response(message, output)
        except Exception as e:
            logging.error(f"Error processing agent: {e}")
            await message.answer("I encountered an error processing your request.")

async def main():
    logging.basicConfig(level=logging.INFO)
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logging.info("Bot stopped.")