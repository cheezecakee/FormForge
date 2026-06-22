import { createItem, getField, setField, getListItems, generateId } from '../dom.ts';
import type { CoverLetter } from '../types.ts';

const loadCoverLetterItem = (entry: CoverLetter): void => {
    const item = createItem('coverletter-list', 'coverletter-template');
    setField(item, 'label', entry.label);
    setField(item, 'body', entry.body);
    item.dataset.id = entry.id;
};

export const loadCoverLetters = (entries: CoverLetter[]): void => {
    entries.forEach(loadCoverLetterItem);
};

export const getCoverLetters = (): CoverLetter[] =>
    getListItems('coverletter-list')
        .map(item => ({
            id: item.dataset.id || generateId(),
            label: getField(item, 'label'),
            body: getField(item, 'body'),
        }))
        .filter(cl => cl.label && cl.body);



export const initCoverLetters = (): void => {
    document.getElementById('add-coverletter')?.addEventListener('click', () => {
        const item = createItem('coverletter-list', 'coverletter-template');
        item.dataset.id = generateId();
    });
};
