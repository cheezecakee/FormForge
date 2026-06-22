import { createItem, getField, setField, getListItems } from '../dom.ts';
import type { Language } from '../types.ts';

const loadLanguageItem = (entry: Language): void => {
    const item = createItem('language-list', 'language-template');
    setField(item, 'language', entry.language);
    setField(item, 'proficiency', entry.proficiency);
};

export const loadLanguages = (entries: Language[]): void => {
    entries.forEach(loadLanguageItem);
};

export const getLanguages = (): Language[] =>
    getListItems('language-list')
        .map(item => ({
            language: getField(item, 'language'),
            proficiency: getField<Language['proficiency']>(item, 'proficiency'),
        }))
        .filter(l => l.language && l.proficiency);


export const initLanguages = (): void => {
    document.getElementById('add-language')?.addEventListener('click', () => {
        createItem('language-list', 'language-template');
    });
};
