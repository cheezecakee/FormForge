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

const viewbtn = document.querySelector(".viewbtn");
const viewUrl = "profile/profile.html"

viewbtn?.addEventListener("click", async () => {
    console.log("view profile button clicked");

    const tab = await getActiveExtensionTab(chrome.runtime.id);
    if (tab != null) {
        console.log("Found tab: ", tab);
        if (tab.url === chrome.runtime.getURL(viewUrl)) {
            chrome.tabs.update(tab.id, { active: true });
        } else {
            chrome.tabs.update(tab.id, { active: true, url: chrome.runtime.getURL(viewUrl) });
        }
    } else {
        chrome.tabs.create({ url: chrome.runtime.getURL(viewUrl) })
    }
});

const editbtn = document.querySelector(".editbtn");
const editUrl = "profile/profile.html#edit"

editbtn?.addEventListener("click", async () => {
    console.log("edit button clicked");

    const tab = await getActiveExtensionTab(chrome.runtime.id);
    if (tab != null) {
        console.log("Found tab: ", tab);
        if (tab.url === chrome.runtime.getURL(editUrl)) {
            chrome.tabs.update(tab.id, { active: true });
        } else {
            chrome.tabs.update(tab.id, { active: true, url: chrome.runtime.getURL(editUrl) });
        }
    } else {
        chrome.tabs.create({ url: chrome.runtime.getURL(editUrl) })
    }
});

document.getElementById('version')!.textContent = chrome.runtime.getManifest().version;
