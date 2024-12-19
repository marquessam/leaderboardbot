import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        if (!client.isReady()) {
            await client.login(process.env.DISCORD_TOKEN);
        }
        
        return res.status(200).json({ status: 'Bot is running' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
