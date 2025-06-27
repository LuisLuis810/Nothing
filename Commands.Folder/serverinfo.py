from discord.ext import commands

class ServerInfo(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="serverinfo")
    async def serverinfo(self, ctx):
        guild = ctx.guild
        embed = discord.Embed(title=guild.name, description=f"ID: {guild.id}", color=discord.Color.green())
        embed.add_field(name="Owner", value=guild.owner.mention)
        embed.add_field(name="Members", value=guild.member_count)
        embed.set_thumbnail(url=guild.icon.url if guild.icon else discord.Embed.Empty)
        await ctx.send(embed=embed)

async def setup(bot):
    await bot.add_cog(ServerInfo(bot))
