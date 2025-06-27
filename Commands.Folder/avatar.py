from discord.ext import commands

class Avatar(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="avatar")
    async def avatar(self, ctx, member=None):
        member = member or ctx.author
        avatar_url = member.avatar.url if member.avatar else member.default_avatar.url
        await ctx.send(f"{member.display_name}'s avatar: {avatar_url}")

async def setup(bot):
    await bot.add_cog(Avatar(bot))
