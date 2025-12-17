import asyncio
import logging
import sys
from os import getenv

from aiogram import Bot, Dispatcher, types, F
from dotenv import load_dotenv
from agents.types import Payload, PayloadType

load_dotenv()

logging.basicConfig(level=logging.INFO, stream=sys.stdout)

TELEGRAM_BOT_TOKEN = getenv("TELEGRAM_BOT_TOKEN")
bot = Bot(token=TELEGRAM_BOT_TOKEN)
dp = Dispatcher()

async def get_agent_response(input_msg: Payload) -> Payload:

    return Payload(
        content="Yup it works",
        type=PayloadType.TEXT
    )

@dp.message()
async def agent_handler(message: types.Message):
    input_message = Payload(type=PayloadType.TEXT, content=message.text or "")

    if message.photo:
        file_id = message.photo[-1].file_id
        input_message = Payload(
            type=PayloadType.IMAGE,
            content=file_id
        )

    resp: Payload = await get_agent_response(input_message)
    if resp.type == PayloadType.TEXT:
        await message.answer(resp.content)
    elif resp.type == PayloadType.IMAGE:
        caption = getattr(resp, 'caption', "")
        await message.answer_photo(photo=resp.content, caption=caption)

async def main():
    try:
        print("Bot is polling...")
        await dp.start_polling(bot)
    finally:
        await bot.session.close()

if __name__ == "__main__":
    asyncio.run(main())