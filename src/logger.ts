import * as bunyan from 'bunyan';
import config from './config';

const logger = bunyan.createLogger({
    name: 'roboto',
    level: config.log_level as bunyan.LogLevelString,
    streams: [
        {
            level: 'info',
            stream: process.stdout, // log INFO and above to stdout
        },
        {
            level: 'info',
            type: 'rotating-file',
            path: './logs.txt',
            period: '1h', // daily rotation
            count: 24, // keep 3 back copies
        },
    ],
});

export default logger;
