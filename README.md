# YouTube Ad Skip Button Presser

A lightweight, performant Chrome extension that automatically clicks the "Skip Ad" button on YouTube. It uses the Chrome Debugger Protocol (CDP) to dispatch trusted, hardware-level mouse clicks, effectively bypassing ad-blocker detection mechanisms.

## Features
- **Automatic Ad Skipping**: Instantly clicks the "Skip Ad" button as soon as it appears.
- **Trusted Clicks**: Uses CDP to send true `isTrusted=true` mouse events, making the clicks indistinguishable from real user interactions.
- **Fast Execution**: Runs in the `MAIN` world at `document_start` to minimize latency.
- **Easy Toggle**: Includes a sleek popup interface to quickly turn the ad skipper ON or OFF.

## Installation

1. Clone or download this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click on **Load unpacked** and select the directory containing this extension's files.
5. The extension should now be installed and active!

## Usage

- The extension runs automatically in the background on YouTube.
- To toggle the functionality, click the extension icon in your browser toolbar to open the popup and use the toggle switch.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed for **Educational and Personal Use Only**. Commercial use is strictly prohibited. See the [LICENSE](LICENSE) file for more details.
