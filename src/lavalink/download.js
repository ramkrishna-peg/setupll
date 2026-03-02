import fs from 'fs';
import path from 'path';
import https from 'https';
import logger from '../utils/logger.js';

const LAVALINK_JAR_URL =
    'https://github.com/lavalink-devs/Lavalink/releases/latest/download/Lavalink.jar';

export async function downloadLavalink(config) {
    const outputDir = config.ymlPath || './';
    const jarPath = path.resolve(outputDir, 'Lavalink.jar');

    // Skip download if jar already exists
    if (fs.existsSync(jarPath)) {
        logger.info(`LavaLink jar already exists at ${jarPath}`);
        return jarPath;
    }

    logger.info(`Downloading LavaLink jar to ${jarPath}...`);

    return new Promise((resolve, reject) => {
        const dir = path.dirname(jarPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const file = fs.createWriteStream(jarPath);

        const doRequest = (url) => {
            https.get(url, (response) => {
                // Handle redirects
                if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                    doRequest(response.headers.location);
                    return;
                }

                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to download LavaLink jar: HTTP ${response.statusCode}`));
                    return;
                }

                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    logger.info('LavaLink jar downloaded successfully');
                    resolve(jarPath);
                });
            }).on('error', (err) => {
                fs.unlinkSync(jarPath);
                reject(new Error(`Download failed: ${err.message}`));
            });
        };

        doRequest(LAVALINK_JAR_URL);
    });
}
