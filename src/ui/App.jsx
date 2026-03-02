import React, { useState, useEffect } from 'react';
import { Box, Text, useStdout } from 'ink';
import { detectOS } from '../system/osDetect.js';
import { isRoot } from '../system/sudoCheck.js';
import MainMenu from './MainMenu.jsx';
import CreateLL from './CreateLL.jsx';
import Manager from './Manager.jsx';
import About from './About.jsx';
import Changelog from './Changelog.jsx';
import SudoWarning from './SudoWarning.jsx';
import HelloScreen from './HelloScreen.jsx';
import HowToGuide from './HowToGuide.jsx';
import StatusBar from './components/StatusBar.jsx';

export default function App() {
    const { stdout } = useStdout();
    const [cols, setCols] = useState(stdout?.columns || 80);
    const [rows, setRows] = useState(stdout?.rows || 24);

    useEffect(() => {
        if (!stdout) return;

        const onResize = () => {
            setCols(stdout.columns || 80);
            setRows(stdout.rows || 24);
        };

        stdout.on('resize', onResize);
        return () => stdout.off('resize', onResize);
    }, [stdout]);

    const os = detectOS();
    const root = isRoot();
    const needsSudo = os === 'linux' && !root;

    const [screen, setScreen] = useState(needsSudo ? 'sudo-warning' : 'main-menu');
    const [sudoSkipped, setSudoSkipped] = useState(false);

    const handleSudoDecision = (decision) => {
        if (decision === 'continue') {
            setSudoSkipped(true);
            setScreen('main-menu');
        } else if (decision === 'exit') {
            process.exit(0);
        }
    };

    const navigate = (target) => setScreen(target);

    const renderScreen = () => {
        switch (screen) {
            case 'sudo-warning':
                return <SudoWarning onDecision={handleSudoDecision} cols={cols} rows={rows} />;
            case 'main-menu':
                return <MainMenu onNavigate={navigate} cols={cols} rows={rows} />;
            case 'hello':
                return <HelloScreen onBack={() => navigate('main-menu')} cols={cols} rows={rows} />;
            case 'how-to':
                return <HowToGuide onBack={() => navigate('main-menu')} cols={cols} rows={rows} />;
            case 'create-lavalink':
                return <CreateLL onBack={() => navigate('main-menu')} cols={cols} rows={rows} />;
            case 'manager':
                return <Manager onBack={() => navigate('main-menu')} cols={cols} rows={rows} />;
            case 'about':
                return <About onBack={() => navigate('main-menu')} cols={cols} rows={rows} />;
            case 'changelog':
                return <Changelog onBack={() => navigate('main-menu')} cols={cols} rows={rows} />;
            default:
                return <MainMenu onNavigate={navigate} cols={cols} rows={rows} />;
        }
    };

    return (
        <Box
            flexDirection="column"
            width={cols}
            height={rows}
            borderStyle="single"
            borderColor="#FF6B35"
        >
            <Box flexDirection="column" flexGrow={1}>
                {renderScreen()}
            </Box>
            {sudoSkipped && (
                <StatusBar
                    message="Running without sudo — some features may not work correctly"
                    type="warning"
                />
            )}
        </Box>
    );
}
