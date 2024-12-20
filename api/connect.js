import { Client, GatewayIntentBits, Events } from 'discord.js';

let client = null;
let messageCount = 0;  // Track messages for debugging

export default async function handler(req, res) {
    console.log('Connect handler called:', new Date().toISOString());

    try {
        if (!client) {
            console.log('Initializing new Discord client');
            client = new Client({
                intents: [
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.GuildMessages,
                    GatewayIntentBits.MessageContent
                ]
            });

            // Debug event - log all events
            client.on('raw', event => {
                console.log('Raw Discord event received:', event.t);
            });

            client.on(Events.ClientReady, () => {
                console.log('Bot Ready Event triggered');
                console.log(`Logged in as: ${client.user.tag}`);
                console.log('Connected to servers:', client.guilds.cache.map(g => g.name));
            });

            client.on(Events.MessageCreate, async message => {
                messageCount++;
                console.log('Message Event:', {
                    count: messageCount,
                    content: message.content,
                    author: message.author.tag,
                    channel: message.channel.name,
                    isBot: message.author.bot
                });

                if (message.content === '!ping') {
                    console.log('Ping command received, attempting to respond');
                    try {
                        const reply = await message.channel.send('Pong!');
                        console.log('Successfully sent response:', reply.id);
                    } catch (sendError) {
                        console.error('Error sending response:', sendError);
                    }
                }
            });

            console.log('Attempting to log in...');
            await client.login(process.env.DISCORD_TOKEN);
            console.log('Login successful');
        }

        const statusInfo = {
            status: 'ok',
            botStatus: client.isReady() ? 'ready' : 'not ready',
            connectedServers: client.guilds.cache.size,
            messageCount: messageCount,
            timestamp: new Date().toISOString()
        };

        console.log('Current status:', statusInfo);
        res.status(200).json(statusInfo);

    } catch (error) {
        console.error('Handler error:', error);
        res.status(500).json({ 
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
    }
}
