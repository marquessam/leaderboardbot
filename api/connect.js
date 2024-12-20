import { Client, GatewayIntentBits, WebhookClient } from 'discord.js';

// Store channel ID for responses
const CHANNEL_ID = '1300941091335438470'; // Add your channel ID here

export default async function handler(req, res) {
    try {
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        // Log in and send a test message
        await client.login(process.env.DISCORD_TOKEN);
        
        if (req.query.cmd === 'ping') {
            const channel = await client.channels.fetch(CHANNEL_ID);
            if (channel?.isTextBased()) {
                await channel.send('Pong!');
            }
        }

        // Clean up
        client.destroy();

        res.status(200).json({ 
            status: 'Command executed',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
}
