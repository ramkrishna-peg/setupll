import { restartLavalink } from '../lavalink/launch.js';
import logger from '../utils/logger.js';

export async function restart(config) {
    logger.info('Restarting LavaLink...');
    await restartLavalink(config);
    logger.info('LavaLink restarted');
}
