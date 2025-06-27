import os
from dotenv import load_dotenv
from discord.ext import commands

load_dotenv()  # Loads variables from .env into environment variables

TOKEN = os.getenv("BOT_TOKEN")

bot = commands.Bot(command_prefix=["?", "!", "/"])

@bot.event
async def on_ready():
    print(f"Logged in as {bot.user}!")

bot.run(TOKEN)
