import { Client } from 'discord.js';
import config from '../config';
import MessageHandler from '../events/message';
import logger from '../logger';

export default class DiscordConnection {
    private static _client: Client;

    public static init() {
        this._client = new Client();
        this._client.login(config.token);

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
