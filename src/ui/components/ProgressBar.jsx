import React from 'react';
import { Box, Text } from 'ink';

export default function ProgressBar({ label, percent, detail = '', width = 20 }) {
    const filled = Math.round((percent / 100) * width);
    const empty = width - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);

    return (
        <Box>
            <Text color="#FFD700">{label.padEnd(7)}</Text>
            <Text color="#FF6B35">{bar}</Text>
            <Text color="#FFFFFF">  {percent}%</Text>
            {detail ? <Text color="#888888">  ({detail})</Text> : null}
        </Box>
    );
}
