import asyncio
import logging
import sys
from os import getenv

from aiogram import Bot, Dispatcher, types
from dotenv import load_dotenv
from agents.agent_typing import Payload, PayloadType

load_dotenv()

logging.basicConfig(level=logging.INFO, stream=sys.stdout)


class TelegramAgentBot:
    def __init__(self, token: str, agent_func):
        """
        token: Telegram bot token
        agent_func: async function(Payload) -> Payload
        """
        self.bot = Bot(token=token)
        self.dp = Dispatcher()
        self.agent_func = agent_func

        self.dp.message.register(self._handle_message)

    async def _handle_message(self, message: types.Message):
        input_message = Payload(type=PayloadType.TEXT, content=message.text or "")

        if message.photo:
            file_id = message.photo[-1].file_id
            input_message = Payload(
                type=PayloadType.IMAGE,
                content=file_id
            )

        # Call the injected agent
        resp: Payload = await self.agent_func(input_message)

        if resp.type == PayloadType.TEXT:
            await message.answer(resp.content)
        elif resp.type == PayloadType.IMAGE:
            caption = getattr(resp, "caption", "")
            await message.answer_photo(photo=resp.content, caption=caption)

    async def run(self):
        try:
            logging.info("Bot is polling...")
            await self.dp.start_polling(self.bot)
        finally:
            await self.bot.session.close()


# Example agent function
async def simple_agent(input_msg: Payload) -> Payload:
    return Payload(type=PayloadType.TEXT, content="Yup it works")


if __name__ == "__main__":
    TELEGRAM_BOT_TOKEN = getenv("TELEGRAM_BOT_TOKEN")
    bot_instance = TelegramAgentBot(token=TELEGRAM_BOT_TOKEN, agent_func=simple_agent)
    asyncio.run(bot_instance.run())
