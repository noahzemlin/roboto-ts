import { Message } from 'discord.js';
import * as ytdl from 'ytdl-core';
import VoiceController from '../controllers/voice';
import BaseCommand from './base-command';

export default class PlayCommand extends BaseCommand {
    constructor() {
        super(['play']);
    }

    public async onMessage(message: Message) {
        const args: string[] = message.content.split(/ +/);

        if (message.member.voice.channel) {
            const info: ytdl.videoInfo = await ytdl.getInfo(args[1]);
            if (info) {
                VoiceController.instance.requestStream(
                    message.member.voice.channel,
                    message.channel,
                    info
                );
            } else {
                message.reply('Could not find that video');
            }
        } else {
            message.reply('You must be in a voice channel!');
        }
    }
}
