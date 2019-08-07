import { Message } from 'discord.js';
import { pepes } from '../data/pepes.json';
import BaseCommand from './base-command';

export default class TFWCommand extends BaseCommand {
    constructor() {
        super(['tfw', 'that feel when'], false);
    }

    public async onMessage(message: Message) {
        message.channel.send(TFWCommand.getRandomPepe());
    }

    private static getRandomPepe(): string {
        return `http://i.imgur.com/${pepes[Math.floor(Math.random() * pepes.length)]}.png`;
    }
}
