import { stopLavalink } from '../lavalink/launch.js';
import logger from '../utils/logger.js';

export function stop() {
    logger.info('Stopping LavaLink...');
    stopLavalink();
    logger.info('LavaLink stopped');
}
