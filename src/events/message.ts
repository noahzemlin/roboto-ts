import { Message } from 'discord.js';
import Commands from '../commands/commands';
import config from '../config';

export default class MessageHandler {
    private static instance: MessageHandler = new MessageHandler();

    static get handler() {
        return this.instance;
    }

    public parse(message: Message) {
        // Check if in whitelist and not in blacklist
        if (
            config.channel_filter === 'whitelist' &&
            !config.whitelist_channels.includes(message.channel.id)
        ) {
            return;
        } else if (
            config.channel_filter === 'blacklist' &&
            config.whitelist_channels.includes(message.channel.id)
        ) {
            return;
        }

        Commands.instance.triggerCommand(message);
    }
}
