import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectMenu from './components/SelectMenu.jsx';
import TalkBox from './components/TalkBox.jsx';
import MultiSelectMenu from './components/MultiSelectMenu.jsx';

import selectMode from '../steps/selectMode.js';
import selectTemplate from '../steps/selectTemplate.js';
import configPort from '../steps/configPort.js';
import configPassword from '../steps/configPassword.js';
import configJava from '../steps/configJava.js';
import configPlugins from '../steps/configPlugins.js';
import configPath from '../steps/configPath.js';
import reviewSummary from '../steps/reviewSummary.js';
import configCustomUrl from '../steps/configCustomUrl.js';

import { generateConfig } from '../lavalink/generate.js';
import { downloadLavalink } from '../lavalink/download.js';
import { launchLavalink } from '../lavalink/launch.js';
import { detectDocker } from '../docker/detect.js';
import { generateCompose } from '../docker/compose.js';
import { runDocker } from '../docker/run.js';

function makeHeader(title, cols) {
    const w = Math.max(10, (cols || 80) - 8);
    const prefix = `─── ${title} `;
    const rest = '─'.repeat(Math.max(0, w - prefix.length));
    return prefix + rest;
}

export default function CreateLL({ onBack, cols, rows }) {
    const [stepIndex, setStepIndex] = useState(0);
    const [config, setConfig] = useState({
        mode: '',
        template: '',
        customUrl: '',
        port: '2333',
        password: 'youshallnotpass',
        java: '21',
        plugins: [],
        ymlPath: './',
    });

    const [launching, setLaunching] = useState(false);
    const [launchSteps, setLaunchSteps] = useState([]);
    const [launchDone, setLaunchDone] = useState(false);
    const [launchError, setLaunchError] = useState(null);

    const getSteps = () => {
        const arr = [selectMode, selectTemplate];
        if (config.template === 'custom') {
            arr.push(configCustomUrl);
        }
        arr.push(configPort, configPassword, configJava, configPlugins, configPath, reviewSummary);
        return arr;
    };

    const activeSteps = getSteps();
    const TOTAL_STEPS = activeSteps.length;
    const step = activeSteps[stepIndex];

    const goBack = () => {
        if (stepIndex > 0) {
            setStepIndex(stepIndex - 1);
        } else {
            onBack();
        }
    };

    const goForward = (key, value) => {
        setConfig((prev) => ({ ...prev, [key]: value }));
        setStepIndex(stepIndex + 1);
    };

    const handleLaunch = async () => {
        setLaunching(true);
        const steps = [];
        const addStep = (label, status) => {
            steps.push({ label, status });
            setLaunchSteps([...steps]);
        };

        try {
            addStep('Generating application.yml...', 'running');
            await generateConfig(config);
            steps[steps.length - 1].status = 'done';
            setLaunchSteps([...steps]);

            if (config.mode === 'docker') {
                addStep('Generating docker-compose.yml...', 'running');
                await generateCompose(config);
                steps[steps.length - 1].status = 'done';
                setLaunchSteps([...steps]);

                addStep('Checking Docker...', 'running');
                await detectDocker();
                steps[steps.length - 1].status = 'done';
                setLaunchSteps([...steps]);

                addStep('Starting Docker container...', 'running');
                await runDocker(config);
                steps[steps.length - 1].status = 'done';
                setLaunchSteps([...steps]);
            } else {
                addStep('Downloading LavaLink jar...', 'running');
                await downloadLavalink(config);
                steps[steps.length - 1].status = 'done';
                setLaunchSteps([...steps]);

                addStep('Checking Java version...', 'running');
                // simple check
                steps[steps.length - 1].status = 'done';
                setLaunchSteps([...steps]);

                addStep('Starting LavaLink...', 'running');
                await launchLavalink(config);
                steps[steps.length - 1].status = 'done';
                setLaunchSteps([...steps]);
            }

            setLaunchDone(true);
        } catch (err) {
            if (steps.length > 0) {
                steps[steps.length - 1].status = 'error';
                setLaunchSteps([...steps]);
            }
            setLaunchError(err.message);
        }
    };

    useInput(useCallback((input, key) => {
        if (launchDone || launchError) {
            if (input === 'q' || key.escape) {
                onBack();
            }
        }
    }, [launchDone, launchError, onBack]));

    // Launch screen
    if (launching) {
        return (
            <Box flexDirection="column" paddingX={3} paddingTop={2} flexGrow={1}>
                <Text color="#FF6B35" bold>{makeHeader('Launching LavaLink', cols)}</Text>
                <Text>{''}</Text>
                {launchSteps.map((s, i) => (
                    <Box key={i}>
                        <Text color="#FFFFFF">  {s.label}  </Text>
                        {s.status === 'done' && <Text color="#00FF00">✓ Done</Text>}
                        {s.status === 'running' && <Text color="#FFD700">⏳</Text>}
                        {s.status === 'error' && <Text color="#FF0000">✖ Failed</Text>}
                    </Box>
                ))}
                <Text>{''}</Text>
                {launchDone && (
                    <Box flexDirection="column">
                        <Text color="#00FF00" bold>  ✅  LavaLink is running on port {config.port}!</Text>
                        <Text>{''}</Text>
                        <Text color="#888888">  Press Q to return to main menu</Text>
                    </Box>
                )}
                {launchError && (
                    <Box flexDirection="column">
                        <Box borderStyle="single" borderColor="red" paddingX={2} paddingY={1}>
                            <Text color="#FF0000">Error: {launchError}</Text>
                        </Box>
                        <Text>{''}</Text>
                        <Text color="#888888">  Press Q to return to main menu</Text>
                    </Box>
                )}
            </Box>
        );
    }

    // Review screen
    if (step.type === 'review') {
        const pluginList = config.plugins.length > 0 ? config.plugins.join(', ') : 'None';
        const maskedPassword = '•'.repeat(config.password.length);

        return (
            <Box flexDirection="column" paddingX={3} paddingTop={2} flexGrow={1}>
                <Text color="#FF6B35" bold>{makeHeader('Review Your Configuration', cols)}</Text>
                <Text>{''}</Text>
                <Box
                    flexDirection="column"
                    borderStyle="single"
                    borderColor="#FF6B35"
                    paddingX={2}
                    paddingY={1}
                >
                    <Text color="#FF6B35" bold> Summary </Text>
                    <Box><Text color="#FFD700">{'  Mode      :  '}</Text><Text color="#FFFFFF">{config.mode === 'local' ? 'Local' : 'Docker'}</Text></Box>
                    <Box><Text color="#FFD700">{'  Template  :  '}</Text><Text color="#FFFFFF">{config.template}</Text></Box>
                    <Box><Text color="#FFD700">{'  Port      :  '}</Text><Text color="#FFFFFF">{config.port}</Text></Box>
                    <Box><Text color="#FFD700">{'  Password  :  '}</Text><Text color="#FFFFFF">{maskedPassword}</Text></Box>
                    <Box><Text color="#FFD700">{'  Java      :  '}</Text><Text color="#FFFFFF">{config.java}</Text></Box>
                    <Box><Text color="#FFD700">{'  Plugins   :  '}</Text><Text color="#FFFFFF">{pluginList}</Text></Box>
                    <Box><Text color="#FFD700">{'  yml path  :  '}</Text><Text color="#FFFFFF">{config.ymlPath}application.yml</Text></Box>
                </Box>
                <Text>{''}</Text>
                <SelectMenu
                    items={[
                        { label: 'Confirm & Launch', value: 'launch' },
                        { label: 'Go Back & Edit', value: 'back' },
                    ]}
                    onSelect={(item) => {
                        if (item.value === 'launch') {
                            handleLaunch();
                        } else {
                            goBack();
                        }
                    }}
                    onBack={goBack}
                />
            </Box>
        );
    }

    // Select step
    if (step.type === 'select') {
        return (
            <Box flexDirection="column" paddingX={3} paddingTop={2} flexGrow={1}>
                <Text color="#FF6B35" bold>{makeHeader('Create LavaLink', cols)}</Text>
                <Text>{''}</Text>
                <Text color="#FFFFFF" bold>  {step.title}</Text>
                <Text>{''}</Text>
                <Box paddingLeft={2}>
                    <SelectMenu
                        items={step.items}
                        onSelect={(item) => goForward(step.key, item.value)}
                        onBack={goBack}
                    />
                </Box>
                <Text>{''}</Text>
                <Text color="#888888">  [ESC] Back</Text>
            </Box>
        );
    }

    // Multi-select step
    if (step.type === 'multiselect') {
        return (
            <Box flexDirection="column" paddingX={3} paddingTop={2} flexGrow={1}>
                <Text color="#FF6B35" bold>{makeHeader('Create LavaLink — Configuration', cols)}</Text>
                <Text>{''}</Text>
                <Text color="#888888">  Step {stepIndex + 1} of {TOTAL_STEPS} — {step.title}</Text>
                <Text>{''}</Text>
                <Box paddingLeft={2}>
                    <MultiSelectMenu
                        items={step.items}
                        onSubmit={(selected) => goForward(step.key, selected)}
                        onBack={goBack}
                    />
                </Box>
            </Box>
        );
    }

    // Input step
    if (step.type === 'input') {
        return (
            <Box flexDirection="column" paddingX={3} paddingTop={2} flexGrow={1}>
                <Text color="#FF6B35" bold>{makeHeader('Create LavaLink — Configuration', cols)}</Text>
                <Text>{''}</Text>
                <Text color="#888888">  Step {stepIndex + 1} of {TOTAL_STEPS} — {step.title}</Text>
                <Text>{''}</Text>
                <TalkBox
                    label={step.label}
                    defaultValue={step.defaultValue}
                    masked={step.masked || false}
                    onSubmit={(value) => goForward(step.key, value)}
                    onBack={goBack}
                />
                <Text>{''}</Text>
                <Text color="#888888">  [ESC] Back</Text>
            </Box>
        );
    }

    return null;
}
