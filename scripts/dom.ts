import { countries } from "./data/countries";

export const getInput = (id: string): string => {
    const input = document.getElementById(id) as HTMLInputElement;
    return input.value ?? '';
}

export const setInput = (id: string, value?: string): void => {
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) input.value = value ?? '';
};

export const getCheckbox = (id: string): boolean => {
    const input = document.getElementById(id) as HTMLInputElement;
    return input?.checked ?? false;
};

export const setCheckbox = (id: string, checked?: boolean): void => {
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) input.checked = checked ?? false;
};

export const getSelect = <T extends string>(id: string): T | undefined => {
    const select = document.getElementById(id) as HTMLSelectElement;
    const value = select?.value;
    return value ? (value as T) : undefined;
};

export const setSelect = (id: string, value?: string): void => {
    const select = document.getElementById(id) as HTMLSelectElement;
    if (select) select.value = value ?? '';
};

export const getYesNo = (id: string): boolean | null => {
    const select = document.getElementById(id) as HTMLSelectElement;
    const value = select?.value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return null;
};

export const setYesNo = (id: string, value?: boolean | null): void => {
    const select = document.getElementById(id) as HTMLSelectElement;
    if (!select) return;
    if (value === true) select.value = 'true';
    else if (value === false) select.value = 'false';
    else select.value = '';
};

export const populateSelect = (
    target: string | HTMLSelectElement,
    options: readonly string[]
): void => {
    const select = typeof target === 'string'
        ? document.getElementById(target) as HTMLSelectElement
        : target;
    if (!select) return;
    options.forEach(opt => {
        const el = document.createElement('option');
        el.value = opt;
        el.textContent = opt;
        select.appendChild(el);
    });
};

export const toTitle = (str: string): string =>
    str.replace(/\b\w/g, c => c.toUpperCase());

export function createItem(
    containerId: string,
    templateId: string,
    onRemove?: (item: HTMLElement) => void
): HTMLElement {
    const container = document.getElementById(containerId);
    if (!container) throw new Error(`Container not found: ${containerId}`);

    const template = document.getElementById(templateId) as HTMLTemplateElement;
    if (!template) throw new Error(`Template not found: ${templateId}`);

    const item = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    container.appendChild(item);

    bindRemoveButtons(item, onRemove);

    return item;
}

export function removeItem(button: HTMLElement): void {
    button.closest('[data-item]')?.remove();
}

export function bindRemoveButtons(
    root: ParentNode = document,
    onRemove?: (item: HTMLElement) => void
): void {
    root.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = (btn as HTMLElement).closest('[data-item]') as HTMLElement;
            onRemove?.(item);
            removeItem(btn as HTMLElement);
        });
    });
}

export const generateId = (): string => {
    return Math.random().toString(36).slice(2, 10);
};

export const getField = <T extends string = string>(item: ParentNode, name: string): T =>
    (item.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(`[name="${name}"]`)?.value ?? '') as T;

export const setField = (item: ParentNode, name: string, value?: string): void => {
    const el = item.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(`[name="${name}"]`);
    if (el) el.value = value ?? '';
};

export const getFieldChecked = (item: ParentNode, name: string): boolean =>
    item.querySelector<HTMLInputElement>(`[name="${name}"]`)?.checked ?? false;


export const setFieldChecked = (item: ParentNode, name: string, checked?: boolean): void => {
    const el = item.querySelector<HTMLInputElement>(`[name="${name}"]`);
    if (el) el.checked = checked ?? false;
};

export const getListItems = (containerId: string): HTMLElement[] =>
    Array.from(document.querySelectorAll<HTMLElement>(`#${containerId} [data-item]`))

export const populateCountrySelect = (target: string | HTMLSelectElement): void => {
    populateSelect(target, countries);
}
