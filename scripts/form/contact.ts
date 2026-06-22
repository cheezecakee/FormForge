import { getInput, setInput, getSelect, setSelect, populateSelect } from '../dom.ts';
import { countryCode } from '../data/country-codes.ts';
import type { Contact } from '../types.ts';
import type { CountryCode } from '../data/country-codes.ts';

export const initContact = (): void => {
    populateSelect('countryCode', countryCode);
};

export const loadContact = (contact: Contact): void => {
    setInput('email', contact.email);
    setSelect('countryCode', contact.countryCode);
    setInput('phone', contact.phone);
    setInput('mobile', contact.mobile);
};

export const getContact = (): Contact => ({
    email: getInput('email'),
    countryCode: getSelect<CountryCode>('countryCode'),
    phone: getInput('phone') || undefined,
    mobile: getInput('mobile') || undefined,
});
