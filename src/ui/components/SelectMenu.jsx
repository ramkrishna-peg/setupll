import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';

export default function SelectMenu({ items, onSelect, onBack, centered = false }) {
    const [activeIndex, setActiveIndex] = useState(0);

    useInput(useCallback((input, key) => {
        if (key.upArrow) {
            setActiveIndex((prev) => {
                let next = prev > 0 ? prev - 1 : items.length - 1;
                while (items[next]?.disabled && next !== prev) {
                    next = next > 0 ? next - 1 : items.length - 1;
                }
                return next;
            });
        }
        if (key.downArrow) {
            setActiveIndex((prev) => {
                let next = prev < items.length - 1 ? prev + 1 : 0;
                while (items[next]?.disabled && next !== prev) {
                    next = next < items.length - 1 ? next + 1 : 0;
                }
                return next;
            });
        }
        if (key.return) {
            if (items[activeIndex] && !items[activeIndex].disabled) {
                onSelect(items[activeIndex]);
            }
        }
        if (key.escape || input === 'q') {
            if (onBack) onBack();
        }
    }, [activeIndex, items, onSelect, onBack]));

    return (
        <Box flexDirection="column" alignItems={centered ? 'center' : 'flex-start'}>
            {items.map((item, index) => {
                const isActive = index === activeIndex;
                const isDisabled = item.disabled;
                const label = typeof item === 'string' ? item : item.label;

                if (isDisabled) {
                    return (
                        <Box key={`disabled-${index}`} marginTop={index > 0 ? 1 : 0}>
                            <Text color="#888888" bold>{label}</Text>
                        </Box>
                    );
                }

                const indicator = isActive ? '❯ ' : '  ';
                return (
                    <Box key={label}>
                        <Text color={isActive ? '#FF6B35' : '#888888'}>{indicator}</Text>
                        <Text color={isActive ? '#FFFFFF' : '#888888'} bold={isActive}>
                            {label}
                        </Text>
                    </Box>
                );
            })}
        </Box>
    );
}
