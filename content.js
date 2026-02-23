// content.js - YouTube Ad Skipper (Trusted Click via CDP)
//
// Runs in MAIN world. Detects ads and sends skip button coordinates
// to the bridge script which relays them to the background service
// worker for a real trusted click via Chrome Debugger Protocol.

setInterval(() => {
    try {
        const player = document.getElementById('movie_player');
        if (!player) return;

        const isAd = player.classList.contains('ad-showing') ||
            player.classList.contains('ad-interrupting');

        if (!isAd) return;

        // ── WE ARE IN AN AD ── Find the skip button and click it

        const skipButton = document.querySelector(
            '.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, button[id^="skip-button:"]'
        );

        if (skipButton) {
            const rect = skipButton.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                const x = Math.round(rect.left + rect.width / 2);
                const y = Math.round(rect.top + rect.height / 2);

                // Send coordinates to bridge.js via custom DOM event
                window.dispatchEvent(new CustomEvent('adskipper-click', {
                    detail: { x, y }
                }));
            }
        }

    } catch (e) {
        // Fail silently
    }
}, 300);
