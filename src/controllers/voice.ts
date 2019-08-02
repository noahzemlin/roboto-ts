import {
    DMChannel,
    Message,
    StreamDispatcher,
    TextChannel,
    VoiceChannel,
    VoiceConnection,
} from 'discord.js';
import { Readable } from 'stream';
import * as ytdl from 'ytdl-core';

interface QueueItem {
    voiceChannel: VoiceChannel;
    textChannel: TextChannel | DMChannel;
    info: ytdl.videoInfo;
}

export default class VoiceController {
    private static _instance: VoiceController = new VoiceController();

    public static get instance() {
        return VoiceController._instance;
    }

    private queue: QueueItem[] = [];

    private volume: number = 0.2;
    private playing: boolean = false;
    private dispatcher: StreamDispatcher = null;
    private voiceConnection: VoiceConnection = null;

    public requestStream(
        voiceChannel: VoiceChannel,
        textChannel: TextChannel | DMChannel,
        info: ytdl.videoInfo
    ) {
        this.queue.push({ voiceChannel, textChannel, info });
        if (!this.playing) {
            this.next();
        }
    }

    public async next() {
        if (this.dispatcher) {
            this.dispatcher.destroy();
        }

        if (this.queue.length === 0) {
            return;
        }

        const song: QueueItem = this.queue.shift();

        if (this.voiceConnection && this.voiceConnection.channel.id !== song.voiceChannel.id) {
            this.voiceConnection.disconnect();
            this.voiceConnection = await song.voiceChannel.join();
        } else if (!this.voiceConnection) {
            this.voiceConnection = await song.voiceChannel.join();
        }

        this.dispatcher = this.voiceConnection.play(ytdl(song.info.video_url));
        this.dispatcher.setVolume(this.volume);

        song.textChannel.send(`Now playing ${song.info.title}`);

        this.dispatcher.on('finish', () => {
            this.next();
        });
    }

    public setVolume(volume: number) {
        this.volume = volume;
        if (this.dispatcher) {
            this.dispatcher.setVolume(volume);
        }
    }
}
