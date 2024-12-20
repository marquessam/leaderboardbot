import { Client, GatewayIntentBits, Events, ActivityType, PermissionsBitField } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

let isInitialized = false;

client.on('ready', () => {
    console.log(`Bot Ready! Logged in as ${client.user.tag}`);
    
    // Log permissions for each channel in each guild
    client.guilds.cache.forEach(guild => {
        console.log(`Guild: ${guild.name}`);
        guild.channels.cache.forEach(channel => {
            if (channel.isTextBased()) {
                const permissions = channel.permissionsFor(client.user);
                console.log(`Channel ${channel.name} permissions:`, {
                    viewChannel: permissions.has(PermissionsBitField.Flags.ViewChannel),
                    sendMessages: permissions.has(PermissionsBitField.Flags.SendMessages),
                    readMessageHistory: permissions.has(PermissionsBitField.Flags.ReadMessageHistory)
                });
            }
        });
    });

    client.user.setActivity('!ping', { type: ActivityType.Listening });
});

client.on('messageCreate', async (message) => {
    // Detailed message logging
    console.log('Message received:', {
        content: message.content,
        author: message.author.tag,
        channel: message.channel.name,
        guild: message.guild.name,
        botPermissions: message.channel.permissionsFor(client.user).toArray()
    });
    
    if (message.author.bot) return;
    
    if (message.content.toLowerCase() === '!ping') {
        try {
            // Check permissions before attempting to send
            const permissions = message.channel.permissionsFor(client.user);
            if (!permissions.has(PermissionsBitField.Flags.SendMessages)) {
                console.error('Missing permission to send messages in this channel');
                return;
            }

            const sent = await message.channel.send('Pong!');
            console.log('Successfully sent pong response');
        } catch (err) {
            console.error('Error sending pong:', err);
        }
    }
});

export default async function handler(req, res) {
    try {
        if (!isInitialized) {
            console.log('Initializing bot...');
            await client.login(process.env.DISCORD_TOKEN);
            isInitialized = true;
            console.log('Bot initialized successfully');
        }

        const status = {
            initialized: isInitialized,
            ready: client.isReady(),
            uptime: client.uptime,
            guildCount: client.guilds.cache.size,
            guilds: Array.from(client.guilds.cache.values()).map(g => ({
                name: g.name,
                channels: Array.from(g.channels.cache.values())
                    .filter(c => c.isTextBased())
                    .map(c => ({
                        name: c.name,
                        permissions: c.permissionsFor(client.user)?.toArray() || []
                    }))
            })),
            ping: client.ws.ping
        };

        console.log('Current bot status:', status);
        
        return res.status(200).json(status);
    } catch (error) {
        console.error('Handler error:', error);
        return res.status(500).json({
            error: error.message,
            isInitialized,
            ready: client?.isReady() || false
        });
    }
}
