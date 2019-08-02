import Axios from 'axios';
import * as mongoose from 'mongoose';
import logger from '../../logger';
import Repo from './mongo-base';

const Schema = mongoose.Schema;
const SchemaTypes = mongoose.SchemaTypes;

interface IHealthy {
    subreddit: string;
    name: string;
    url: string;
    date?: Date;
    [propName: string]: any;
}

// TODO: Refactor this horrible abomination into a HealthyController
class HealthyRepo extends Repo<IHealthy> {
    private static instance = new HealthyRepo();
    public static database(): HealthyRepo {
        return HealthyRepo.instance;
    }

    public static async connect() {
        await HealthyRepo.instance.connect();
    }

    public async getRandom(subreddit: string): Promise<IHealthy> {
        const result = await this.model
            .aggregate()
            .match({ subreddit: subreddit })
            .sample(1)
            .exec();
        if (result.length > 0) {
            return result[0];
        } else {
            return null;
        }
    }

    public async scrapeHealthies(subreddit: string): Promise<IHealthy> {
        logger.info(`Performing scrape for ${subreddit}`);

        const axiosParams = {
            subreddit: subreddit,
            sort_type: 'score',
            size: 1000,
            fields: 'title,url', // Only grab what we use
            domain: 'i.imgur.com,imgur.com,i.redd.it,i.reddituploads.com',
        };

        const out = await Axios.get('https://api.pushshift.io/reddit/submission/search', {
            params: axiosParams,
        });

        if (out.data.data.length === 0) {
            return null;
        }

        const data: IHealthy[] = out.data.data.map((value: any, index: number) => {
            if (index === 0) {
                return {
                    subreddit: subreddit,
                    name: value.title,
                    url: value.url,
                    date: Date(),
                };
            } else {
                return {
                    subreddit: subreddit,
                    name: value.title,
                    url: value.url,
                };
            }
        });

        data.forEach(async value => {
            this.insert(value);
        });

        return data[Math.floor(Math.random() * data.length)];
    }

    private constructor() {
        const schema = new Schema({
            subreddit: SchemaTypes.String,
            name: SchemaTypes.String,
            url: SchemaTypes.String,
            date: SchemaTypes.Date,
        });
        schema.index({ source: 1 }, { unique: false });
        super(schema, 'Healthy', 'healthies');
    }
}

export { HealthyRepo, IHealthy };
