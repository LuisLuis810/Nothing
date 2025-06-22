const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}! Setting status to DND...`);
  client.user.setStatus('dnd');
});

client.login(process.env.BOT_TOKEN);


const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}! Setting status to DND and activity to Playing Luis fixing the bot.`);

  client.user.setStatus('dnd');
  client.user.setActivity('Luis fixing the bot', { type: 'PLAYING' });
});

client.login(process.env.BOT_TOKEN);

const { 
  Client, 
  GatewayIntentBits, 
  Partials,
  Events,
  PermissionsBitField,
  REST,
  Routes,
  SlashCommandBuilder,
} = require('discord.js');
require('dotenv').config();

const PREFIX = '!';
const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], 
  partials: [Partials.Channel]
});

const warnings = new Map(); // userId -> [{ moderator, reason, date }]

// Register slash commands on ready
client.once(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}`);

  client.user.setStatus('dnd');
  client.user.setActivity('Luis fixing the bot', { type: 'PLAYING' });

// Handle prefix commands
client.on(Events.MessageCreate, async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    message.channel.send('Pong!');
  } 
  else if (command === 'help') {
    message.channel.send(`Commands:
- !ping
- !help
- !say <message>
- !ban <@user> [reason]
- !warn <@user> [reason]

Slash commands: /ping, /ban, /warn`);
  }
  else if (command === 'say') {
    if (!args.length) return message.channel.send('Please provide a message to say.');
    message.channel.send(args.join(' '));
  }
  else if (command === 'ban') {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply("You don't have permission to ban members.");
    }
    const target = message.mentions.members.first();
    if (!target) return message.reply('Please mention a user to ban.');
    if (!target.bannable) return message.reply("I can't ban that user.");
    const reason = args.slice(1).join(' ') || 'No reason provided';

    try {
      await target.ban({ reason });
      message.channel.send(`${target.user.tag} has been banned. Reason: ${reason}`);
    } catch (err) {
      message.reply('Failed to ban user.');
      console.error(err);
    }
  }
  else if (command === 'warn') {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply("You don't have permission to warn members.");
    }
    const target = message.mentions.users.first();
    if (!target) return message.reply('Please mention a user to warn.');
    const reason = args.slice(1).join(' ') || 'No reason provided';

    let userWarns = warnings.get(target.id) || [];
    userWarns.push({ moderator: message.author.tag, reason, date: new Date() });
    warnings.set(target.id, userWarns);

    message.channel.send(`${target.tag} has been warned. Reason: ${reason}`);
  }
});

// Handle slash commands
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('Pong!');
  } 
  else if (commandName === 'ban') {
    if (!interaction.memberPermissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply({ content: "You don't have permission to ban members.", ephemeral: true });
    }

    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const member = interaction.guild.members.cache.get(target.id);
    if (!member) return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
    if (!member.bannable) return interaction.reply({ content: "I can't ban that user.", ephemeral: true });

    try {
      await member.ban({ reason });
      await interaction.reply(`${target.tag} has been banned. Reason: ${reason}`);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'Failed to ban user.', ephemeral: true });
    }
  }
  else if (commandName === 'warn') {
    if (!interaction.memberPermissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply({ content: "You don't have permission to warn members.", ephemeral: true });
    }

    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    let userWarns = warnings.get(target.id) || [];
    userWarns.push({ moderator: interaction.user.tag, reason, date: new Date() });
    warnings.set(target.id, userWarns);

    await interaction.reply(`${target.tag} has been warned. Reason: ${reason}`);
  }
});

client.login(process.env.BOT_TOKEN);

