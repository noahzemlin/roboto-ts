import { Message } from 'discord.js';
import { HealthyRepo, IHealthy } from '../repos/mongo/healthy';
import BaseCommand from './base-command';

export default class HealthyCommand extends BaseCommand {
    constructor() {
        super(['healthy']);
    }

    public async onMessage(message: Message) {
        const args: string[] = message.content.split(/ +/);
        let keyword = 'pics';

        if (args.length > 1) {
            keyword = args[1].toLowerCase();
        }

        let result: IHealthy = await HealthyRepo.database().getRandom(keyword);

        if (!result) {
            result = await HealthyRepo.database().scrapeHealthies(keyword);
            if (!result) {
                message.channel.send(`I don't think \`${keyword}\` is a valid subreddit`);
                return;
            }
        }

        message.channel.send(`${result.url}\t${result.name}`);
    }
}
