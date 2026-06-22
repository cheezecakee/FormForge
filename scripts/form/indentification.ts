import { createItem, getField, setField, getListItems, populateSelect, populateCountrySelect } from '../dom.ts';
import { idTypes } from '../const.ts';
import type { Identification } from '../types.ts';

// Module-level shared state — tracks which ID types are in use across all items
const usedTypes = Object.fromEntries(
    idTypes.filter(t => t !== 'custom').map(t => [t, false])
) as Record<string, boolean>;

const refreshTypeSelects = (): void => {
    document.querySelectorAll<HTMLSelectElement>('#id-list [name="type"]').forEach(select => {
        const current = select.value;
        Array.from(select.options).forEach(opt => {
            if (opt.value === '' || opt.value === 'custom') return;
            opt.disabled = !!usedTypes[opt.value] && opt.value !== current;
        });
    });
};

const onIdRemove = (item: HTMLElement): void => {
    const type = item.querySelector<HTMLSelectElement>('[name="type"]')?.value;
    if (type && type !== 'custom') usedTypes[type] = false;
    refreshTypeSelects();
};

const bindIdItemEvents = (item: HTMLElement): void => {
    const typeSelect = item.querySelector<HTMLSelectElement>('[name="type"]');
    const customInput = item.querySelector<HTMLInputElement>('[name="customType"]');
    if (!typeSelect || !customInput) return;

    populateSelect(typeSelect, idTypes);
    populateCountrySelect(item.querySelector<HTMLSelectElement>('[name="country"]')!);

    typeSelect.addEventListener('change', () => {
        const prev = typeSelect.dataset.prev ?? '';
        const next = typeSelect.value;

        if (prev && prev !== 'custom') usedTypes[prev] = false;
        if (next && next !== 'custom') usedTypes[next] = true;

        typeSelect.dataset.prev = next;
        customInput.style.display = next === 'custom' ? 'block' : 'none';
        refreshTypeSelects();
    });
};

const loadIdItem = (entry: Identification): void => {
    const item = createItem('id-list', 'id-template', onIdRemove);
    bindIdItemEvents(item);

    const typeSelect = item.querySelector<HTMLSelectElement>('[name="type"]');
    const customInput = item.querySelector<HTMLInputElement>('[name="customType"]');

    if (typeSelect) {
        typeSelect.value = entry.type;
        typeSelect.dataset.prev = entry.type;
        if (entry.type !== 'custom') usedTypes[entry.type] = true;
    }
    if (customInput) {
        customInput.value = entry.customType ?? '';
        customInput.style.display = entry.type === 'custom' ? 'block' : 'none';
    }

    setField(item, 'value', entry.value);
    setField(item, 'expiry', entry.expiry);

    const countrySelect = item.querySelector<HTMLSelectElement>('[name="country"]');
    if (countrySelect) countrySelect.value = entry.country ?? '';

    refreshTypeSelects();
};

export const loadIdentification = (entries: Identification[]): void => {
    entries.forEach(loadIdItem);
};

export const getIdentification = (): Identification[] =>
    getListItems('id-list')
        .map(item => {
            const type = getField<Identification['type']>(item, 'type');
            const value = getField(item, 'value');
            if (!type || !value) return null;

            return {
                type,
                customType: getField(item, 'customType') || undefined,
                value,
                country: getField(item, 'country') as Identification['country'] || undefined,
                expiry: getField(item, 'expiry') as Identification['expiry'] || undefined,
            };
        })
        .filter(e => e !== null) as Identification[];

export const initIdentification = (): void => {
    document.getElementById('add-id')?.addEventListener('click', () => {
        const item = createItem('id-list', 'id-template', onIdRemove);
        bindIdItemEvents(item);
    });
};
