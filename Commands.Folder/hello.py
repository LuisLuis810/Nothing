from discord.ext import commands

class Hello(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="hello")
    async def hello(self, ctx):
        await ctx.send(f"Hello, {ctx.author.mention}!")

async def setup(bot):
    await bot.add_cog(Hello(bot))
