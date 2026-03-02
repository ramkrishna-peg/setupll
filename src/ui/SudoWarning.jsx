import React from 'react';
import { Box, Text, useInput } from 'ink';
import SelectMenu from './components/SelectMenu.jsx';
import { relaunchAsSudo } from '../system/sudoCheck.js';

const SUDO_ITEMS = [
    { label: 'Relaunch as sudo automatically', value: 'relaunch' },
    { label: 'Continue without sudo (not recommended)', value: 'continue' },
    { label: 'Exit', value: 'exit' },
];

export default function SudoWarning({ onDecision }) {
    const handleSelect = async (item) => {
        if (item.value === 'relaunch') {
            try {
                await relaunchAsSudo();
            } catch {
                onDecision('continue');
            }
        } else {
            onDecision(item.value);
        }
    };

    return (
        <Box flexDirection="column" paddingX={3} paddingTop={2} flexGrow={1}>
            <Text color="#FFD700" bold>⚠   Linux Detected</Text>
            <Text>{''}</Text>
            <Text color="#FFFFFF">
                LavaLink requires elevated permissions on Linux to run
            </Text>
            <Text color="#FFFFFF">
                properly. Please relaunch with sudo:
            </Text>
            <Text>{''}</Text>
            <Text color="#FF6B35" bold>   sudo setupll</Text>
            <Text>{''}</Text>
            <SelectMenu items={SUDO_ITEMS} onSelect={handleSelect} />
        </Box>
    );
}
