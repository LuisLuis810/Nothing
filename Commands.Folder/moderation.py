from discord.ext import commands
import discord

STAFF_ROLES = {
    "Staff Team",
    "Trainer Moderator",
    "Moderator",
    "Head Moderator",
    "Admin",
    "Owner"
}

def is_staff_or_perms(*perms):
    async def predicate(ctx):
        if any(getattr(ctx.author.guild_permissions, perm, False) for perm in perms):
            return True
        author_roles = {role.name for role in ctx.author.roles}
        if STAFF_ROLES.intersection(author_roles):
            return True
        return False
    return commands.check(predicate)

class Moderation(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    async def notify_member(self, member: discord.Member, action: str, guild: discord.Guild, reason: str = None, duration: str = None):
        try:
            msg = f"You have been **{action}** from **{guild.name}**."
            if reason:
                msg += f"\\n**Reason:** {reason}"
            if duration:
                msg += f"\\n**Duration:** {duration}"
            await member.send(msg)
        except Exception:
            pass

    @commands.command(name="kick")
    @is_staff_or_perms("kick_members")
    async def kick(self, ctx, member: discord.Member, *, reason=None):
        await self.notify_member(member, "kicked", ctx.guild, reason)
        try:
            await member.kick(reason=reason)
            await ctx.send(f"✅ {member} was kicked. Reason: {reason}")
        except Exception as e:
            await ctx.send(f"❌ Failed to kick: {e}")

    @commands.command(name="ban")
    @is_staff_or_perms("ban_members")
    async def ban(self, ctx, member: discord.Member, duration: str = None, *, reason=None):
        await self.notify_member(member, "banned", ctx.guild, reason, duration)
        try:
            await member.ban(reason=reason)
            await ctx.send(f"✅ {member} was banned. Reason: {reason}")
        except Exception as e:
            await ctx.send(f"❌ Failed to ban: {e}")

    @commands.command(name="unban")
    @is_staff_or_perms("ban_members")
    async def unban(self, ctx, *, member_name):
        banned_users = await ctx.guild.bans()
        member_name = member_name.lower()
        for ban_entry in banned_users:
            user = ban_entry.user
            if user.name.lower() == member_name or f"{user.name}#{user.discriminator}".lower() == member_name:
                await ctx.guild.unban(user)
                await ctx.send(f"✅ Unbanned {user.name}#{user.discriminator}")
                return
        await ctx.send(f"❌ User `{member_name}` not found in ban list.")

    @commands.command(name="warn")
    @is_staff_or_perms("moderate_members")
    async def warn(self, ctx, member: discord.Member, *, reason=None):
        await self.notify_member(member, "warned (timed out)", ctx.guild, reason)
        try:
            await member.timeout(duration=None, reason=reason)
            await ctx.send(f"⚠️ {member} has been timed out (warned). Reason: {reason}")
        except Exception as e:
            await ctx.send(f"❌ Failed to warn: {e}")

async def setup(bot):
    await bot.add_cog(Moderation(bot))
