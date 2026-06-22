import { getInput, setInput, getSelect, setSelect, getYesNo, setYesNo, populateSelect, populateCountrySelect } from '../dom.ts';
import { prefix, gender, race } from '../const.ts';
import type { About } from '../types.ts';

export const initAbout = (): void => {
    populateSelect('prefix', prefix);
    populateSelect('gender', gender);
    populateSelect('race', race);
    populateCountrySelect('citizenship');
    populateCountrySelect('nationality');
};

export const loadAbout = (about: About): void => {
    setSelect('prefix', about.prefix);
    setInput('firstName', about.firstName);
    setInput('middleName', about.middleName);
    setInput('lastName', about.lastName);
    setInput('preferredName', about.preferredName);
    setInput('birthDate', about.birthDate);
    setSelect('citizenship', about.citizenship);
    setSelect('nationality', about.nationality);
    setSelect('gender', about.gender);
    setSelect('race', about.race);
    setYesNo('hispanicOrLatino', about.hispanicOrLatino);
};

export const getAbout = (): About => {
    const firstName = getInput('firstName');
    const lastName = getInput('lastName');

    return {
        prefix: getSelect('prefix'),
        firstName,
        middleName: getInput('middleName') || undefined,
        lastName,
        fullName: `${firstName} ${lastName}`.trim(),
        preferredName: getInput('preferredName') || undefined,
        birthDate: getInput('birthDate') as About['birthDate'] || undefined,
        citizenship: getSelect('citizenship'),
        nationality: getSelect('nationality'),
        gender: getSelect('gender'),
        race: getSelect('race'),
        hispanicOrLatino: getYesNo('hispanicOrLatino') ?? false,
    };
};
