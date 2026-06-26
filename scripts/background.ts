import { LoadCustomSites, SaveCustomSites } from './storage.ts';

const appTabs = new Set<number>();

chrome.tabs.onRemoved.addListener((tabId) => {
    appTabs.delete(tabId);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'job-site-detected') {
        if (sender.tab?.id !== undefined) {
            appTabs.add(sender.tab.id);
        }
    } else if (request.action === 'check-job-site') {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            const tab = tabs[0];
            const tabId = tab?.id;
            const url = tab?.url ?? '';

            const customSites = await LoadCustomSites();
            const { Websites } = await import('./const.ts');

            const isManifest = Websites.some(domain => url.includes(domain));
            const isCustom = customSites.some(domain => url.includes(domain));

            sendResponse({ status: (isManifest || isCustom) && tabId !== undefined && appTabs.has(tabId) });
        });
        return true;
    } else if (request.action === 'add-site') {
        LoadCustomSites().then(sites => {
            if (!sites.includes(request.domain)) {
                SaveCustomSites([...sites, request.domain]).then(() => {
                    sendResponse({ success: true });
                });
            } else {
                sendResponse({ success: false, reason: 'already exists' });
            }
        });
        return true;
    } else if (request.action === 'remove-site') {
        LoadCustomSites().then(sites => {
            SaveCustomSites(sites.filter(s => s !== request.domain)).then(() => {
                sendResponse({ success: true });
            });
        });
        return true;
    }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'complete' || !tab.url) return;

    const customSites = await LoadCustomSites();
    const isCustomSite = customSites.some(domain => tab.url!.includes(domain));

    if (isCustomSite) {
        try {
            await chrome.scripting.executeScript({
                target: { tabId },
                files: ['dist/content-script.js']
            });
        } catch (e) {
            console.warn('Could not inject content script:', e);
        }
    }
});
