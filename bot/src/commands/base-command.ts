import { Message } from 'discord.js';
import config from '../config';

export default abstract class BaseCommand {
    public refs: string[];
    public requiresPrefix: boolean;

    constructor(refs: string[], requiresPrefix: boolean = true) {
        if (requiresPrefix === true) {
            this.refs = refs.map(ref => {
                return `${config.prefix}${ref}`;
            });
        } else {
            this.refs = refs;
        }
        this.requiresPrefix = requiresPrefix;
    }

    public abstract async onMessage(message: Message): Promise<void>;
}
