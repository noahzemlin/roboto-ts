import { Message } from 'discord.js';
import VoiceController from '../controllers/voice';
import BaseCommand from './base-command';

export default class NextCommand extends BaseCommand {
    constructor() {
        super(['next']);
    }

    public async onMessage(message: Message) {
        VoiceController.instance.next();
    }
}
