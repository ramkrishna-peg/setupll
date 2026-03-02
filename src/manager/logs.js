import { getLavalinkProcess } from '../lavalink/launch.js';

export function getLogStream() {
    const proc = getLavalinkProcess();
    if (!proc || !proc.stdout) return null;
    return proc.stdout;
}

export function getErrorStream() {
    const proc = getLavalinkProcess();
    if (!proc || !proc.stderr) return null;
    return proc.stderr;
}
