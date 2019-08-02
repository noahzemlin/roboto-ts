import DiscordConnection from './client/client';
import logger from './logger';
import { HealthyRepo } from './repos/mongo/healthy';

async function start() {
    try {
        logger.info('Starting up...');
        HealthyRepo.connect();
        DiscordConnection.init();
    } catch (error) {
        process.exit(1);
    }
}

if (require.main === module) {
    start();
}
