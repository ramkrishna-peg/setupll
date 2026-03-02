import esbuild from 'esbuild';

await esbuild.build({
    entryPoints: ['src/ui/App.jsx'],
    bundle: true,
    outfile: 'dist/app.js',
    platform: 'node',
    format: 'esm',
    target: 'node18',
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    external: [
        'systeminformation',
        'ink',
        'ink-text-input',
        'ink-spinner',
        'react',
        'execa',
        'chalk',
        'js-yaml',
        'figlet',
        'boxen',
        'open',
    ],
    banner: {
        js: '// Built by setupll build script',
    },
});

console.log('✓ Build complete → dist/app.js');
