const { Client, GatewayIntentBits, WebhookClient } = require('discord.js');
let client = null;

export default async function handler(req, res) {
    try {
        // Initialize bot if not already running
        if (!client) {
            client = new Client({ 
                intents: [
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.GuildMessages,
                    GatewayIntentBits.MessageContent
                ]
            });

            await client.login(process.env.DISCORD_TOKEN);
            
            client.on('ready', () => {
                console.log(`Logged in as ${client.user.tag}`);
            });

            client.on('messageCreate', async message => {
                if (message.content === '!leaderboard') {
                    message.channel.send('Leaderboard coming soon!');
                }
            });
        }

        // Handle webhook verification
        if (req.method === 'POST') {
            const { type = 0 } = req.body;
            
            if (type === 1) {
                return res.status(200).json({ type: 1 });
            }
        }

        return res.status(200).json({ status: 'Bot is running' });
    } catch (error) {
        console.error('Bot error:', error);
        return res.status(500).json({ error: error.message });
    }
}
