import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

let isInitialized = false;

export default async function handler(req, res) {
    console.log('Handler called, bot status:', isInitialized ? 'initialized' : 'not initialized');

    try {
        if (!isInitialized) {
            // Set up event handlers before login
            client.on('ready', () => {
                console.log(`Bot is ready as ${client.user.tag}`);
            });

            client.on('messageCreate', async (message) => {
                console.log('Message received:', message.content);
                if (message.content === '!ping') {
                    try {
                        await message.reply('Pong!');
                        console.log('Replied to ping');
                    } catch (error) {
                        console.error('Error replying to message:', error);
                    }
                }
            });

            // Login
            await client.login(process.env.DISCORD_TOKEN);
            console.log('Bot logged in successfully');
            isInitialized = true;
        }

        return res.status(200).json({ 
            status: 'Bot is running',
            ready: client.isReady(),
            initialized: isInitialized
        });
    } catch (error) {
        console.error('Handler error:', error);
        return res.status(500).json({ 
            error: error.message,
            isInitialized,
            botReady: client?.isReady()
        });
    }
}
