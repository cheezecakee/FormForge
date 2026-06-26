import { routes } from './routes.ts';
import { saveForm, initEdit } from './form.ts';
import { initView } from './view.ts';
import { initHelp } from './help.ts';
import { initSites } from './sites.ts';

import { ClearProfile } from './storage.ts';

const locationHandler = async () => {
    let location = window.location.hash.replace("#", "");
    if (location.length == 0) location = "/";

    const route = (routes as Record<string, { template: string; title: string }>)[location];
    if (!route) return;

    const html = await fetch(chrome.runtime.getURL(route.template)).then(r => r.text());
    document.getElementById("content")!.innerHTML = html;
    document.title = route.title;

    if (location === '/') await initView();
    if (location === 'edit') await initEdit();
    if (location === 'help') await initHelp();
    if (location === 'sites') await initSites();

    const tablinks = document.querySelectorAll(".tabbtn");
    tablinks.forEach(btn => {
        btn.addEventListener("click", (evt) => {
            const tabcontent = document.getElementsByClassName("tab-content");
            for (let i = 0; i < tabcontent.length; i++) {
                (tabcontent[i] as HTMLElement).style.display = "none";
            }
            const tabs = document.getElementsByClassName("tabbtn");
            for (let i = 0; i < tabs.length; i++) {
                const tab = tabs[i];
                if (tab) tab.className = tab.className.replace(" active", "");
            }
            const formName = (evt.currentTarget as HTMLElement).dataset.tab;
            document.getElementById(formName!)!.style.display = "block";
            (evt.currentTarget as HTMLElement).className += " active";
        });
    });

    const button = document.getElementById("defaultOpen");
    if (button) button.click();

    const savebtn = document.querySelector(".savebtn");
    savebtn?.addEventListener("click", saveForm);
};

document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("editbtn")) window.location.hash = "edit";
    if (target.classList.contains("helpbtn")) window.location.hash = "help";
    if (target.classList.contains("sitesbtn")) window.location.hash = "sites";
    if (target.classList.contains("backbtn")) window.location.hash = "#";

    if (target.classList.contains("clearbtn")) {
        const confirmed = confirm('Are you sure you want to clear your profile? This cannot be undone.');

        if (confirmed) {
            ClearProfile().then(() => {
                window.location.hash = '/';
                window.location.reload();
            });
        }
    }
});

window.addEventListener("hashchange", locationHandler);
locationHandler();
