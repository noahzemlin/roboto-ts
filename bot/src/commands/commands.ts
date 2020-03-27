import { Message, PartialMessage } from 'discord.js';
import config from '../config';
import logger from '../logger';
import BaseCommand from './base-command';
import HealthyCommand from './healthy';
import NextCommand from './next';
import PlayCommand from './play';
import TFWCommand from './tfw';
import VolumeCommand from './volume';

export default class Commands {
    private static _instance: Commands = new Commands();
    private commands: BaseCommand[] = [];
    private commandsPrefixless: BaseCommand[] = [];

    constructor() {
        switch (config.commandlist) {
            case 'text': {
                this.pushCommand(new HealthyCommand());
                this.pushCommand(new TFWCommand());
                break;
            }
            case 'voice': {
                this.pushCommand(new PlayCommand());
                this.pushCommand(new NextCommand());
                this.pushCommand(new VolumeCommand());
                break;
            }
            default: {
                logger.warn('COMMANDLIST not set! No commands loaded!');
            }
        }
    }

    private pushCommand(command: BaseCommand) {
        if (command.requiresPrefix) {
            this.commands.push(command);
        } else {
            this.commandsPrefixless.push(command);
        }
    }

    public static get instance(): Commands {
        return this._instance;
    }

    public triggerCommand(message: Message | PartialMessage) {
        // Don't read your own commands, dummy
        if (message.author.id === message.client.user.id) {
            return;
        }

        const msg = message.content.toLocaleLowerCase();
        const args = msg.split(/ +/);
        const ref: string = args[0];

        for (const command of this.commands) {
            if (command.refs.includes(ref)) {
                logger.info(`Command call ${command.refs}`);
                command.onMessage(message);
                return;
            }
        }

        // TODO: Refactor this to not be slow af
        for (const command of this.commandsPrefixless) {
            for (const commandRef of command.refs) {
                if (msg.includes(commandRef)) {
                    logger.info(`CommandPrefixless call ${command.refs}`);
                    command.onMessage(message);
                    return;
                }
            }
        }
    }
}
