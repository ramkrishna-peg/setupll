import si from 'systeminformation';

export async function getResources() {
    const [cpu, mem, disk, netStats] = await Promise.all([
        si.currentLoad(),
        si.mem(),
        si.fsSize(),
        si.networkStats(),
    ]);

    const cpuPercent = Math.round(cpu.currentLoad || 0);

    const totalMem = mem.total;
    const usedMem = mem.used;
    const memPercent = Math.round((usedMem / totalMem) * 100);
    const usedGB = (usedMem / (1024 ** 3)).toFixed(1);
    const totalGB = (totalMem / (1024 ** 3)).toFixed(1);

    const primaryDisk = disk[0] || {};
    const diskPercent = Math.round(primaryDisk.use || 0);

    const netUp = netStats.reduce((sum, n) => sum + (n.tx_sec || 0), 0);
    const netDown = netStats.reduce((sum, n) => sum + (n.rx_sec || 0), 0);

    const formatSpeed = (bytesPerSec) => {
        if (bytesPerSec > 1024 * 1024) return `${(bytesPerSec / (1024 * 1024)).toFixed(1)} MB/s`;
        if (bytesPerSec > 1024) return `${(bytesPerSec / 1024).toFixed(1)} KB/s`;
        return `${Math.round(bytesPerSec)} B/s`;
    };

    return {
        cpuPercent,
        memPercent,
        usedGB,
        totalGB,
        diskPercent,
        netUp: formatSpeed(netUp),
        netDown: formatSpeed(netDown),
    };
}
