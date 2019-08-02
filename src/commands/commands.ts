import { Message } from 'discord.js';
import logger from '../logger';
import BaseCommand from './base-command';
import HealthyCommand from './healthy';
import HelpCommand from './help';
import NextCommand from './next';
import PlayCommand from './play';

export default class Commands {
    private static _instance: Commands = new Commands();
    private commands: BaseCommand[] = [];

    constructor() {
        this.commands.push(new HelpCommand());
        this.commands.push(new HealthyCommand());
        this.commands.push(new PlayCommand());
        this.commands.push(new NextCommand());
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
