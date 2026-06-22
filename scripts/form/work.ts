import { createItem, getField, setField, getFieldChecked, setFieldChecked, getListItems } from '../dom.ts';
import type { WorkHistory } from '../types.ts';

export const initWork = (): void => {
    document.getElementById('add-work')?.addEventListener('click', () => {
        const item = createItem('work-list', 'work-template');
        bindWorkItemEvents(item);
    });
};

const bindWorkItemEvents = (item: HTMLElement): void => {
    const currentCheckbox = item.querySelector<HTMLInputElement>('[name="current"]');
    const endDateInput = item.querySelector<HTMLInputElement>('[name="endDate"]');
    if (!currentCheckbox || !endDateInput) return;

    currentCheckbox.addEventListener('change', () => {
        endDateInput.disabled = currentCheckbox.checked;
        if (currentCheckbox.checked) endDateInput.value = '';
    });
};

const loadWorkItem = (entry: WorkHistory): void => {
    const item = createItem('work-list', 'work-template');
    bindWorkItemEvents(item);

    setField(item, 'title', entry.title);
    setField(item, 'company', entry.company);
    setField(item, 'location', entry.location);
    setField(item, 'startDate', entry.startDate);
    setFieldChecked(item, 'current', entry.current);

    const endDateInput = item.querySelector<HTMLInputElement>('[name="endDate"]');
    if (endDateInput) {
        endDateInput.value = entry.endDate ?? '';
        endDateInput.disabled = entry.current ?? false;
    }

    setField(item, 'description', entry.description);
};

export const loadWorkHistory = (entries: WorkHistory[]): void => {
    entries.forEach(loadWorkItem);
};

export const getWorkHistory = (): WorkHistory[] =>
    getListItems('work-list')
        .map(item => {
            const title = getField(item, 'title');
            const startDate = getField(item, 'startDate');
            if (!title || !startDate) return null;

            const current = getFieldChecked(item, 'current');

            return {
                title,
                startDate: startDate as WorkHistory['startDate'],
                company: getField(item, 'company') || undefined,
                location: getField(item, 'location') || undefined,
                current,
                endDate: !current
                    ? getField(item, 'endDate') as WorkHistory['endDate'] || undefined
                    : undefined,
                description: getField(item, 'description') || undefined,
            };
        })
        .filter(e => e !== null) as WorkHistory[];
