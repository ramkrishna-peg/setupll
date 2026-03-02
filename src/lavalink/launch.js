import path from 'path';
import { execa } from 'execa';
import logger from '../utils/logger.js';

let lavalinkProcess = null;

export async function launchLavalink(config) {
    const outputDir = config.ymlPath || './';
    const jarPath = path.resolve(outputDir, 'Lavalink.jar');
    const cwd = path.resolve(outputDir);

    logger.info(`Launching LavaLink from ${jarPath}...`);

    const javaVersion = config.java || '21';

    lavalinkProcess = execa('java', ['-jar', jarPath], {
        cwd,
        detached: true,
        stdio: 'pipe',
    });

    // Don't wait for it to exit — it runs as a server
    lavalinkProcess.unref?.();

    // Give it a moment to start
    await new Promise((resolve) => setTimeout(resolve, 2000));

    logger.info('LavaLink process started');
    return lavalinkProcess;
}

export function getLavalinkProcess() {
    return lavalinkProcess;
}

export function stopLavalink() {
    if (lavalinkProcess) {
        lavalinkProcess.kill('SIGTERM');
        lavalinkProcess = null;
        logger.info('LavaLink process stopped');
    }
}

export function restartLavalink(config) {
    stopLavalink();
    return launchLavalink(config);
}
