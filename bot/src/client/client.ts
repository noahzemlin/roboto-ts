import { Client } from 'discord.js';
import config from '../config';
import MessageHandler from '../events/message';
import logger from '../logger';

export default class DiscordConnection {
    private static _client: Client;

    public static init() {
        if (config.discordtoken === '') {
            logger.error('DISCORD_BOT_TOKEN not set! Bot will not be started.');
            return;
        }

        this._client = new Client();
        this._client.login(config.discordtoken);

        this._client.on('ready', () => {
            logger.info(`Logged in as ${this._client.user.tag}!`);
        });

        this._client.on('message', message => {
            MessageHandler.handler.parse(message);
        });
    }

    public static get client(): Client {
        return this._client;
    }
}
