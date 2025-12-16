import asyncio
from os import getenv

from aiogram import Bot, Dispatcher, types
from dotenv import load_dotenv
from agents.types import Payload, PayloadType


load_dotenv()

TELEGRAM_BOT_TOKEN = getenv("TELEGRAM_BOT_TOKEN")
bot = Bot(token=TELEGRAM_BOT_TOKEN)
dp = Dispatcher()

async def get_agent_response()->Payload:
    return Payload(
        content = "Yup it works",
        type = PayloadType.TEXT
    )
@dp.message()
async def welcome(message: types.Message):
    await message.reply("Hi! I'm an expense tracker powered by Google Agent Kit")


@dp.message()
async def agent_handler(message: types.Message):
    user_text = message.text if message.text else ""
    user_image = None

    if message.photo:
        user_image = message.photo[-1].file_id  # highest resolution photo

    resp: Payload = get_agent_response(user_text=user_text, user_image=user_image)

    if resp.type == PayloadType.TEXT:
        await message.answer(resp.content)
    elif resp.type == PayloadType.IMAGE:
        await message.answer_photo(photo=resp.content, caption=resp.caption or "")


if __name__ == "__main__":
    from aiogram import F
    from aiogram.types import ContentType
    asyncio.run(dp.start_polling(bot))