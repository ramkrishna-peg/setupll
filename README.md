# SetupLL

> "Because writing application.yml by hand is a form of cruel and unusual punishment."

![Version](https://img.shields.io/badge/version-1.0.0-FF6B35)
![License](https://img.shields.io/badge/license-MIT-blue)

SetupLL is an all-in-one, unapologetically terminal-based utility designed to make setting up and managing LavaLink servers slightly less painful. Whether you are tired of wrestling with Java versions, forgetting the Docker flags, or just want a sleek, emoji-free interface to boot your musicbot backend, you have come to the right place.

## Why use this?

Look, LavaLink is great. We all love Lavaplayer. But deploying it? 
You have to hunt down the latest `.jar`, make sure your Java runtime isn't from the stone age, write a YAML configuration that breaks if you look at it wrong, and figure out how to parse your client secrets into the plugin block without ruining the indentation. 

SetupLL replaces that entire saga with a few arrow-key presses. 

## Installation

Do you have Node installed? Good.

```bash
npm install -g setupll
```

## Usage

Once installed globally, you can summon the tool from anywhere. 

```bash
setupll
```

(Note: If you run this in `/`, it will probably ask for sudo to not break your file system. Please run it somewhere sensible like `~/projects/my-cool-bot/`.)

## What is in the box?

- **Zero-YAML wizardry**: We generate the `application.yml` for you. We even have templates for things like "Spotify Only", "Maximum Performance", and "Please do not eat all my RAM".
- **Docker vs Local**: Pick your poison. SetupLL can download the raw `.jar` and run it on bare metal, or spin up an isolated Docker container so you don't have to pollute your host OS with Java.
- **The Manager**: Once your node is running, the Manager screen gives you a live dashboard. You get real-time CPU, RAM, and Network I/O metrics, completely live log streams, and the power to violently restart or stop the node with a single click.
- **System Detection**: It automatically scans your computer to find rogue Java processes or forgotten Docker containers hoarding port 2333.
- **Custom URLs**: Found a really cool `application.yml` on a random GitHub gist? Feed the Raw URL to SetupLL when you pick the "Custom" template, and it will pull it down for you.

## The Screens

- **Main Menu**: The gateway to everything.
- **Create LavaLink**: The interview where we ask you for a port and a password and pretend we are doing hard work in the background.
- **Manager**: The command center. Shows your logs, your resource hogs, and gives you the big red stop button.
- **How-To Guide**: A built-in manual right inside the terminal, so you do not even have to look at this README.

## Development

If you want to contribute, or just want to see how much React we managed to shove into a command line interface using Ink:

```bash
git clone https://github.com/ramkrishna-peg/setupll.git
cd setupll
npm install
npm run build
npm start
```

## Author

Ramkrishna

## License

MIT License. Do whatever you want with it. Fork it, break it, use it to power a 24/7 lo-fi hip hop radio station on a dusty Raspberry Pi. We take no responsibility for any resulting auditory anomalies. Read the full `LICENSE` file if you are into legal jargon.
