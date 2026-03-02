import { execa } from 'execa';
import logger from '../utils/logger.js';

export async function detectDocker() {
    try {
        await execa('docker', ['info']);
        logger.info('Docker detected and running');
        return true;
    } catch {
        logger.warn('Docker not detected or not running');
        throw new Error(
            'Docker is not installed or not running. Please install Docker and try again.'
        );
    }
}
