// bridge.js - Runs in ISOLATED world to relay messages from MAIN world to background
//
// The MAIN world content script can't access chrome.runtime APIs.
// This bridge script listens for custom DOM events from the MAIN world script
// and forwards them to the background service worker via chrome.runtime.sendMessage.

window.addEventListener('adskipper-click', (event) => {
    const { x, y } = event.detail;

    chrome.runtime.sendMessage(
        { action: 'trustedClick', x: x, y: y },
        (response) => {
            if (response && response.success) {
                // Signal back to the MAIN world that the click succeeded
                window.dispatchEvent(new CustomEvent('adskipper-click-done'));
            }
        }
    );
});
