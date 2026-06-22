import { LoadProfile } from './storage.ts';
import { renderPanel } from './panel/render.ts';
import { saveField, fillField, getSavedField } from './panel/fill.ts';

// ─── Field Helpers ────────────────────────────────────────────────

const findForm = (): HTMLFormElement | null =>
    document.getElementById('application-form') as HTMLFormElement
    || document.querySelector('form[data-testid*="application"]')
    || document.querySelector('form[class*="application"]')
    || null;

const isDropdown = (element: HTMLInputElement): boolean =>
    element.getAttribute('aria-haspopup') === 'true'
    || element.getAttribute('role') === 'combobox'
    || element.getAttribute('aria-autocomplete') === 'list';

const isFieldValid = (element: EventTarget | null): element is HTMLInputElement | HTMLTextAreaElement =>
    element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;

const getFieldName = (field: HTMLInputElement | HTMLTextAreaElement): string =>
    field.getAttribute('aria-label')
    || field.getAttribute('placeholder')
    || field.getAttribute('name')
    || field.getAttribute('id')
    || 'Unknown field';

let panel: Element | null = null;
let panelbtn: Element | null = null;
let indicator: Element | null = null;
let shadow: ShadowRoot | null = null;
let isPanelOpen = false;

chrome.runtime.sendMessage({ action: 'job-site-detected' });

(async () => {
    const host = document.createElement('div');
    host.style.cssText = `
        position: fixed;
        right: 0;
        top: 0;
        z-index: 2147483647;
        overflow: hidden;
    `;

    shadow = host.attachShadow({ mode: 'closed' });

    const [globalCss, panelCss, html] = await Promise.all([
        fetch(chrome.runtime.getURL('global.css')).then(r => r.text()),
        fetch(chrome.runtime.getURL('panel/panel.css')).then(r => r.text()),
        fetch(chrome.runtime.getURL('panel/panel.html')).then(r => r.text()),
    ]);

    shadow.innerHTML = `
                <style>
                    ${globalCss}
                    ${panelCss}
                </style>
                ${html}
    `;
    document.body.appendChild(host);

    panel = shadow.querySelector('#forge-panel');
    panelbtn = shadow.querySelector('#forge-trigger');
    indicator = shadow.querySelector('#forge-field-name');

    const triggerIcon = shadow.querySelector('.panelbtn-icon') as HTMLImageElement;

    if (triggerIcon) {
        triggerIcon.src = chrome.runtime.getURL('logo/logo_32.png');
    }

    shadow.querySelector('#forge-trigger-back')?.addEventListener('click', () => closePanel());
    panelbtn?.addEventListener('click', () => openPanel());

    const profile = await LoadProfile();
    if (profile) {
        renderPanel(profile, shadow, (value) => {
            fillField(value, indicator, showToast);
        });
    }

    const form = findForm();
    form?.addEventListener('focusin', (event) => {
        if (!isFieldValid(event.target)) return;
        const field = event.target;
        if (getSavedField() === field) return; // already saved, ignore re-focus
        saveField(field, isDropdown(field as HTMLInputElement) ? 'dropdown' : 'input');
        if (indicator) indicator.textContent = `Selected: ${getFieldName(field)}`;
        if (!isPanelOpen) openPanel();
    });

    form?.addEventListener('focusout', (event) => {
        if (!isFieldValid(event.target)) return;
    });
})();

// ─── Panel UI ─────────────────────────────────────────────────────

const openPanel = (): void => {
    if (!panel || !panelbtn) return;
    panel.classList.remove('hidden');
    panelbtn.classList.add('hidden');
    isPanelOpen = true;
};

const closePanel = (): void => {
    if (!panel || !panelbtn) return;
    panel.classList.add('hidden');
    panelbtn.classList.remove('hidden');
    isPanelOpen = false;
};

const showToast = (message: string, type: 'success' | 'error' | 'info'): void => {
    if (!shadow) return;
    const toast = shadow.querySelector('#forge-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `forge-toast forge-toast--${type} forge-toast--visible`;
    setTimeout(() => { toast.className = 'forge-toast'; }, 3000);
};
