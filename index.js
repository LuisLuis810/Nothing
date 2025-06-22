const { Client, GatewayIntentBits, PermissionsBitField, ActivityType } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', () => {
  console.log(`🦖 Dino is online as ${client.user.tag}`);

  client.user.setPresence({
    status: 'dnd',
    activities: [
      {
        name: 'the Jurassic vibes',
        type: ActivityType.Watching,
      },
    ],
  });
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const prefix = '!';
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Moderation Commands
  if (command === 'ban') {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply('❌ You do not have permission to ban members.');

    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Please mention a user to ban.');

    const member = message.guild.members.cache.get(user.id);
    if (!member) return message.reply('❌ That user is not in this server.');

    try {
      await member.ban({ reason: 'Banned by bot command' });
      message.channel.send(`✅ ${user.tag} has been banned.`);
    } catch {
      message.channel.send('❌ Unable to ban that user.');
    }
  }
  else if (command === 'kick') {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
      return message.reply('❌ You do not have permission to kick members.');

    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Please mention a user to kick.');

    const member = message.guild.members.cache.get(user.id);
    if (!member) return message.reply('❌ That user is not in this server.');

    try {
      await member.kick();
      message.channel.send(`✅ ${user.tag} has been kicked.`);
    } catch {
      message.channel.send('❌ Unable to kick that user.');
    }
  }
  else if (command === 'mute') {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
      return message.reply('❌ You do not have permission to mute members.');

    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Please mention a user to mute.');

    const member = message.guild.members.cache.get(user.id);
    if (!member) return message.reply('❌ That user is not in this server.');

    let mutedRole = message.guild.roles.cache.find(r => r.name === 'Muted');
    if (!mutedRole) {
      try {
        mutedRole = await message.guild.roles.create({
          name: 'Muted',
          permissions: []
        });
        message.guild.channels.cache.forEach(async (channel) => {
          await channel.permissionOverwrites.edit(mutedRole, {
            SendMessages: false,
            Speak: false,
            AddReactions: false,
          });
        });
      } catch (e) {
        return message.channel.send('❌ Failed to create Muted role.');
      }
    }

    try {
      await member.roles.add(mutedRole);
      message.channel.send(`✅ ${user.tag} has been muted.`);
    } catch {
      message.channel.send('❌ Unable to mute that user.');
    }
  }
  else if (command === 'unmute') {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
      return message.reply('❌ You do not have permission to unmute members.');

    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Please mention a user to unmute.');

    const member = message.guild.members.cache.get(user.id);
    if (!member) return message.reply('❌ That user is not in this server.');

    const mutedRole = message.guild.roles.cache.find(r => r.name === 'Muted');
    if (!mutedRole) return message.reply('❌ No Muted role found.');

    try {
      await member.roles.remove(mutedRole);
      message.channel.send(`✅ ${user.tag} has been unmuted.`);
    } catch {
      message.channel.send('❌ Unable to unmute that user.');
    }
  }

  // Member Commands
  else if (command === 'userinfo') {
    const user = message.mentions.users.first() || message.author;
    const member = message.guild.members.cache.get(user.id);

    const embed = {
      color: 0x0099ff,
      title: `${user.tag}'s Info`,
      thumbnail: { url: user.displayAvatarURL({ dynamic: true }) },
      fields: [
        { name: 'ID', value: user.id, inline: true },
        { name: 'Joined Server', value: member ? member.joinedAt.toDateString() : 'N/A', inline: true },
        { name: 'Account Created', value: user.createdAt.toDateString(), inline: true }
      ],
      timestamp: new Date(),
    };

    message.channel.send({ embeds: [embed] });
  }
  else if (command === 'serverinfo') {
    const guild = message.guild;

    const embed = {
      color: 0x00ff00,
      title: `${guild.name} Server Info`,
      thumbnail: { url: guild.iconURL({ dynamic: true }) },
      fields: [
        { name: 'Server ID', value: guild.id, inline: true },
        { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'Members', value: guild.memberCount.toString(), inline: true },
        { name: 'Created On', value: guild.createdAt.toDateString(), inline: true },
      ],
      timestamp: new Date(),
    };

    message.channel.send({ embeds: [embed] });
  }
  else if (command === 'avatar') {
    const user = message.mentions.users.first() || message.author;
    message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true, size: 512 })}`);
  }
  else if (command === 'ping') {
    message.reply('🏓 Pong!');
  }
});
