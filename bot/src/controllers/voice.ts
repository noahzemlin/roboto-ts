import {
    DMChannel,
    StreamDispatcher,
    TextChannel,
    VoiceChannel,
    VoiceConnection,
} from 'discord.js';
import * as ytdl from 'ytdl-core';
import DiscordConnection from '../client/client';
import logger from '../logger';

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

    private volume: number = 0.1;
    private playing: boolean = false;
    private dispatcher: StreamDispatcher = null;
    private voiceConnection: VoiceConnection = null;

    public requestStream(
        voiceChannel: VoiceChannel,
        textChannel: TextChannel | DMChannel,
        info: ytdl.videoInfo
    ) {
        this.queue.push({ voiceChannel, textChannel, info });
        textChannel.send(`Added to queue: ${info.title}`);
        if (!this.playing) {
            this.next();
        }
    }

    public async next() {
        if (this.dispatcher) {
            this.dispatcher.end();
        }

        if (this.queue.length === 0) {
            this.playing = false;
            DiscordConnection.client.user.setPresence({ activity: { name: '' } });
            return;
        }

        const song: QueueItem = this.queue.shift();

        if (this.voiceConnection && this.voiceConnection.channel.id !== song.voiceChannel.id) {
            this.voiceConnection.disconnect();
            this.voiceConnection = await song.voiceChannel.join();
        } else if (!this.voiceConnection) {
            this.voiceConnection = await song.voiceChannel.join();
        }

        this.playing = true;
        this.dispatcher = this.voiceConnection.play(
            ytdl(song.info.video_url, { filter: 'audioonly' }),
            { seek: 0, volume: this.volume }
        );

        DiscordConnection.client.user.setPresence({
            activity: {
                name: song.info.title,
                type: 'LISTENING',
            },
        });

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
