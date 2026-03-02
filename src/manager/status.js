import { getLavalinkProcess } from '../lavalink/launch.js';

export function getStatus() {
    const proc = getLavalinkProcess();
    const running = proc && !proc.killed;

    return {
        running,
        pid: proc?.pid || null,
        uptime: running ? process.uptime() : 0,
    };
}
