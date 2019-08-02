import * as bunyan from 'bunyan';

interface IMongo {
    url: string;
}

interface IConfig {
    prefix: string;
    token: string;
    mongo: IMongo;
    log_level: bunyan.LogLevelString;
    channel_filter?: 'whitelist' | 'blacklist';
    whitelist_channels?: string[];
    blacklist_channels?: string[];
}

const config: IConfig = {
    prefix: process.env.PREFIX || '!',
    token: process.env.TOKEN || '',
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
