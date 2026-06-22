let savedField: HTMLInputElement | HTMLTextAreaElement | null = null;
let savedFieldType: 'input' | 'dropdown' | null = null;

export type FieldType = typeof savedFieldType;

export const getSavedField = () => savedField;

export const saveField = (
    field: HTMLInputElement | HTMLTextAreaElement,
    type: 'input' | 'dropdown'
): void => {
    savedField = field;
    savedFieldType = type;
};

export const clearSavedField = (indicator: Element | null): void => {
    savedField = null;
    savedFieldType = null;
    if (indicator) indicator.textContent = 'No field selected';
};

export const fillField = (
    value: string,
    indicator: Element | null,
    onToast: (msg: string, type: 'success' | 'error' | 'info') => void
): void => {
    // No field selected — just copy to clipboard
    if (!savedField) {
        navigator.clipboard.writeText(value)
            .then(() => onToast('Copied to clipboard!', 'info'))
            .catch(() => onToast('Failed to copy', 'error'));
        return;
    }

    // Field was selected but is no longer in the DOM
    if (!document.contains(savedField)) {
        clearSavedField(indicator);
        onToast('Field no longer exists', 'error');
        return;
    }

    if (savedFieldType === 'dropdown') {
        fillDropdown(value, indicator, onToast);
    } else {
        fillInput(value, indicator, onToast);
    }
};

const fillInput = (
    value: string,
    indicator: Element | null,
    onToast: (msg: string, type: 'success' | 'error' | 'info') => void
): void => {
    if (!savedField) return;
    savedField.focus();
    (savedField as HTMLInputElement).value = value;
    savedField.dispatchEvent(new Event('input', { bubbles: true }));
    savedField.dispatchEvent(new Event('change', { bubbles: true }));
    clearSavedField(indicator);
    onToast('Field filled!', 'success');
};

const fillDropdown = (
    value: string,
    indicator: Element | null,
    onToast: (msg: string, type: 'success' | 'error' | 'info') => void
): void => {
    if (!savedField) return;
    const field = savedField as HTMLInputElement;

    console.log('[fill] attempting dropdown fill:', value);

    // React Select: set value via native setter to trigger React's onChange
    field.focus();
    field.click();

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    nativeInputValueSetter?.call(field, value);
    field.dispatchEvent(new Event('input', { bubbles: true }));

    console.log('[fill] typed value, waiting for options to filter...');

    let resolved = false;

    // Wait for React Select to filter options after input event
    setTimeout(() => {
        const listbox = document.querySelector('[role="listbox"]');
        console.log('[fill] listbox found:', !!listbox);

        if (listbox) {
            const options = Array.from(listbox.querySelectorAll('[role="option"]'));
            console.log('[fill] filtered options:', options.map(o => o.textContent?.trim()));

            const needle = value.toLowerCase();
            const match = options.find(opt => {
                const text = opt.textContent?.trim().toLowerCase() ?? '';
                return text === needle || text.startsWith(needle);
            });

            if (match) {
                console.log('[fill] match found, pressing Enter');
                field.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    bubbles: true,
                    cancelable: true,
                }));
                clearSavedField(indicator);
                onToast('Field filled!', 'success');
            } else {
                console.log('[fill] no match after filtering');
                navigator.clipboard.writeText(value)
                    .then(() => onToast('No match found — copied to clipboard!', 'info'))
                    .catch(() => onToast('No matching option found', 'error'));
                field.blur();
            }
        } else {
            console.log('[fill] no listbox appeared after typing');
            onToast('Dropdown did not open', 'error');
        }

        resolved = true;
    }, 300);

    setTimeout(() => {
        if (!resolved) {
            console.log('[fill] timeout — nothing happened');
            onToast('Dropdown did not respond', 'error');
        }
    }, 3000);
};
