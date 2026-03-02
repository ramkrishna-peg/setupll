import React, { useCallback } from 'react';
import { Box, Text, useInput } from 'ink';

export default function HelloScreen({ onBack, cols }) {
    const w = Math.max(10, (cols || 80) - 8);
    const prefix = '─── Welcome ';
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

            <Box
                flexDirection="column"
                borderStyle="round"
                borderColor="#FFD700"
                paddingX={2}
                paddingY={1}
            >
                <Text color="#FFD700" bold>  WELCOME TO SETUPLL  </Text>
                <Text color="#FFD700">  {'─'.repeat(Math.min(40, innerW))}</Text>
                <Text>{''}</Text>
                <Text color="#FFFFFF">  SetupLL is your all-in-one interactive terminal tool</Text>
                <Text color="#FFFFFF">  for setting up, configuring, and managing LavaLink servers.</Text>
                <Text>{''}</Text>
                <Text color="#FFFFFF">  Whether you're running locally or via Docker, SetupLL</Text>
                <Text color="#FFFFFF">  makes it simple to get your music bot infrastructure</Text>
                <Text color="#FFFFFF">  up and running in minutes.</Text>
            </Box>

            <Text>{''}</Text>

            <Box
                flexDirection="column"
                borderStyle="round"
                borderColor="#FF6B35"
                paddingX={2}
                paddingY={1}
            >
                <Text color="#FF6B35" bold>  GETTING STARTED  </Text>
                <Text color="#FF6B35">  {'─'.repeat(Math.min(40, innerW))}</Text>
                <Text>{''}</Text>
                <Box><Text color="#FFD700">  1. </Text><Text color="#FFFFFF">Use the </Text><Text color="#FF6B35" bold>Create LavaLink</Text><Text color="#FFFFFF"> wizard to generate a server configuration.</Text></Box>
                <Box><Text color="#FFD700">  2. </Text><Text color="#FFFFFF">Select a template, customize ports, passwords, and plugins.</Text></Box>
                <Box><Text color="#FFD700">  3. </Text><Text color="#FFFFFF">Launch the server with one click.</Text></Box>
                <Box><Text color="#FFD700">  4. </Text><Text color="#FFFFFF">Use the </Text><Text color="#FF4500" bold>Manager</Text><Text color="#FFFFFF"> to view live logs, stats, and control the process.</Text></Box>
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
