require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// When the bot is ready, log it to the console
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Basic message handler
client.on('messageCreate', async message => {
    if (message.content === '!ping') {
        message.reply('Pong!');
    }
});

// Login to Discord with your bot token
client.login(process.env.DISCORD_TOKEN);
