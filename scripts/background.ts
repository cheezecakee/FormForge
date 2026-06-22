const appTabs = new Set<number>();

// Cleanup closed job tabs
chrome.tabs.onRemoved.addListener((tabId) => {
    appTabs.delete(tabId);
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'job-site-detected') {
        appTabs.add(sender.tab.id);
    } else if (request.action === 'check-job-site') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            sendResponse({ status: appTabs.has(tabs[0].id) });
        });
        return true;
    }
});
