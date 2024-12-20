import { Client, GatewayIntentBits, Events, ActivityType } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Global variable to track connection state
let isInitialized = false;

client.on('ready', () => {
    console.log(`Bot Ready! Logged in as ${client.user.tag}`);
    client.user.setActivity('!ping', { type: ActivityType.Listening });
});

client.on('messageCreate', async (message) => {
    // Log every message received
    console.log(`Message received from ${message.author.tag}: ${message.content}`);
    
    // Ignore messages from bots
    if (message.author.bot) return;
    
    // Simple ping command
    if (message.content.toLowerCase() === '!ping') {
        try {
            const sent = await message.channel.send('Pong!');
            console.log(`Sent pong response: ${sent.id}`);
        } catch (err) {
            console.error('Error sending pong:', err);
        }
    }
});

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
    isInitialized = false;
});

export default async function handler(req, res) {
    try {
        if (!isInitialized) {
            console.log('Initializing bot...');
            await client.login(process.env.DISCORD_TOKEN);
            isInitialized = true;
            console.log('Bot initialized successfully');
        }

        // Return detailed status
        const status = {
            initialized: isInitialized,
            ready: client.isReady(),
            uptime: client.uptime,
            guildCount: client.guilds.cache.size,
            guilds: Array.from(client.guilds.cache.values()).map(g => ({
                name: g.name,
                memberCount: g.memberCount
            })),
            ping: client.ws.ping
        };

        console.log('Current bot status:', status);
        
        return res.status(200).json(status);
    } catch (error) {
        console.error('Handler error:', error);
        return res.status(500).json({
            error: error.message,
            isInitialized,
            ready: client?.isReady() || false
        });
    }
}
