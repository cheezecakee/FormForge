import { SaveProfile, LoadProfile } from './storage.ts';
import type { Profile } from './types.ts';
import {
    loadLinks, getLinks,
    getLegal, loadLegal,
    getSalary, loadSalary,
    getSkills, loadSkills, initSkills,
    getLanguages, loadLanguages, initLanguages,
    getFaq, loadFaq, initFaq,
    getCoverLetters, loadCoverLetters, initCoverLetters,
    getAbout, loadAbout, initAbout,
    getContact, loadContact, initContact,
    getAddresses, loadAddresses,
    initAddress,
    getWorkHistory, loadWorkHistory,
    getEducation, loadEducation,
    initWork,
    initEducation,
    getIdentification, loadIdentification,
    initIdentification,
} from './form/index.ts';

export const saveForm = async (): Promise<void> => {
    const existing = await LoadProfile();
    const profile: Profile = {
        ...existing,
        about: getAbout(),
        contact: getContact(),
        addresses: getAddresses(),
        identification: getIdentification(),
        workHistory: getWorkHistory(),
        education: getEducation(),
        legal: getLegal(),
        faq: getFaq(),
        links: getLinks(),
        languages: getLanguages(),
        salary: getSalary() ?? existing?.salary,
        skills: getSkills(),
        coverLetters: getCoverLetters(),
    };
    await SaveProfile(profile);
    console.log('Profile saved:', profile);
};

export const initEdit = async (): Promise<void> => {
    initAbout();
    initContact();
    initAddress();
    initIdentification();
    initFaq();
    initCoverLetters();
    initSkills();
    initWork();
    initEducation();
    initLanguages();

    const profile = await LoadProfile();
    if (profile) {
        const { about, contact, addresses, identification, workHistory, education, legal, faq, links, languages, salary, skills, coverLetters } = profile;
        if (about) loadAbout(about);
        if (contact) loadContact(contact);
        if (addresses) loadAddresses(addresses);
        if (identification) loadIdentification(identification);
        if (workHistory) loadWorkHistory(workHistory);
        if (education) loadEducation(education);
        if (legal) loadLegal(legal);
        if (faq) loadFaq(faq);
        if (links) loadLinks(links);
        if (languages) loadLanguages(languages);
        if (salary) loadSalary(salary);
        if (skills) loadSkills(skills);
        if (coverLetters) loadCoverLetters(coverLetters);
    }
};
