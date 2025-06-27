from discord.ext import commands
import discord

class Poll(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="poll")
    async def poll(self, ctx, *, question):
        embed = discord.Embed(title="New Poll", description=question, color=discord.Color.blue())
        message = await ctx.send(embed=embed)
        await message.add_reaction("👍")
        await message.add_reaction("👎")

async def setup(bot):
    await bot.add_cog(Poll(bot))
