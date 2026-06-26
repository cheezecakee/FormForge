async function getActiveExtensionTab(extensionId: string) {
    const tabs = await chrome.tabs.query(
        {
            url: `chrome-extension://${extensionId}/*`
        });

    return tabs[0] || null;
}

const statusDot = document.getElementById('status-dot');

chrome.runtime.sendMessage({ action: "check-job-site" }, (response) => {
    if (!statusDot) return;

    statusDot?.classList.add(
        response?.status ? 'online' : 'offline'
    );
});

const profilebtn = document.querySelector(".profilebtn");
const viewUrl = "profile/profile.html"

profilebtn?.addEventListener("click", async () => {
    // console.log("view profile button clicked");

    const tab = await getActiveExtensionTab(chrome.runtime.id);
    if (tab != null) {
        // console.log("Found tab: ", tab);
        if (tab.url === chrome.runtime.getURL(viewUrl)) {
            chrome.tabs.update(tab.id, { active: true });
        } else {
            chrome.tabs.update(tab.id, { active: true, url: chrome.runtime.getURL(viewUrl) });
        }
    } else {
        chrome.tabs.create({ url: chrome.runtime.getURL(viewUrl) })
    }
});

const sitebtn = document.querySelector(".sitebtn");

const getCurrentTab = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0] || null;
};

const getDomain = (url: string): string => {
    return new URL(url).hostname;
};

// Set button label on load
const initSiteBtn = async () => {
    const tab = await getCurrentTab();
    if (!tab?.url || tab.url.startsWith('chrome')) {
        sitebtn?.setAttribute('disabled', 'true');
        return;
    }

    const domain = getDomain(tab.url);
    const customSites = await new Promise<string[]>((resolve) => {
        chrome.storage.local.get(['customSites'], (result) => {
            resolve((result.customSites as string[]) ?? []);
        });
    });

    const isCustom = customSites.includes(domain);
    if (sitebtn) sitebtn.textContent = isCustom ? 'Remove' : 'Add';
};

sitebtn?.addEventListener('click', async () => {
    const tab = await getCurrentTab();
    if (!tab?.url || !tab.id) return;

    const domain = getDomain(tab.url);
    const isAdd = sitebtn.textContent === 'Add';

    chrome.runtime.sendMessage(
        { action: isAdd ? 'add-site' : 'remove-site', domain },
        () => {
            chrome.tabs.reload(tab.id!);
            window.close();
        }
    );
});

initSiteBtn();

document.getElementById('version')!.textContent = chrome.runtime.getManifest().version;
