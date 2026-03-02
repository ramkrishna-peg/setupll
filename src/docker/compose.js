import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import logger from '../utils/logger.js';

export async function generateCompose(config) {
    const port = config.port || '2333';

    const compose = {
        version: '3.8',
        services: {
            lavalink: {
                image: 'ghcr.io/lavalink-devs/lavalink:latest',
                container_name: 'lavalink',
                restart: 'unless-stopped',
                ports: [`${port}:${port}`],
                volumes: ['./application.yml:/opt/Lavalink/application.yml'],
                environment: {
                    _JAVA_OPTIONS: `-Xmx1G`,
                    SERVER_PORT: port,
                },
            },
        },
    };

    const ymlContent = yaml.dump(compose, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        quotingType: '"',
    });

    const outputDir = config.ymlPath || './';
    const outputPath = path.resolve(outputDir, 'docker-compose.yml');

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, ymlContent, 'utf8');
    logger.info(`docker-compose.yml generated at ${outputPath}`);

    return outputPath;
}
