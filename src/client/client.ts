import { Client } from 'discord.js';
import config from '../config';
import MessageHandler from '../events/message';
import logger from '../logger';

export default class DiscordConnection {
    private static client: Client;

    public static init() {
        this.client = new Client();
        this.client.login(config.token);

        this.client.on('ready', () => {
            logger.info(`Logged in as ${this.client.user.tag}!`);
        });

        this.client.on('message', message => {
            MessageHandler.handler.parse(message);
        });
    }

    public get client(): Client {
        return this.client;
    }
}
