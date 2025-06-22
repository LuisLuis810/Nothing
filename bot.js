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
