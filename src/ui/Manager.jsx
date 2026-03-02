import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectMenu from './components/SelectMenu.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import { getStatus } from '../manager/status.js';
import { getLogStream, getErrorStream } from '../manager/logs.js';
import { getResources } from '../manager/resources.js';
import { stop as stopLL } from '../manager/stop.js';
import { detectExistingLavalink, hasExistingInstallation } from '../lavalink/detect.js';

const MANAGER_ITEMS = [
    { label: 'Status & Info', value: 'status' },
    { label: 'Restart LavaLink', value: 'restart' },
    { label: 'Stop LavaLink', value: 'stop' },
    { label: 'View Logs', value: 'logs' },
    { label: 'Edit Config (application.yml)', value: 'edit' },
    { label: 'Resource Usage', value: 'resources' },
    { label: 'Detect Existing LavaLink', value: 'detect' },
    { label: 'Back to Main Menu', value: 'back' },
];

function formatUptime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
}

function makeHeader(title, cols) {
    const w = Math.max(10, (cols || 80) - 8);
    const prefix = `─── ${title} `;
    const rest = '─'.repeat(Math.max(0, w - prefix.length));
    return prefix + rest;
}

// ──────────── Status Sub-Screen ────────────
function StatusScreen({ onBack, cols }) {
    const status = getStatus();

    useInput(useCallback((input, key) => {
        if (key.escape || input === 'q') onBack();
    }, [onBack]));

    return (
        <Box flexDirection="column" paddingX={3} paddingTop={2} flexGrow={1}>
            <Text color="#FF6B35" bold>{makeHeader('LavaLink Manager — Status', cols)}</Text>
            <Text>{''}</Text>
            <Box
                flexDirection="column"
                borderStyle="single"
                borderColor="#FF6B35"
                paddingX={2}
                paddingY={1}
            >
                <Text color="#FF6B35" bold> Status </Text>
                <Box>
                    <Text color="#FFD700">{'  Status   :  '}</Text>
                    {status.running ? (
                        <Text color="#00FF00">● Running</Text>
                    ) : (
                        <Text color="#FF0000">● Stopped</Text>
                    )}
                </Box>
                <Box>
                    <Text color="#FFD700">{'  Uptime   :  '}</Text>
                    <Text color="#FFFFFF">{status.running ? formatUptime(status.uptime) : 'N/A'}</Text>
                </Box>
                <Box>
                    <Text color="#FFD700">{'  PID      :  '}</Text>
                    <Text color="#FFFFFF">{status.pid || 'N/A'}</Text>
                </Box>
                <Box>
                    <Text color="#FFD700">{'  Mode     :  '}</Text>
                    <Text color="#FFFFFF">Local</Text>
                </Box>
            </Box>
            <Text>{''}</Text>
            <Text color="#888888">  [ESC] Back to Manager</Text>
        </Box>
    );
}

// ──────────── Logs Sub-Screen ────────────
function LogsScreen({ onBack, cols }) {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const stdout = getLogStream();
        const stderr = getErrorStream();

        const handleData = (data) => {
            const lines = data.toString().split('\n').filter(Boolean);
            setLogs((prev) => [...prev.slice(-50), ...lines]);
        };

        stdout?.on('data', handleData);
        stderr?.on('data', handleData);

        return () => {
            stdout?.removeListener('data', handleData);
            stderr?.removeListener('data', handleData);
        };
    }, []);

    useInput(useCallback((input, key) => {
        if (key.escape || input === 'q') onBack();
    }, [onBack]));

    const colorLogLine = (line) => {
        if (line.includes('[ERROR]') || line.includes('ERROR')) return '#FF0000';
        if (line.includes('[WARN]') || line.includes('WARN')) return '#FFD700';
        if (line.includes('[INFO]') || line.includes('INFO')) return '#00FF00';
        return '#FFFFFF';
    };

    return (
        <Box flexDirection="column" paddingX={3} paddingTop={2} flexGrow={1}>
            <Text color="#FF6B35" bold>{makeHeader('LavaLink Manager — Live Logs', cols)}</Text>
            <Text>{''}</Text>
            <Box
                flexDirection="column"
                borderStyle="single"
                borderColor="#FF6B35"
                paddingX={2}
                paddingY={1}
                height={16}
            >
                <Text color="#FF6B35" bold> Live Logs </Text>
                {logs.length === 0 ? (
                    <Text color="#888888">  Waiting for log output...</Text>
                ) : (
                    logs.slice(-12).map((line, i) => (
                        <Text key={i} color={colorLogLine(line)}>
                            {'  '}{line}
                        </Text>
                    ))
                )}
            </Box>
            <Text>{''}</Text>
            <Text color="#888888">  Live scrolling. Press Q to stop viewing.</Text>
        </Box>
    );
}

