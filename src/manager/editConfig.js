import { execa } from 'execa';
import logger from '../utils/logger.js';

export async function openEditor(configPath) {
    const editor = process.env.EDITOR || process.env.VISUAL || 'nano';

    logger.info(`Opening ${configPath} with ${editor}`);

    try {
        await execa(editor, [configPath], { stdio: 'inherit' });
        logger.info('Editor closed');
    } catch (err) {
        throw new Error(`Failed to open editor: ${err.message}`);
    }
}
