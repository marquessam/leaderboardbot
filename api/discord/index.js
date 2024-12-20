import { Client, GatewayIntentBits } from 'discord.js';

// Create a single client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers
    ]
});

// Track connection state
let isConnected = false;

// Set up event handlers
client.on('ready', () => {
    console.log(`Bot is ready as ${client.user.tag}`);
    isConnected = true;
});

client.on('messageCreate', async (message) => {
    console.log('Message received:', {
        content: message.content,
        author: message.author.tag,
        channel: message.channel.name
    });

    if (message.content === '!ping') {
        try {
            await message.reply('Pong!');
            console.log('Replied to ping');
        } catch (error) {
            console.error('Error replying to message:', error);
        }
    }
});

export default async function handler(req, res) {
    console.log('API called, connection status:', isConnected);

    try {
        if (!isConnected) {
            console.log('Attempting to connect bot...');
            await client.login(process.env.DISCORD_TOKEN);
            console.log('Bot logged in successfully');
        }

        return res.status(200).json({
            status: 'Bot is running',
            connected: isConnected,
            ready: client.isReady(),
            user: client.user?.tag
        });
    } catch (error) {
        console.error('Handler error:', error);
        return res.status(500).json({
            error: error.message,
            connected: isConnected
        });
    }
}
