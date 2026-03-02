import { execa } from 'execa';

export function isRoot() {
    try {
        return process.getuid && process.getuid() === 0;
    } catch {
        return false;
    }
}

export async function relaunchAsSudo() {
    try {
        await execa('sudo', ['setupll'], {
            stdio: 'inherit',
        });
        process.exit(0);
    } catch (err) {
        throw new Error(`Failed to relaunch with sudo: ${err.message}`);
    }
}
