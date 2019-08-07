import * as bunyan from 'bunyan';
import config from './config';

const logger = bunyan.createLogger({
    name: `roboto-${config.commandlist}`,
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
            period: '6h', // log files every 6 hours
            count: 8, // keep 2 days worth
        },
    ],
});

export default logger;
