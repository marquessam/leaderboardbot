import { Client, GatewayIntentBits, Events } from 'discord.js';

let client = null;

export default async function handler(req, res) {
    console.log('Connect handler called, client status:', client ? 'exists' : 'null');

    try {
        if (!client) {
            console.log('Creating new client');
            client = new Client({
                intents: [
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.GuildMessages,
                    GatewayIntentBits.MessageContent
                ]
            });

            // Set up event handlers
            client.on(Events.ClientReady, () => {
                console.log(`Bot is ready as ${client.user.tag}`);
            });

            client.on(Events.MessageCreate, async message => {
                console.log('Message received:', message.content);
                if (message.content === '!ping') {
                    await message.channel.send('Pong!');
                }
            });

            // Connect the client
            await client.login(process.env.DISCORD_TOKEN);
            console.log('Client logged in successfully');
        }

        res.status(200).json({
            status: 'ok',
            botStatus: client.isReady() ? 'ready' : 'not ready',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}
