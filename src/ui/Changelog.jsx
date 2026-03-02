import React, { useCallback, useState } from 'react';
import { Box, Text, useInput } from 'ink';

const CHANGELOG = [
    {
        version: 'v1.0.0',
        date: '2026-03-02',
        tag: 'Initial Release',
        sections: [
            {
                label: 'FEATURES',
                color: '#FFD700',
                items: [
                    'Interactive full-screen TUI with arrow-key navigation',
                    'ASCII LAVALINK banner on main menu (lava orange themed)',
                    'Create LavaLink — guided multi-step setup wizard',
                    'Template system: Default, Basic Bot, Music Bot presets',
                    'Configurable port, password, Java version, plugins, yml path',
                    'LavaLink Manager — centralized server control panel',
                    'Detect existing LavaLink installations on the system',
                ],
            },
            {
                label: 'DOCKER',
                color: '#0DB7ED',
                items: [
                    'Auto-detect Docker installation and daemon status',
                    'Generate docker-compose.yml from user configuration',
                    'One-click container launch with docker compose up',
                ],
            },
            {
                label: 'MONITORING',
                color: '#00FF00',
                items: [
                    'Live log viewer with color-coded log levels (INFO/WARN/ERROR)',
                    'Real-time resource usage — CPU, RAM, Disk, Network',
                    'Auto-refreshing dashboards (every 2 seconds)',
                    'Process status with uptime tracking',
                ],
            },
            {
                label: 'SYSTEM',
                color: '#FF6B35',
                items: [
                    'Cross-platform: Linux, macOS, Windows',
                    'Linux sudo detection with auto-relaunch option',
                    'Persistent warning bar when running without sudo',
                    'application.yml generation using js-yaml (no manual editing)',
                    'LavaLink JAR auto-download from GitHub releases',
                ],
            },
            {
                label: 'UI / UX',
                color: '#FF4500',
                items: [
                    'Full terminal width/height rendering — no partial screens',
                    'Dynamic resize support — UI adapts to terminal size changes',
                    'Lava-themed color palette (#FF6B35, #FF4500, #FFD700)',
                    'Bordered boxes, dividers, and progress bars',
                    'Masked password input for security',
                    'Multi-select plugin picker with toggles',
                ],
            },
        ],
    },
];

export default function Changelog({ onBack, cols }) {
    const w = Math.max(10, (cols || 80) - 8);
    const prefix = '─── Changelog ';
    const header = prefix + '─'.repeat(Math.max(0, w - prefix.length));
    const [scrollOffset, setScrollOffset] = useState(0);

    useInput(useCallback((input, key) => {
        if (key.escape || input === 'q') {
            onBack();
        }
        if (key.upArrow) {
            setScrollOffset((prev) => Math.max(0, prev - 1));
        }
        if (key.downArrow) {
            setScrollOffset((prev) => prev + 1);
        }
    }, [onBack]));

    return (
        <Box flexDirection="column" paddingX={3} paddingTop={1} flexGrow={1}>
            <Text color="#FF6B35" bold>{header}</Text>
            <Text>{''}</Text>

            {CHANGELOG.map((entry) => (
                <Box key={entry.version} flexDirection="column">
                    {/* Version Badge */}
                    <Box
                        borderStyle="round"
                        borderColor="#FF6B35"
                        paddingX={2}
                        paddingY={0}
                    >
                        <Text color="#FFD700" bold>  {entry.version}  </Text>
                        <Text color="#FF6B35">│</Text>
                        <Text color="#FFFFFF">  {entry.date}  </Text>
                        <Text color="#FF6B35">│</Text>
                        <Text color="#FF6B35" bold>  {entry.tag}  </Text>
                    </Box>

                    <Text>{''}</Text>

                    {/* Categorized Sections */}
                    {entry.sections.map((section, si) => (
                        <Box key={si} flexDirection="column" marginBottom={1}>
                            <Box paddingLeft={1}>
                                <Text color={section.color} bold>{'[ '}{section.label}{' ]'}</Text>
                            </Box>
                            {section.items.map((item, ii) => (
                                <Box key={ii} paddingLeft={3}>
                                    <Text color="#FF6B35">▸ </Text>
                                    <Text color="#FFFFFF">{item}</Text>
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Box>
            ))}

            <Text>{''}</Text>
            <Box>
                <Text color="#888888">  [ESC] Back  </Text>
                <Text color="#888888">·</Text>
                <Text color="#888888">  [Up/Down] Scroll</Text>
            </Box>
        </Box>
    );
}
