import { Message } from 'discord.js';
import * as ytdl from 'ytdl-core';
import VoiceController from '../controllers/voice';
import BaseCommand from './base-command';

export default class VolumeCommand extends BaseCommand {
    constructor() {
        super(['volume']);
    }

    public async onMessage(message: Message) {
        const args: string[] = message.content.split(/ +/);

        let volume: number = parseInt(args[1], 10);

        if (volume < 0) {
            volume = 0;
        }

        if (volume > 100) {
            volume = 100;
        }

        VoiceController.instance.setVolume(volume / 100.0);
    }
}
