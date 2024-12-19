import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

export default async function handler(req, res) {
    console.log('API endpoint hit');
    
    try {
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

        return res.status(200).json({ 
            status: 'Bot running',
            botUser: client.user?.tag
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
