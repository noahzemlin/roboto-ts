import { Message } from 'discord.js';
import config from '../config';
import logger from '../logger';
import BaseCommand from './base-command';
import HealthyCommand from './healthy';
import NextCommand from './next';
import PlayCommand from './play';
import VolumeCommand from './volume';

export default class Commands {
    private static _instance: Commands = new Commands();
    private commands: BaseCommand[] = [];

    constructor() {
        switch (config.commandlist) {
            case 'text': {
                this.commands.push(new HealthyCommand());
                break;
            }
            case 'voice': {
                this.commands.push(new PlayCommand());
                this.commands.push(new NextCommand());
                this.commands.push(new VolumeCommand());
                break;
            }
            default: {
                logger.warn('COMMANDLIST not set! No commands loaded!');
            }
        }
    }

    public static get instance(): Commands {
        return this._instance;
    }

    public triggerCommand(message: Message) {
        // Don't read your own commands, dummy
        if (message.author.id === message.client.user.id) {
            return;
        }

        const args = message.content.split(/ +/);
        const ref: string = args[0].toLowerCase();

        for (const command of this.commands) {
            if (command.refs.includes(ref)) {
                logger.info(`Triggering ${command.refs}`);
                command.onMessage(message);
            }
        }
    }
}
