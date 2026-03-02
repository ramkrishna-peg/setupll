import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';

export default function TalkBox({ label, defaultValue = '', onSubmit, onBack, masked = false }) {
    const [value, setValue] = useState('');

    useInput(useCallback((input, key) => {
        if (key.escape) {
            if (onBack) onBack();
            return;
        }
        if (key.return) {
            const finalValue = value.length > 0 ? value : defaultValue;
            onSubmit(finalValue);
            return;
        }
        if (key.backspace || key.delete) {
            setValue((prev) => prev.slice(0, -1));
            return;
        }
        if (input && !key.ctrl && !key.meta) {
            setValue((prev) => prev + input);
        }
    }, [value, defaultValue, onSubmit, onBack]));

    const displayValue = masked ? '•'.repeat(value.length) : value;
    const cursor = '█';

    return (
        <Box flexDirection="column" paddingLeft={2} paddingRight={2}>
            <Box
                flexDirection="column"
                borderStyle="single"
                borderColor="#FF6B35"
                paddingX={2}
                paddingY={1}
            >
                <Text color="#FF6B35" bold> Enter value </Text>
                <Text>{''}</Text>
                <Box>
                    <Text color="#FFD700">{label}:  </Text>
                    <Text color="#FFFFFF">{displayValue}</Text>
                    <Text color="#FF6B35">{cursor}</Text>
                </Box>
                <Text>{''}</Text>
                <Text color="#888888">
                    Default: {masked ? '••••••••' : defaultValue}  •  Press Enter to confirm
                </Text>
            </Box>
        </Box>
    );
}
