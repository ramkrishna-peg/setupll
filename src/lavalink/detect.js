import { execa } from 'execa';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import logger from '../utils/logger.js';

/**
 * Detect existing LavaLink installations on the system.
 * Checks for:
 *   1. Running LavaLink Java processes
 *   2. Running LavaLink Docker containers
 *   3. Local Lavalink.jar files in common paths
 *   4. Existing application.yml configs
 */

export async function detectExistingLavalink() {
    const results = {
        processes: [],
        containers: [],
        jarFiles: [],
        configs: [],
    };

    // 1. Check for running Java LavaLink processes
    try {
        const { stdout } = await execa('ps', ['aux'], { reject: false });
        if (stdout) {
            const lines = stdout.split('\n');
            for (const line of lines) {
                if (line.includes('Lavalink.jar') || line.includes('lavalink.jar')) {
                    const parts = line.trim().split(/\s+/);
                    const pid = parts[1];
                    const cpu = parts[2];
                    const mem = parts[3];
                    results.processes.push({
                        pid,
                        cpu: cpu + '%',
                        mem: mem + '%',
                        command: parts.slice(10).join(' '),
                    });
                }
            }
        }
    } catch {
        logger.warn('Could not check running processes');
    }

    // 2. Check for LavaLink Docker containers
    try {
        const { stdout } = await execa('docker', ['ps', '--format', '{{.ID}}|{{.Image}}|{{.Status}}|{{.Ports}}|{{.Names}}'], { reject: false });
        if (stdout) {
            const lines = stdout.split('\n').filter(Boolean);
            for (const line of lines) {
                if (line.toLowerCase().includes('lavalink')) {
                    const [id, image, status, ports, name] = line.split('|');
                    results.containers.push({ id, image, status, ports, name });
                }
            }
        }
    } catch {
        // Docker not available
    }

    // 3. Scan common directories for Lavalink.jar
    const searchPaths = [
        './',
        process.env.HOME || '',
        path.join(process.env.HOME || '', 'lavalink'),
        path.join(process.env.HOME || '', 'Lavalink'),
        path.join(process.env.HOME || '', 'Desktop'),
        path.join(process.env.HOME || '', 'Documents'),
        '/opt/lavalink',
        '/srv/lavalink',
    ].filter(Boolean);

    for (const dir of searchPaths) {
        try {
            const jarPath = path.join(dir, 'Lavalink.jar');
            if (fs.existsSync(jarPath)) {
                const stat = fs.statSync(jarPath);
                const sizeMB = (stat.size / (1024 * 1024)).toFixed(1);
                results.jarFiles.push({
                    path: jarPath,
                    size: sizeMB + ' MB',
                    modified: stat.mtime.toISOString().split('T')[0],
                });
            }
        } catch {
            // skip inaccessible dirs
        }
    }

    // 4. Scan for existing application.yml configs
    for (const dir of searchPaths) {
        try {
            const ymlPath = path.join(dir, 'application.yml');
            if (fs.existsSync(ymlPath)) {
                let port = 'unknown';
                let password = '***';
                try {
                    const content = fs.readFileSync(ymlPath, 'utf8');
                    const parsed = yaml.load(content);
                    if (parsed?.server?.port) port = String(parsed.server.port);
                    if (parsed?.lavalink?.server?.password) password = '***';
                } catch {
                    // invalid yaml
                }
                results.configs.push({
                    path: ymlPath,
                    port,
                    hasPassword: true,
                });
            }
        } catch {
            // skip
        }
    }

    return results;
}

export function hasExistingInstallation(results) {
    return (
        results.processes.length > 0 ||
        results.containers.length > 0 ||
        results.jarFiles.length > 0 ||
        results.configs.length > 0
    );
}
