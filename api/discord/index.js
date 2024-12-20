import { Client, GatewayIntentBits, Events } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers
    ]
});

let isConnected = false;

// More detailed event handling
client.on(Events.ClientReady, () => {
    console.log(`Successfully logged in as ${client.user.tag}`);
    isConnected = true;
});

client.on(Events.MessageCreate, async (message) => {
    console.log(`Message received in ${message.channel.name}: ${message.content}`);
    
    if (message.content === '!ping') {
        try {
            const reply = await message.reply('Pong!');
            console.log(`Replied to ping with message ID: ${reply.id}`);
        } catch (error) {
            console.error('Failed to reply:', error);
        }
    }
});

client.on(Events.Error, error => {
    console.error('Discord client error:', error);
    isConnected = false;
});

export default async function handler(req, res) {
    console.log('Handler called, current status:', {
        connected: isConnected,
        ready: client.isReady(),
        user: client.user?.tag
    });

    try {
        if (!isConnected) {
            console.log('Attempting to connect...');
            await client.login(process.env.DISCORD_TOKEN);
            
            // Wait briefly to ensure connection is established
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('Login attempt completed, new status:', {
                connected: isConnected,
                ready: client.isReady()
            });
        }

        return res.status(200).json({
            status: 'Bot is running',
            connected: isConnected,
            ready: client.isReady(),
            user: client.user?.tag,
            guilds: client.guilds.cache.size
        });
    } catch (error) {
        console.error('Handler error:', error);
        return res.status(500).json({
            error: error.message,
            type: error.constructor.name,
            connected: isConnected,
            ready: client?.isReady?.() || false
        });
    }
}
