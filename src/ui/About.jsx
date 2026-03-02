import React, { useCallback } from 'react';
import { Box, Text, useInput } from 'ink';

export default function About({ onBack, cols }) {
    const w = Math.max(10, (cols || 80) - 8);
    const prefix = '─── About Setup-LavaLink ';
    const header = prefix + '─'.repeat(Math.max(0, w - prefix.length));
    const innerW = Math.max(10, w - 6);

    useInput(useCallback((input, key) => {
        if (key.escape || input === 'q') {
            onBack();
        }
    }, [onBack]));

    return (
        <Box flexDirection="column" paddingX={3} paddingTop={1} flexGrow={1}>
            <Text color="#FF6B35" bold>{header}</Text>
            <Text>{''}</Text>

            {/* Project Identity */}
            <Box
                flexDirection="column"
                borderStyle="round"
                borderColor="#FF6B35"
                paddingX={2}
                paddingY={1}
            >
                <Text color="#FF6B35" bold>  PROJECT INFO  </Text>
                <Text color="#FF6B35">  {'─'.repeat(Math.min(40, innerW))}</Text>
                <Text>{''}</Text>
                <Box><Text color="#FFD700" bold>{'  Name         '}</Text><Text color="#FF6B35">│ </Text><Text color="#FFFFFF">SetupLL</Text></Box>
                <Box><Text color="#FFD700" bold>{'  Version      '}</Text><Text color="#FF6B35">│ </Text><Text color="#FFFFFF">v1.0.0</Text></Box>
                <Box><Text color="#FFD700" bold>{'  Description  '}</Text><Text color="#FF6B35">│ </Text><Text color="#FFFFFF">Interactive TUI for LavaLink server management</Text></Box>
                <Box><Text color="#FFD700" bold>{'  Author       '}</Text><Text color="#FF6B35">│ </Text><Text color="#FFFFFF">Ramkrishna</Text></Box>
                <Box><Text color="#FFD700" bold>{'  License      '}</Text><Text color="#FF6B35">│ </Text><Text color="#FFFFFF">MIT</Text></Box>
                <Box><Text color="#FFD700" bold>{'  Repository   '}</Text><Text color="#FF6B35">│ </Text><Text color="#FFFFFF">github.com/ramkrishna-peg/setupll</Text></Box>
                <Box><Text color="#FFD700" bold>{'  Runtime      '}</Text><Text color="#FF6B35">│ </Text><Text color="#FFFFFF">Node.js {process.version}</Text></Box>
                <Box><Text color="#FFD700" bold>{'  Platform     '}</Text><Text color="#FF6B35">│ </Text><Text color="#FFFFFF">{process.platform} ({process.arch})</Text></Box>
            </Box>

            <Text>{''}</Text>

            {/* Description */}
            <Box
                flexDirection="column"
                borderStyle="round"
                borderColor="#FF4500"
                paddingX={2}
                paddingY={1}
            >
                <Text color="#FF4500" bold>  ABOUT  </Text>
                <Text color="#FF4500">  {'─'.repeat(Math.min(40, innerW))}</Text>
                <Text>{''}</Text>
                <Text color="#FFFFFF">  SetupLL is your all-in-one interactive terminal tool for</Text>
                <Text color="#FFFFFF">  setting up, configuring, and managing LavaLink audio servers.</Text>
                <Text>{''}</Text>
                <Text color="#FFFFFF">  It provides a guided wizard-style experience to deploy</Text>
                <Text color="#FFFFFF">  LavaLink locally or via Docker, with zero manual YAML editing.</Text>
            </Box>

            <Text>{''}</Text>

            {/* Features */}
            <Box
                flexDirection="column"
                borderStyle="round"
                borderColor="#FFD700"
                paddingX={2}
                paddingY={1}
            >
                <Text color="#FFD700" bold>  KEY FEATURES  </Text>
                <Text color="#FFD700">  {'─'.repeat(Math.min(40, innerW))}</Text>
                <Text>{''}</Text>
                <Box><Text color="#FF6B35">  ▸ </Text><Text color="#FFFFFF">Multi-step setup wizard with templates</Text></Box>
                <Box><Text color="#FF6B35">  ▸ </Text><Text color="#FFFFFF">Local bare-metal & Docker deployment</Text></Box>
                <Box><Text color="#FF6B35">  ▸ </Text><Text color="#FFFFFF">Detect existing LavaLink installations</Text></Box>
                <Box><Text color="#FF6B35">  ▸ </Text><Text color="#FFFFFF">Live log viewer with color-coded levels</Text></Box>
                <Box><Text color="#FF6B35">  ▸ </Text><Text color="#FFFFFF">Real-time CPU, RAM, Disk, Network monitoring</Text></Box>
                <Box><Text color="#FF6B35">  ▸ </Text><Text color="#FFFFFF">Process management — start, stop, restart</Text></Box>
                <Box><Text color="#FF6B35">  ▸ </Text><Text color="#FFFFFF">Automatic sudo detection on Linux</Text></Box>
                <Box><Text color="#FF6B35">  ▸ </Text><Text color="#FFFFFF">Template-based application.yml generation</Text></Box>
            </Box>

            <Text>{''}</Text>

            {/* Tech Stack */}
            <Box paddingLeft={2}>
                <Text color="#888888">Built with  </Text>
                <Text color="#FF6B35" bold>Ink</Text>
                <Text color="#888888"> · </Text>
                <Text color="#FF6B35" bold>React</Text>
                <Text color="#888888"> · </Text>
                <Text color="#FF6B35" bold>Chalk</Text>
                <Text color="#888888"> · </Text>
                <Text color="#FF6B35" bold>js-yaml</Text>
                <Text color="#888888"> · </Text>
                <Text color="#FF6B35" bold>execa</Text>
            </Box>

            <Text>{''}</Text>
            <Text color="#FF6B35">  Made with care by Ramkrishna</Text>
            <Text color="#888888">  Note: SetupLL is an unofficial tool and is not</Text>
            <Text color="#888888">  affiliated with or endorsed by the official LavaLink project.</Text>
            <Text>{''}</Text>
            <Text color="#888888">  [ESC] Back to Main Menu</Text>
        </Box>
    );
}
