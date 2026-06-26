import { createItem } from './dom.ts';
import { LoadCustomSites, SaveCustomSites } from './storage.ts';
import { Websites } from './const.ts';

const loadDefaultSites = (): void => {
    const container = document.getElementById('default-site-list');
    if (!container) return;
    Websites.forEach(site => {
        const el = document.createElement('div');
        el.textContent = site;
        container.appendChild(el);
    });
};

const loadCustomSiteItem = (site: string): void => {
    const item = createItem('custom-site-list', 'site-template', async () => {
        const sites = await LoadCustomSites();
        await SaveCustomSites(sites.filter(s => s !== site));
    });
    const nameEl = item.querySelector<HTMLElement>('.site-name');
    if (nameEl) nameEl.textContent = site;
};

const normalizeSite = (value: string): string => {
    value = value.trim();

    if (!value.startsWith('http://') && !value.startsWith('https://')) {
        value = `https://${value}`;
    }

    // return new URL(value).hostname;
    return new URL(value).hostname.replace(/^www\./, '');
};

export const initSites = async (): Promise<void> => {
    loadDefaultSites();

    const customSites = await LoadCustomSites();
    customSites.forEach(site => loadCustomSiteItem(site));

    document.getElementById('add-site-btn')?.addEventListener('click', async () => {
        const input = document.getElementById('site-input') as HTMLInputElement;
        const value = normalizeSite(input.value);

        if (!value) return;

        const sites = await LoadCustomSites();
        if (sites.includes(value)) return;

        await SaveCustomSites([...sites, value]);
        loadCustomSiteItem(value);
        input.value = '';
    });
};

