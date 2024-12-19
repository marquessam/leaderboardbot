const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

export default async function handler(req, res) {
    try {
        // Initialize bot if not already running
        if (!client.isReady()) {
            await client.login(process.env.DISCORD_TOKEN);
            
            client.on('ready', () => {
                console.log(`Logged in as ${client.user.tag}`);
            });

            client.on('messageCreate', async message => {
                if (message.content === '!leaderboard') {
                    // We'll add the leaderboard code here
                    message.channel.send('Leaderboard coming soon!');
                }
            });
        }

        return res.status(200).json({ status: 'Bot is running' });
    } catch (error) {
        console.error('Bot error:', error);
        return res.status(500).json({ error: error.message });
    }
}
