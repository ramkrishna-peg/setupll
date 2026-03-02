import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logFile = path.join(__dirname, '..', '..', 'setupll.log');

const logStream = fs.createWriteStream(logFile, { flags: 'a' });

const logger = {
    info(msg) {
        logStream.write(`[INFO ] ${new Date().toISOString()}  ${msg}\n`);
    },
    warn(msg) {
        logStream.write(`[WARN ] ${new Date().toISOString()}  ${msg}\n`);
    },
    error(msg) {
        logStream.write(`[ERROR] ${new Date().toISOString()}  ${msg}\n`);
    },
};

export default logger;
