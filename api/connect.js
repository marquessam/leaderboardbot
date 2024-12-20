import { Client, GatewayIntentBits, Events } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Store the client connection globally
let globalClient = null;

export default async function handler(req, res) {
    console.log('Connect handler called');

    try {
        if (!globalClient) {
            // Set up event handlers
            client.on(Events.MessageCreate, async message => {
                if (message.content === '!ping') {
                    await message.channel.send('Pong!');
                }
            });

            // Connect the client
            await client.login(process.env.DISCORD_TOKEN);
            globalClient = client;
        }

        res.status(200).json({
            status: 'connected',
            ready: globalClient.isReady(),
            guilds: globalClient.guilds.cache.size
        });
    } catch (error) {
        console.error('Connection error:', error);
        res.status(500).json({ error: error.message });
    }
}
