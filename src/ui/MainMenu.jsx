import React from 'react';
import { Box, Text, useInput } from 'ink';
import Banner from './components/Banner.jsx';
import SelectMenu from './components/SelectMenu.jsx';

const MENU_ITEMS = [
    { label: 'Hello', value: 'hello' },
    { label: 'How-To Guide (Documentation)', value: 'how-to' },
    { label: 'Create Lavalink', value: 'create-lavalink' },
    { label: 'Manager', value: 'manager' },
    { label: 'About Setup-Lavalink', value: 'about' },
    { label: 'Changelog', value: 'changelog' },
    { label: 'Source on GitHub', value: 'github' },
];

export default function MainMenu({ onNavigate, cols }) {
    const dividerWidth = Math.max(10, (cols || 80) - 6);
    const divider = '─'.repeat(dividerWidth);

    const handleSelect = (item) => {
        if (item.value === 'github') {
            import('open').then((mod) => mod.default('https://github.com/ramkrishna-peg/setupll'));
            return;
        }
        onNavigate(item.value);
    };

    return (
        <Box flexDirection="column" alignItems="center" paddingTop={1} flexGrow={1}>
            <Banner />
            <Text>{''}</Text>
            <Box width="100%" paddingX={2} justifyContent="space-between">
                <Text color="#888888">By Ramkrishna</Text>
                <Text color="#888888">v1.0.0</Text>
            </Box>
            <Box paddingX={2} width="100%">
                <Text color="#FF6B35">{divider}</Text>
            </Box>
            <Text>{''}</Text>
            <Text color="#FFFFFF" bold>Choose an option:</Text>
            <Text>{''}</Text>
            <SelectMenu items={MENU_ITEMS} onSelect={handleSelect} centered />
        </Box>
    );
}
