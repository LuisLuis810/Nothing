import discord
from discord import app_commands
from discord.ext import commands

bot = commands.Bot(command_prefix='!')  # Prefix = !
@bot.command()
async def say(ctx, *, message):
    await ctx.send(message)


class Say(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="say", description="Make the bot say something.")
    @app_commands.describe(message="What should the bot say?")
    @app_commands.describe(embedded="Send the message as an embed?")
    async def say(self, interaction: discord.Interaction, message: str, embedded: bool):
        if not embedded:
            # If embedded is False, send plain text immediately
            await interaction.response.send_message(message)
        else:
            # If embedded is True, show a modal (form) to get the final message
            modal = SayModal(self.bot, interaction)
            await interaction.response.send_modal(modal)

class SayModal(discord.ui.Modal, title="Enter your embedded message"):
    def __init__(self, bot, interaction):
        super().__init__()
        self.bot = bot
        self.interaction = interaction
        # A multi-line text input for the user to type the embed content
        self.message_input = discord.ui.TextInput(
            label="Message",
            style=discord.TextStyle.paragraph,  # multi-line text box
            placeholder="Type your message here...",
            required=True,
            max_length=2000
        )
        self.add_item(self.message_input)

    async def on_submit(self, interaction: discord.Interaction):
        embed = discord.Embed(description=self.message_input.value, color=discord.Color.blue())
        try:
            await interaction.response.send_message(embed=embed)
        except discord.Forbidden:
            await interaction.response.send_message(
                "I don't have permission to send embeds here.", ephemeral=True
            )

async def setup(bot):
    await bot.add_cog(Say(bot))
