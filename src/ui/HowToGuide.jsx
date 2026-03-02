import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';

export default function HowToGuide({ onBack, cols }) {
    const w = Math.max(10, (cols || 80) - 8);
    const prefix = '─── How-To Guide ';
    const header = prefix + '─'.repeat(Math.max(0, w - prefix.length));
    const innerW = Math.max(10, w - 6);

    const [page, setPage] = useState(0);

    const pages = [
        // Page 1: Introduction
        () => (
            <Box flexDirection="column" borderStyle="round" borderColor="#00BFFF" paddingX={2} paddingY={1} minHeight={16}>
                <Text color="#00BFFF" bold>  PAGE 1: INTRODUCTION  </Text>
                <Text color="#00BFFF">  {'─'.repeat(Math.min(40, innerW))}</Text>
                <Text>{''}</Text>
                <Text color="#FFFFFF">  SetupLL exists because writing application.yml by hand is a form of</Text>
                <Text color="#FFFFFF">  cruel and unusual punishment. We all love Lavaplayer, but deploying</Text>
                <Text color="#FFFFFF">  it usually involves hunting down jars, fighting Java versions, and</Text>
                <Text color="#FFFFFF">  ruining YAML indentation.</Text>
                <Text>{''}</Text>
                <Text color="#FFFFFF">  Before SetupLL, you had to do everything manually and hope your</Text>
                <Text color="#FFFFFF">  bot didn't spontaneously combust on startup.</Text>
                <Text>{''}</Text>
                <Text color="#FFFFFF">  Now? Just run the <Text color="#FF6B35" bold>Create LavaLink</Text> wizard, answer some questions</Text>
                <Text color="#FFFFFF">  like it is a sketchy personality test, and click Launch. We handle</Text>
                <Text color="#FFFFFF">  the rest.</Text>
            </Box>
        ),
        // Page 2: Local vs Docker
        () => (
            <Box flexDirection="column" borderStyle="round" borderColor="#32CD32" paddingX={2} paddingY={1} minHeight={16}>
                <Text color="#32CD32" bold>  PAGE 2: LOCAL vs. DOCKER  </Text>
                <Text color="#32CD32">  {'─'.repeat(Math.min(40, innerW))}</Text>
                <Text>{''}</Text>
                <Text color="#FFFFFF">  Pick your poison during creation: Local or Docker.</Text>
                <Text>{''}</Text>
                <Text color="#FFD700" bold>  Local Mode (Bare-Metal):</Text>
                <Text color="#FFFFFF">    We yank Lavalink.jar right onto your drive and run it using</Text>
                <Text color="#FFFFFF">    whatever Java version you have lying around. It's fast, has no overhead,</Text>
                <Text color="#FFFFFF">    but yes, you do actually have to install Java.</Text>
                <Text>{''}</Text>
                <Text color="#FFD700" bold>  Docker Mode:</Text>
                <Text color="#FFFFFF">    Don't want to pollute your OS with Java? Valid. We'll generate a</Text>
                <Text color="#FFFFFF">    docker-compose.yml and spin up the official container like magic.</Text>
                <Text color="#FFFFFF">    It runs in an isolated little box where nothing can hurt it.</Text>
            </Box>
        ),
        // Page 3: Templates
        () => (
            <Box flexDirection="column" borderStyle="round" borderColor="#FF69B4" paddingX={2} paddingY={1} minHeight={16}>
                <Text color="#FF69B4" bold>  PAGE 3: TEMPLATES & CUSTOM URLs  </Text>
                <Text color="#FF69B4">  {'─'.repeat(Math.min(40, innerW))}</Text>
                <Text>{''}</Text>
                <Text color="#FFFFFF">  We baked in 15+ templates so you don't have to think. From "Spotify Only"</Text>
                <Text color="#FFFFFF">  to "Please do not eat all my RAM", we have a config for you.</Text>
                <Text>{''}</Text>
                <Text color="#FFD700" bold>  Custom Template URLs:</Text>
                <Text color="#FFFFFF">    Found an artisanal application.yml on a random GitHub gist?</Text>
                <Text color="#FFFFFF">    Select <Text color="#FF6B35">Custom (from templates/)</Text> and feed us the Raw URL.</Text>
                <Text>{''}</Text>
                <Text color="#FFFFFF">    SetupLL will download it, tear it apart, and overwrite the</Text>
                <Text color="#FFFFFF">    port/password with whatever you told the wizard to use, entirely</Text>
                <Text color="#FFFFFF">    against the gist author's will.</Text>
            </Box>
        ),
        // Page 4: Manager
        () => (
            <Box flexDirection="column" borderStyle="round" borderColor="#FFA500" paddingX={2} paddingY={1} minHeight={16}>
                <Text color="#FFA500" bold>  PAGE 4: THE MANAGER  </Text>
                <Text color="#FFA500">  {'─'.repeat(Math.min(40, innerW))}</Text>
                <Text>{''}</Text>
                <Text color="#FFFFFF">  The <Text color="#FF4500" bold>Manager</Text> screen is your command center.</Text>
                <Text>{''}</Text>
                <Text color="#FFFFFF">    • <Text color="#FFD700">Detect Existing</Text>: Scans for rogue jars hoarding port 2333.</Text>
                <Text color="#FFFFFF">    • <Text color="#FFD700">View Logs</Text>: Watch the Java logs zoom by in real time.</Text>
                <Text color="#FFFFFF">    • <Text color="#FFD700">Resource Usage</Text>: A live dashboard to watch LavaLink eat your RAM.</Text>
                <Text color="#FFFFFF">    • <Text color="#FFD700">Stop LavaLink</Text>: The big red button. Violently terminates the node.</Text>
                <Text>{''}</Text>
                <Text color="#888888">  Pro Tip: Run SetupLL from the exact directory you installed</Text>
                <Text color="#888888">  your server in, otherwise it won't be able to find it.</Text>
            </Box>
        )
    ];

    useInput(useCallback((input, key) => {
        if (key.escape || input === 'q') {
            onBack();
            return;
        }
        if (key.rightArrow || input === 'n') {
            setPage(p => Math.min(pages.length - 1, p + 1));
        }
        if (key.leftArrow || input === 'p') {
            setPage(p => Math.max(0, p - 1));
        }
    }, [onBack, pages.length]));

    return (
        <Box flexDirection="column" paddingX={3} paddingTop={1} flexGrow={1}>
            <Text color="#FF6B35" bold>{header}</Text>
            <Text>{''}</Text>

            {/* Render the current page */}
            {pages[page]()}

            <Text>{''}</Text>
            <Box width="100%" justifyContent="space-between">
                <Text color="#888888">{page > 0 ? '← [Left] Prev' : '             '}</Text>
                <Text color="#FFFFFF" bold>Page {page + 1} of {pages.length}</Text>
                <Text color="#888888">{page < pages.length - 1 ? '[Right] Next →' : '              '}</Text>
            </Box>
            <Text>{''}</Text>
            <Text color="#888888">  [ESC / Q] Back to Main Menu</Text>
        </Box>
    );
}
