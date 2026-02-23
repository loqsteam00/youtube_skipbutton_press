// background.js - Service Worker for Chrome Debugger Protocol clicks
//
// This service worker receives messages from the content script with 
// the coordinates of the skip button. It then uses chrome.debugger 
// to attach to the tab and send a real, hardware-level mouse click
// that has isTrusted = true, which YouTube cannot distinguish from
// a real user click.

function updateBadge(isEnabled) {
    chrome.action.setBadgeText({ text: isEnabled ? 'ON' : 'OFF' });
    chrome.action.setBadgeBackgroundColor({ color: isEnabled ? '#4CAF50' : '#F44336' });
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['enabled'], (result) => {
        const isEnabled = result.enabled !== undefined ? result.enabled : true;
        updateBadge(isEnabled);
        chrome.storage.local.set({ enabled: isEnabled });
    });
});

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.get(['enabled'], (result) => {
        const isEnabled = result.enabled !== undefined ? result.enabled : true;
        updateBadge(isEnabled);
    });
});



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action !== 'trustedClick' || !sender.tab) return;

    chrome.storage.local.get(['enabled'], (result) => {
        const isEnabled = result.enabled !== undefined ? result.enabled : true;
        if (!isEnabled) {
            sendResponse({ success: false });
            return;
        }

        const tabId = sender.tab.id;
        const { x, y } = message;

        // Attach the debugger to the tab
        chrome.debugger.attach({ tabId }, '1.3', () => {
            if (chrome.runtime.lastError) {
                console.error('[AdSkipper BG] Attach failed:', chrome.runtime.lastError.message);
                sendResponse({ success: false });
                return;
            }

            // Send mousePressed event (mousedown)
            chrome.debugger.sendCommand(
                { tabId },
                'Input.dispatchMouseEvent',
                {
                    type: 'mousePressed',
                    x: x,
                    y: y,
                    button: 'left',
                    clickCount: 1
                },
                () => {
                    // Send mouseReleased event (mouseup + click)
                    chrome.debugger.sendCommand(
                        { tabId },
                        'Input.dispatchMouseEvent',
                        {
                            type: 'mouseReleased',
                            x: x,
                            y: y,
                            button: 'left',
                            clickCount: 1
                        },
                        () => {
                            // Detach debugger immediately to hide the yellow bar ASAP
                            chrome.debugger.detach({ tabId }, () => {
                                sendResponse({ success: true });
                            });
                        }
                    );
                }
            );
        });
    });

    // Return true to indicate we will send the response asynchronously
    return true;
});
