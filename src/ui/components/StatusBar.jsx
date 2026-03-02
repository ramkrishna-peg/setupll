import React from 'react';
import { Box, Text } from 'ink';

export default function StatusBar({ message, type = 'warning' }) {
    if (!message) return null;

    const colors = {
        warning: '#FFD700',
        error: '#FF0000',
        info: '#888888',
        success: '#00FF00',
    };

    const icons = {
        warning: '⚠',
        error: '✖',
        info: 'ℹ',
        success: '✔',
    };

    const color = colors[type] || colors.warning;
    const icon = icons[type] || icons.warning;

    return (
        <Box width="100%" paddingX={1}>
            <Text color={color}>{icon}  {message}</Text>
        </Box>
    );
}
