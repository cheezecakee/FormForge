import { getInput, setInput, getSelect, setSelect, getCheckbox, populateCountrySelect } from '../dom.ts';
import type { Address, AddressType } from '../types.ts';
import type { Country } from '../data/countries.ts';

const addressFields = ['line1', 'line2', 'city', 'state', 'country', 'zipCode'] as const;

const updateAddressSummary = (type: AddressType): void => {
    const city = getInput(`${type}-city`);
    const country = getSelect(`${type}-country`);
    const summary = document.getElementById(`summary-${type}`);
    if (!summary) return;
    summary.textContent = city && country ? `— ${city}, ${country}` : '';
};

const setCurrentFieldsDisabled = (disabled: boolean): void => {
    addressFields.forEach(field => {
        const el = document.getElementById(`current-${field}`) as HTMLInputElement | HTMLSelectElement;
        if (el) el.disabled = disabled;
    });
};

const copyPermanentToCurrent = (): void => {
    addressFields.forEach(field => {
        const from = document.getElementById(`permanent-${field}`) as HTMLInputElement | HTMLSelectElement;
        const to = document.getElementById(`current-${field}`) as HTMLInputElement | HTMLSelectElement;
        if (from && to) to.value = from.value;
    });
    updateAddressSummary('current');
};

const loadAddress = (type: AddressType, address: Address): void => {
    setInput(`${type}-line1`, address.line1);
    setInput(`${type}-line2`, address.line2);
    setInput(`${type}-city`, address.city);
    setInput(`${type}-state`, address.state);
    setSelect(`${type}-country`, address.country);
    setInput(`${type}-zipCode`, address.zipCode);
    updateAddressSummary(type);
};

const getAddress = (type: AddressType): Address | null => {
    const line1 = getInput(`${type}-line1`);
    const city = getInput(`${type}-city`);
    const country = getSelect<Country>(`${type}-country`);
    if (!line1 || !city || !country) return null;

    return {
        type,
        line1,
        line2: getInput(`${type}-line2`) || undefined,
        city,
        state: getInput(`${type}-state`) || undefined,
        country,
        zipCode: getInput(`${type}-zipCode`) || undefined,
    };
};

const isSameAddress = (a: Address, b: Address): boolean =>
    a.line1 === b.line1 &&
    a.line2 === b.line2 &&
    a.city === b.city &&
    a.state === b.state &&
    a.country === b.country &&
    a.zipCode === b.zipCode;

export const getAddresses = (): Address[] => {
    const addresses: Address[] = [];
    const sameAsPermanent = getCheckbox('sameAsPermanent');

    const permanent = getAddress('permanent');
    if (permanent) addresses.push(permanent);

    if (sameAsPermanent && permanent) {
        addresses.push({ ...permanent, type: 'current' });
    } else {
        const current = getAddress('current');
        if (current) addresses.push(current);
    }

    return addresses;
};

export const loadAddresses = (addresses: Address[]): void => {
    const current = addresses.find(a => a.type === 'current');
    const permanent = addresses.find(a => a.type === 'permanent');

    if (permanent) loadAddress('permanent', permanent);
    if (current) loadAddress('current', current);

    const same = !!current && !!permanent && isSameAddress(current, permanent);
    const checkbox = document.getElementById('sameAsPermanent') as HTMLInputElement;
    if (checkbox) checkbox.checked = same;
    setCurrentFieldsDisabled(same);
};

export const initAddress = (): void => {
    populateCountrySelect('current-country');
    populateCountrySelect('permanent-country');

    const checkbox = document.getElementById('sameAsPermanent') as HTMLInputElement;
    checkbox?.addEventListener('change', () => {
        if (checkbox.checked) copyPermanentToCurrent();
        setCurrentFieldsDisabled(checkbox.checked);
    });

    (['current', 'permanent'] as AddressType[]).forEach(type => {
        [`${type}-city`, `${type}-country`].forEach(id => {
            document.getElementById(id)?.addEventListener('input', () => updateAddressSummary(type));
        });
    });
};
