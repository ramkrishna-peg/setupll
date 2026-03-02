import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function generateConfig(config) {
    // Load template
    const templateName = config.template || 'default';
    const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.yml`);

    let baseConfig;
    try {
        if (config.template === 'custom' && config.customUrl) {
            const urlOrPath = config.customUrl.trim();
            if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
                const response = await fetch(urlOrPath);
                if (!response.ok) throw new Error(`Failed to download template: ${response.statusText}`);
                const templateContent = await response.text();
                baseConfig = yaml.load(templateContent);
            } else {
                // assume local path
                const resolvedPath = path.resolve(urlOrPath);
                const templateContent = fs.readFileSync(resolvedPath, 'utf8');
                baseConfig = yaml.load(templateContent);
            }
        } else {
            const templateContent = fs.readFileSync(templatePath, 'utf8');
            baseConfig = yaml.load(templateContent);
        }
    } catch (e) {
        // Fallback to default template on error
        const defaultPath = path.join(__dirname, '..', 'templates', 'default.yml');
        const defaultContent = fs.readFileSync(defaultPath, 'utf8');
        baseConfig = yaml.load(defaultContent);
    }

    // Override with user config
    if (config.port) {
        baseConfig.server.port = parseInt(config.port, 10);
    }
    if (config.password) {
        baseConfig.lavalink.server.password = config.password;
    }

    // Generate YAML
    const ymlContent = yaml.dump(baseConfig, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        quotingType: '"',
    });

    // Write to path
    const outputDir = config.ymlPath || './';
    const outputPath = path.resolve(outputDir, 'application.yml');

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, ymlContent, 'utf8');

    return outputPath;
}
