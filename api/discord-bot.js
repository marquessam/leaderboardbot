import { Client, GatewayIntentBits } from 'discord.js';

// Initialize client outside the handler
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

let isInitialized = false;

export default async function handler(req, res) {
    console.log('Handler called, initialization status:', isInitialized);

    try {
        if (!isInitialized) {
            console.log('Initializing bot...');
            
            // Setup bot event handlers
            client.on('ready', () => {
                console.log(`Logged in as ${client.user.tag}`);
            });

            client.on('messageCreate', async message => {
                console.log('Message received:', message.content);
                if (message.content === '!leaderboard') {
                    await message.channel.send('Leaderboard coming soon!');
                }
            });

            // Login
            await client.login(process.env.DISCORD_TOKEN);
            isInitialized = true;
            console.log('Bot initialized successfully');
        }

        // Handle Discord webhook verification
        if (req.body?.type === 1) {
            return res.status(200).json({ type: 1 });
        }

        return res.status(200).json({
            status: 'Bot is running',
            initialized: isInitialized,
            clientReady: client.isReady()
        });
    } catch (error) {
        console.error('Bot error:', error);
        return res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
}
