import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

export default async function handler(request, response) {
    try {
        // Initialize bot if not already running
        if (!client.isReady()) {
            await client.login(process.env.DISCORD_TOKEN);
            
            client.once('ready', () => {
                console.log(`Logged in as ${client.user.tag}`);
            });

            client.on('messageCreate', async message => {
                if (message.content === '!ping') {
                    await message.reply('Pong!');
                }
            });
        }

        // Return successful response
        response.status(200).json({ 
            status: 'Bot initialized',
            isReady: client.isReady()
        });
    } catch (error) {
        console.error('Error:', error);
        response.status(500).json({ error: error.message });
    }
}