// ──────────── Resources Sub-Screen ────────────
function ResourcesScreen({ onBack, cols }) {
    const [res, setRes] = useState(null);

    useEffect(() => {
        let active = true;

        const fetch = async () => {
            try {
                const data = await getResources();
                if (active) setRes(data);
            } catch {
                // ignore
            }
        };

        fetch();
        const interval = setInterval(fetch, 2000);
        return () => {
            active = false;
            clearInterval(interval);
        };
    }, []);

    useInput(useCallback((input, key) => {
        if (key.escape || input === 'q') onBack();
    }, [onBack]));

    return (
        <Box flexDirection="column" paddingX={3} paddingTop={2} flexGrow={1}>
            <Text color="#FF6B35" bold>{makeHeader('LavaLink Manager — Resource Usage', cols)}</Text>
            <Text>{''}</Text>
            <Box
                flexDirection="column"
                borderStyle="single"
                borderColor="#FF6B35"
                paddingX={2}
                paddingY={1}
            >
                <Text color="#FF6B35" bold> Resource Usage </Text>
                <Text>{''}</Text>
                {res ? (
                    <>
                        <ProgressBar label="CPU " percent={res.cpuPercent} />
                        <ProgressBar
                            label="RAM "
                            percent={res.memPercent}
                            detail={`${res.usedGB} GB / ${res.totalGB} GB`}
                        />
                        <ProgressBar label="Disk" percent={res.diskPercent} />
                        <Box><Text color="#FFD700">{'Net ↑  '}</Text><Text color="#FFFFFF">{res.netUp}</Text></Box>
                        <Box><Text color="#FFD700">{'Net ↓  '}</Text><Text color="#FFFFFF">{res.netDown}</Text></Box>
                    </>
                ) : (
                    <Text color="#888888">  Loading...</Text>
                )}
            </Box>
            <Text>{''}</Text>
            <Text color="#888888">  Auto-refreshes every 2 seconds. Press Q to go back.</Text>
        </Box>
    );
}

