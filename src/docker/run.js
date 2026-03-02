import path from 'path';
import { execa } from 'execa';
import logger from '../utils/logger.js';

export async function runDocker(config) {
    const outputDir = config.ymlPath || './';
    const cwd = path.resolve(outputDir);

    logger.info('Starting Docker container...');

    try {
        await execa('docker', ['compose', 'up', '-d'], { cwd });
        logger.info('Docker container started successfully');
    } catch (err) {
        // Try old docker-compose command
        try {
            await execa('docker-compose', ['up', '-d'], { cwd });
            logger.info('Docker container started successfully (legacy compose)');
        } catch (err2) {
            throw new Error(`Failed to start Docker container: ${err2.message}`);
        }
    }
}

export async function stopDocker(config) {
    const outputDir = config.ymlPath || './';
    const cwd = path.resolve(outputDir);

    try {
        await execa('docker', ['compose', 'down'], { cwd });
        logger.info('Docker container stopped');
    } catch {
        try {
            await execa('docker-compose', ['down'], { cwd });
            logger.info('Docker container stopped (legacy compose)');
        } catch (err) {
            throw new Error(`Failed to stop Docker container: ${err.message}`);
        }
    }
}
