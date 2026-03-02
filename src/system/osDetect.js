export function detectOS() {
    const platform = process.platform;

    if (platform === 'linux') return 'linux';
    if (platform === 'darwin') return 'macos';
    if (platform === 'win32') return 'windows';

    return 'unknown';
}
