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

// Debug logging for all events
client.on('raw', async event => {
    console.log('Raw event received:', event.t);
});

client.on(Events.ClientReady, () => {
    console.log(`Bot Ready Event: Logged in as ${client.user.tag}`);
    console.log('Guilds:', client.guilds.cache.map(g => g.name));
    isConnected = true;
});

client.on('messageCreate', async message => {
    console.log('Message received:', {
        content: message.content,
        author: message.author.tag,
        channel: message.channel.name,
        guild: message.guild?.name
    });

    // Don't respond to bot messages
    if (message.author.bot) return;

    if (message.content === '!ping') {
        try {
            console.log('Attempting to send pong response');
            await message.reply('Pong!');
            console.log('Pong response sent successfully');
        } catch (error) {
            console.error('Error sending pong:', error);
        }
    }
});

client.on('error', error => {
    console.error('Discord client error:', error);
    isConnected = false;
});

export default async function handler(req, res) {
    console.log('API handler called');
    
    try {
        if (!isConnected) {
            console.log('Bot not connected, attempting to connect...');
            
            // Reinitialize event handlers
            client.removeAllListeners();
            
            await client.login(process.env.DISCORD_TOKEN);
            console.log('Login successful');
            
            // Wait for ready event
            await new Promise((resolve) => {
                client.once('ready', () => {
                    console.log('Ready event received');
                    isConnected = true;
                    resolve();
                });
            });
        }

        const debugInfo = {
            status: 'Bot is running',
            connected: isConnected,
            ready: client.isReady(),
            user: client.user?.tag,
            guilds: client.guilds.cache.size,
            guildNames: Array.from(client.guilds.cache.values()).map(g => g.name),
            eventNames: client.eventNames()
        };

        console.log('Debug info:', debugInfo);
        return res.status(200).json(debugInfo);

    } catch (error) {
        console.error('Handler error:', error);
        return res.status(500).json({
            error: error.message,
            stack: error.stack,
            connected: isConnected,
            ready: client?.isReady?.() || false
        });
    }
}
