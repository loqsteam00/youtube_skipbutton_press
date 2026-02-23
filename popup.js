document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggle');
    const statusText = document.getElementById('status');

    function updateUI(isEnabled) {
        toggle.checked = isEnabled;
        statusText.textContent = isEnabled ? 'ON' : 'OFF';
        statusText.style.color = isEnabled ? '#4CAF50' : '#F44336';

        chrome.action.setBadgeText({ text: isEnabled ? 'ON' : 'OFF' });
        chrome.action.setBadgeBackgroundColor({ color: isEnabled ? '#4CAF50' : '#F44336' });
    }

    // Load initial state
    chrome.storage.local.get(['enabled'], (result) => {
        const isEnabled = result.enabled !== undefined ? result.enabled : true;
        updateUI(isEnabled);
    });

    // Handle toggle changes
    toggle.addEventListener('change', (e) => {
        const isEnabled = e.target.checked;
        chrome.storage.local.set({ enabled: isEnabled }, () => {
            updateUI(isEnabled);
        });
    });
});
