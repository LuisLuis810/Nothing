require("dotenv").config();
const { Client, GatewayIntentBits, Partials } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel],
});

client.once("ready", () => {
  console.log(`${client.user.tag} is online!`);

  client.user.setPresence({
    activities: [
      {
        name: "Dinosaur Adventures 🦖",
        type: 2, // 0 = Playing, 1 = Streaming, 2 = Listening, 3 = Watching, 5 = Competing
      },
    ],
    status: "dnd", // can be: online | idle | dnd | invisible
  });
});


client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift()?.toLowerCase();

  if (!message.content.startsWith("!")) return;

  // !ping
  if (command === "ping") {
    message.reply("Pong! 🏓");
  }

  // !kick @user reason
  if (command === "kick") {
    if (!message.member.permissions.has("KickMembers"))
      return message.reply("You need Kick permissions.");

    const user = message.mentions.members.first();
    const reason = args.slice(1).join(" ") || "No reason";

    if (!user) return message.reply("Mention a user to kick.");
    if (!user.kickable) return message.reply("Can't kick this user.");

    await user.kick(reason);
    message.channel.send(`🔨 Kicked ${user.user.tag} for: ${reason}`);
    user.send(`You were kicked from **${message.guild.name}**. Reason: ${reason}`);
  }

  // !ban @user reason
  if (command === "ban") {
    if (!message.member.permissions.has("BanMembers"))
      return message.reply("You need Ban permissions.");

    const user = message.mentions.members.first();
    const reason = args.slice(1).join(" ") || "No reason";

    if (!user) return message.reply("Mention a user to ban.");
    if (!user.bannable) return message.reply("Can't ban this user.");

    await user.ban({ reason });
    message.channel.send(`🚫 Banned ${user.user.tag} for: ${reason}`);
    user.send(`You were banned from **${message.guild.name}**. Reason: ${reason}`);
  }

  // !warn @user reason
  if (command === "warn") {
    const user = message.mentions.members.first();
    const reason = args.slice(1).join(" ") || "No reason";

    if (!user) return message.reply("Mention a user to warn.");
    message.channel.send(`⚠️ Warned ${user.user.tag} for: ${reason}`);
    user.send(`You have been warned in **${message.guild.name}**. Reason: ${reason}`);
  }
});

client.login(process.env.BOT_TOKEN);
