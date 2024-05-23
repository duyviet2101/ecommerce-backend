const { Client, GatewayIntentBits, messageLink } = require('discord.js');
const {
    TOKEN_BOT_DISCORD,
    ID_CHANNEL_lOG_DISCORD
} = process.env;

class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        //add channel id
        this.channelId = ID_CHANNEL_lOG_DISCORD;

        this.client.on('ready', () => {
            console.log(`Logged as ${this.client.user.tag}!`);
        })

        this.client.login(TOKEN_BOT_DISCORD);
    }

    sendToMessage(message = 'message') {
        const channel = this.client.channels.cache.get(this.channelId);
        if (!channel) {
            console.error(`Counldn't find the channel `, this.channelId);
            return;
        }

        channel.send(message).catch(e => console.error(e));
        return;
    }

    sendToFormatCode(logData) {
        const {
            code,
            message = 'This is some additional information about the code.',
            title = 'Code Example'
        } = logData;

        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt('00ff00', 16),
                    title,
                    description: '```json\n' + JSON.stringify(code, null, 2) + '\n```',
                },
            ]
        }

        this.sendToMessage(codeMessage);
    }
}

module.exports = new LoggerService();