// ──────────── Detect Sub-Screen ────────────
function DetectScreen({ onBack, cols }) {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        detectExistingLavalink().then((res) => {
            if (mounted) {
                setResults(res);
                setLoading(false);
            }
        });
        return () => { mounted = false; };
    }, []);

    useInput(useCallback((input, key) => {
        if (key.escape || input === 'q') onBack();
    }, [onBack]));

    return (
        <Box flexDirection="column" paddingX={3} paddingTop={2} flexGrow={1}>
            <Text color="#FF6B35" bold>{makeHeader('System Detection', cols)}</Text>
            <Text>{''}</Text>

            <Box flexDirection="column" borderStyle="single" borderColor="#FF6B35" paddingX={2} paddingY={1}>
                {loading ? (
                    <Text color="#888888">  Scanning system...</Text>
                ) : !hasExistingInstallation(results) ? (
                    <Text color="#888888">  No existing LavaLink installations found.</Text>
                ) : (
                    <Box flexDirection="column">
                        {results.processes.length > 0 && (
                            <Box flexDirection="column" marginBottom={1}>
                                <Text color="#FFD700" bold>  Running Processes</Text>
                                {results.processes.map((p, i) => (
                                    <Text key={i} color="#FFFFFF">    • PID {p.pid} (CPU: {p.cpu}, RAM: {p.mem})</Text>
                                ))}
                            </Box>
                        )}
                        {results.containers.length > 0 && (
                            <Box flexDirection="column" marginBottom={1}>
                                <Text color="#FFD700" bold>  Docker Containers</Text>
                                {results.containers.map((c, i) => (
                                    <Text key={i} color="#FFFFFF">    • {c.name} ({c.status}) - {c.ports}</Text>
                                ))}
                            </Box>
                        )}
                        {results.jarFiles.length > 0 && (
                            <Box flexDirection="column" marginBottom={1}>
                                <Text color="#FFD700" bold>  JAR Files Found</Text>
                                {results.jarFiles.map((f, i) => (
                                    <Text key={i} color="#FFFFFF">    • {f.path} ({f.size})</Text>
                                ))}
                            </Box>
                        )}
                        {results.configs.length > 0 && (
                            <Box flexDirection="column" marginBottom={0}>
                                <Text color="#FFD700" bold>  Configurations Found</Text>
                                {results.configs.map((c, i) => (
                                    <Text key={i} color="#FFFFFF">    • {c.path} (Port: {c.port})</Text>
                                ))}
                            </Box>
                        )}
                    </Box>
                )}
            </Box>

            <Text>{''}</Text>
            <Text color="#888888">  Press Q to go back.</Text>
        </Box>
    );
}

// ──────────── Manager Root ────────────
export default function Manager({ onBack, cols, rows }) {
    const [subScreen, setSubScreen] = useState(null);
    const [message, setMessage] = useState(null);

    const handleSelect = (item) => {
        switch (item.value) {
            case 'status':
                setSubScreen('status');
                break;
            case 'logs':
                setSubScreen('logs');
                break;
            case 'resources':
                setSubScreen('resources');
                break;
            case 'detect':
                setSubScreen('detect');
                break;
            case 'restart':
                setMessage({ text: 'Restart initiated. Please re-launch via Create LavaLink.', type: 'warning' });
                break;
            case 'stop':
                stopLL();
                setMessage({ text: 'LavaLink stopped.', type: 'success' });
                break;
            case 'edit':
                setMessage({ text: 'Edit Config: Open ./application.yml in your editor.', type: 'info' });
                break;
            case 'back':
                onBack();
                break;
        }
    };

    if (subScreen === 'status') return <StatusScreen onBack={() => setSubScreen(null)} cols={cols} />;
    if (subScreen === 'logs') return <LogsScreen onBack={() => setSubScreen(null)} cols={cols} />;
    if (subScreen === 'resources') return <ResourcesScreen onBack={() => setSubScreen(null)} cols={cols} />;
    if (subScreen === 'detect') return <DetectScreen onBack={() => setSubScreen(null)} cols={cols} />;

    return (
        <Box flexDirection="column" paddingX={3} paddingTop={2} flexGrow={1}>
            <Text color="#FF6B35" bold>{makeHeader('LavaLink Manager', cols)}</Text>
            <Text>{''}</Text>
            <SelectMenu
                items={MANAGER_ITEMS}
                onSelect={handleSelect}
                onBack={onBack}
            />
            {message && (
                <>
                    <Text>{''}</Text>
                    <Box borderStyle="single" borderColor={message.type === 'success' ? 'green' : message.type === 'warning' ? 'yellow' : '#FF6B35'} paddingX={2} paddingY={0}>
                        <Text color={message.type === 'success' ? '#00FF00' : message.type === 'warning' ? '#FFD700' : '#FFFFFF'}>
                            {message.text}
                        </Text>
                    </Box>
                </>
            )}
        </Box>
    );
}
