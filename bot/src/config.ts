import * as bunyan from 'bunyan';
import * as dotenv from 'dotenv';

dotenv.config();

interface IMongo {
    url: string;
}

interface IConfig {
    commandlist: string;
    prefix: string;
    discordtoken: string;
    mongo: IMongo;
    log_level: bunyan.LogLevelString;
    channel_filter?: 'whitelist' | 'blacklist';
    whitelist_channels?: string[];
    blacklist_channels?: string[];
}

const config: IConfig = {
    commandlist: process.env.COMMANDLIST || '',
    prefix: process.env.PREFIX || '!',
    discordtoken: process.env.DISCORD_BOT_TOKEN || '',
    mongo: {
        url: process.env.MONGO_URL || '',
    },
    log_level: (process.env.LOG_LEVEL as bunyan.LogLevelString) || 'error',
    channel_filter: (process.env.CHANNEL_FILTER as 'whitelist' | 'blacklist') || 'whitelist',
    whitelist_channels: process.env.WHITELIST_CHANNELS
        ? process.env.WHITELIST_CHANNELS.split(',') || []
        : [],
    blacklist_channels: process.env.BLACKLIST_CHANNELS
        ? process.env.BLACKLIST_CHANNELS.split(',') || []
        : [],
};

export default config;
