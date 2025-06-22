import { REST, Routes, SlashCommandBuilder } from discord.js;

const commands = [
    new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Replies with Pong!'),
    new SlashCommandBuilder()
      .setName('ban')
      .setDescription('Ban a member')
      .addUserOption(option => option.setName('target').setDescription('User to ban').setRequired(true))
      .addStringOption(option => option.setName('reason').setDescription('Reason for ban').setRequired(false)),
    new SlashCommandBuilder()
      .setName('warn')
      .setDescription('Warn a member')
      .addUserOption(option => option.setName('target').setDescription('User to warn').setRequired(true))
      .addStringOption(option => option.setName('reason').setDescription('Reason for warning').setRequired(false)),
  ].map(cmd => cmd.toJSON());

  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
  try {
    console.log('Started refreshing application (slash) commands.');
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log('Successfully reloaded application (slash) commands.');
  } catch (error) {
    console.error(error);
  }
});
