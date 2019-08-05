import { Message } from 'discord.js';
import config from '../config';

export default abstract class BaseCommand {
    public refs: string[];

    constructor(refs: string[]) {
        this.refs = refs.map(ref => {
            return `${config.prefix}${ref}`;
        });
    }

    public abstract async onMessage(message: Message): Promise<void>;
}
