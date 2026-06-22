import { createItem, getField, setField, getListItems, generateId } from '../dom.ts';
import type { FAQ } from '../types.ts';

const loadFaqItem = (entry: FAQ): void => {
    const item = createItem('faq-list', 'faq-template');
    setField(item, 'question', entry.question);
    setField(item, 'answer', entry.answer);
    item.dataset.id = entry.id;
};

export const loadFaq = (entries: FAQ[]): void => {
    entries.forEach(loadFaqItem);
};

export const getFaq = (): FAQ[] =>
    getListItems('faq-list')
        .map(item => ({
            id: item.dataset.id || generateId(),
            question: getField(item, 'question'),
            answer: getField(item, 'answer'),
        }))
        .filter(f => f.question && f.answer);


export const initFaq = (): void => {
    document.getElementById('add-faq')?.addEventListener('click', () => {
        const item = createItem('faq-list', 'faq-template');
        item.dataset.id = generateId();
    });
};
