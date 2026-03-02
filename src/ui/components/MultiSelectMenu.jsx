import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';

export default function MultiSelectMenu({ items, onSubmit, onBack }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [selected, setSelected] = useState(new Set());

    useInput(useCallback((input, key) => {
        if (key.upArrow) {
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
        }
        if (key.downArrow) {
            setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
        }
        if (input === ' ') {
            setSelected((prev) => {
                const next = new Set(prev);
                const item = items[activeIndex];
                const val = typeof item === 'string' ? item : item.value;
                if (next.has(val)) {
                    next.delete(val);
                } else {
                    next.add(val);
                }
                return next;
            });
        }
        if (key.return) {
            onSubmit([...selected]);
        }
        if (key.escape || input === 'q') {
            if (onBack) onBack();
        }
    }, [activeIndex, items, selected, onSubmit, onBack]));

    return (
        <Box flexDirection="column">
            {items.map((item, index) => {
                const isActive = index === activeIndex;
                const label = typeof item === 'string' ? item : item.label;
                const val = typeof item === 'string' ? item : item.value;
                const isSelected = selected.has(val);
                const checkbox = isSelected ? '◉' : '○';
                const indicator = isActive ? '❯' : ' ';

                return (
                    <Box key={val}>
                        <Text color={isActive ? '#FF6B35' : '#888888'}>{indicator} </Text>
                        <Text color={isSelected ? '#FFD700' : '#888888'}>{checkbox} </Text>
                        <Text color={isActive ? '#FFFFFF' : '#888888'} bold={isActive}>
                            {label}
                        </Text>
                    </Box>
                );
            })}
            <Box marginTop={1}>
                <Text color="#888888">Space to toggle  •  Enter to confirm  •  Esc to go back</Text>
            </Box>
        </Box>
    );
}
