import { createItem, getField, setField, getListItems, populateCountrySelect } from '../dom.ts';
import type { Education } from '../types.ts';

const HIGHSCHOOL_HIDDEN = ['degree', 'fieldOfStudy', 'honors'] as const;

const updateEducationFields = (item: HTMLElement, level: string): void => {
    HIGHSCHOOL_HIDDEN.forEach(field => {
        const el = item.querySelector<HTMLElement>(`[name="${field}"]`);

        if (el) {
            const fieldContainer = el.closest<HTMLElement>('.field');

            (fieldContainer ?? el).style.display =
                level === 'high-school' ? 'none' : '';
        }
    });
};


export const initEducation = (): void => {
    document.getElementById('add-education')?.addEventListener('click', () => {
        const item = createItem('education-list', 'education-template');
        bindEducationItemEvents(item);
    });
};

const bindEducationItemEvents = (item: HTMLElement): void => {
    const levelSelect = item.querySelector<HTMLSelectElement>('[name="level"]');
    if (!levelSelect) return;

    populateCountrySelect(item.querySelector<HTMLSelectElement>('[name="location"]')!);

    levelSelect.addEventListener('change', () => {
        updateEducationFields(item, levelSelect.value);
    });
};

const loadEducationItem = (entry: Education): void => {
    const item = createItem('education-list', 'education-template');
    bindEducationItemEvents(item);

    const levelSelect = item.querySelector<HTMLSelectElement>('[name="level"]');
    if (levelSelect) {
        levelSelect.value = entry.level;
        updateEducationFields(item, entry.level);
    }

    setField(item, 'institution', entry.institution);
    setField(item, 'location', entry.location);
    setField(item, 'startDate', entry.startDate);
    setField(item, 'endDate', entry.endDate);
    setField(item, 'gpa', entry.gpa);
    setField(item, 'degree', entry.degree);
    setField(item, 'fieldOfStudy', entry.fieldOfStudy);
    setField(item, 'honors', entry.honors);
};

export const loadEducation = (entries: Education[]): void => {
    entries.forEach(loadEducationItem);
};

export const getEducation = (): Education[] =>
    getListItems('education-list')
        .map(item => {
            const level = getField<Education['level']>(item, 'level');
            const institution = getField(item, 'institution');
            if (!level || !institution) return null;

            const isHighSchool = level === 'high-school';

            return {
                level,
                institution,
                location: getField(item, 'location') as Education['location'] || undefined,
                startDate: getField(item, 'startDate') as Education['startDate'] || undefined,
                endDate: getField(item, 'endDate') as Education['endDate'] || undefined,
                gpa: getField(item, 'gpa') || undefined,
                degree: !isHighSchool ? getField(item, 'degree') || undefined : undefined,
                fieldOfStudy: !isHighSchool ? getField(item, 'fieldOfStudy') || undefined : undefined,
                honors: !isHighSchool ? getField(item, 'honors') || undefined : undefined,
            };
        })
        .filter(e => e !== null) as Education[];
