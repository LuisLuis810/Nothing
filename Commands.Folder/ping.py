from discord.ext import commands
import time

class Ping(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="ping")
    async def ping(self, ctx):
        before = time.monotonic()
        message = await ctx.send("Pinging...")
        after = time.monotonic()
        latency_ms = round((after - before) * 1000)
        await message.edit(content=f"Pong! Latency: {latency_ms}ms")

async def setup(bot):
    await bot.add_cog(Ping(bot))
