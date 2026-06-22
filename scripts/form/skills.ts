import { createItem } from "../dom";
import type { Skill } from "../types";

export const loadSkillItem = (entry: Skill): void => {
    const item = createItem('skill-list', 'skill-template');
    const nameInput = item.querySelector<HTMLInputElement>('[name="name"]');
    if (nameInput) nameInput.value = entry.name;
};

export const loadSkills = (entries: Skill[]): void => {
    entries.forEach(entry => loadSkillItem(entry));
};

export const getSkills = (): Skill[] => {
    const items = document.querySelectorAll<HTMLElement>('#skill-list [data-item]');
    const entries: Skill[] = [];
    items.forEach(item => {
        const name = item.querySelector<HTMLInputElement>('[name="name"]')?.value ?? '';
        if (!name) return;
        entries.push({ name });
    });
    return entries;
};

export const initSkills = (): void => {
    document.getElementById('add-skill')?.addEventListener('click', () => {
        createItem('skill-list', 'skill-template');
    });
};
