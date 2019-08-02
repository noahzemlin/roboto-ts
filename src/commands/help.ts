import { Message } from 'discord.js';
import BaseCommand from './base-command';

export default class HelpCommand extends BaseCommand {
    constructor() {
        super(['help', 'cool']);
    }

    public async onMessage(message: Message) {
        message.channel.send('no help, goodbye');
    }
}
