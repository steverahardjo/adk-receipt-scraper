import asyncio
import logging
import sys
import os
from pathlib import Path
from dotenv import load_dotenv

from aiogram import Bot, Dispatcher, types
from google import genai
from google.genai import types as genai_types

# Assuming these are defined in your local project
from agents.agent_typing import Payload, PayloadType

load_dotenv()
logging.basicConfig(level=logging.INFO, stream=sys.stdout)

# Initialize the Gemini Client
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

class TelegramAgentBot:
    def __init__(self, token: str, agent_func):
        self.bot = Bot(token=token)
        self.dp = Dispatcher()
        self.agent_func = agent_func
        # This should be the model ID string used in the client calls
        self.model_id = "gemini-2.0-flash" 

        self.dp.message.register(self._handle_message)

    async def _handle_message(self, message: types.Message):
        payload = None

        # -------- TEXT --------
        if message.text:
            payload = Payload(
                type=PayloadType.TEXT,
                content=message.text
            )

        # -------- VOICE / AUDIO --------
        elif message.voice or message.audio:
            file_id = message.voice.file_id if message.voice else message.audio.file_id
            
            # Show "typing..." or "recording..." status in Telegram while processing
            await message.bot.send_chat_action(chat_id=message.chat.id, action="typing")
            
            transcript = await self.transcribe_audio(file_id)
            
            if transcript:
                payload = Payload(
                    type=PayloadType.TEXT,
                    content=transcript
                )
            else:
                await message.answer("Could not process audio.")
                return

        if not payload:
            await message.answer("Unsupported message type.")
            return

        # -------- AGENT --------
        resp: Payload = await self.agent_func(payload)

        if resp.type == PayloadType.TEXT:
            await message.answer(resp.content)
        elif resp.type == PayloadType.IMAGE:
            # Assuming resp.content is a URL or InputFile for Telegram
            await message.answer_photo(resp.content, caption=getattr(resp, "caption", ""))

    async def transcribe_audio(self, file_id: str) -> str:
        # Download Telegram voice file
        file = await self.bot.get_file(file_id)
        download_dir = Path("temp")
        download_dir.mkdir(exist_ok=True)
        local_file = download_dir / f"{file_id}.ogg"
        await self.bot.download_file(file.file_path, destination=local_file)

        # GenAI client
        client = genai.Client()
        uploaded_file = client.files.upload(file=str(local_file))

        prompt = "Transcribe the audio to plain text in English."
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[
                    genai_types.Content(
                        parts=[
                            genai_types.Part(file_data=uploaded_file),
                            genai_types.Part(text=prompt),
                        ]
                    )
                ],
            )
        finally:
            # Clean up the downloaded file
            if local_file.exists():
                local_file.unlink()

        # Return the transcription as plain text
        return response.text

    async def run(self):
        logging.info("Bot polling started")
        await self.dp.start_polling(self.bot)

# -------------------------
# Example agent
# -------------------------
async def simple_agent(input_msg: Payload) -> Payload:
    return Payload(
        type=PayloadType.TEXT,
        content=f"Agent response to: {input_msg.content}"
    )

if __name__ == "__main__":
    bot = TelegramAgentBot(
        token=os.getenv("TELEGRAM_BOT_TOKEN"),
        agent_func=simple_agent,
    )
    asyncio.run(bot.run())