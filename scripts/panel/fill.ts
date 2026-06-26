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
    if (!savedField) {
        navigator.clipboard.writeText(value)
            .then(() => onToast('Copied to clipboard!', 'info'))
            .catch(() => onToast('Failed to copy', 'error'));
        return;
    }

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

    // console.log('fillDropdown called with value:', value);
    // console.log('field:', field);

    // Find the React Select container
    const selectContainer = field.closest('.select');
    if (!selectContainer) {
        onToast('Could not find select container', 'error');
        return;
    }

    // Use onMouseUp to toggle menuIsOpen
    const control = selectContainer.querySelector('.select__control');
    if (control) {
        const mouseUpEvent = new MouseEvent('mouseup', {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        control.dispatchEvent(mouseUpEvent);
    }

    // Click the field to ensure it opens
    field.focus();
    field.click();

    // console.log('Dropdown should be open, waiting for options...');

    setTimeout(() => {
        // Find all options in the menu
        const menu = selectContainer.querySelector('.select__menu');
        if (!menu) {
            // console.log('Menu not found');
            // Try typing approach as fallback
            typeAndSelect(field, value, indicator, onToast);
            return;
        }

        const options = menu.querySelectorAll('[role="option"]');
        // console.log('options found:', options.length);
        // console.log('options:', Array.from(options).map(o => o.textContent?.trim()));

        // Find the best match
        let match = findMatchingOption(Array.from(options), value);
        // console.log('match found:', match);

        if (!match) {
            // Try finding options from the entire document as fallback
            const allOptions = document.querySelectorAll('[role="option"]');
            match = findMatchingOption(Array.from(allOptions), value);
            // console.log('fallback match found:', match);
        }

        if (!match) {
            // console.log('No match found, trying type approach...');
            typeAndSelect(field, value, indicator, onToast);
            return;
        }

        (match as HTMLElement).scrollIntoView({ block: 'nearest' });
        (match as HTMLElement).click();

        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));

        setTimeout(() => {
            const singleValue = selectContainer.querySelector('.select__single-value');
            if (singleValue) {
                // console.log('Value successfully set:', singleValue.textContent);
                clearSavedField(indicator);
                onToast('Field filled!', 'success');
            } else {
                // console.log('Value not set, trying alternative...');
                forceSetReactValue(field, value);

                setTimeout(() => {
                    const singleValueRetry = selectContainer.querySelector('.select__single-value');
                    if (singleValueRetry) {
                        clearSavedField(indicator);
                        onToast('Field filled!', 'success');
                    } else {
                        onToast('Failed to set value', 'error');
                    }
                }, 100);
            }
        }, 100);

    }, 500);
};

const findMatchingOption = (options: Element[], value: string): Element | null => {
    const searchValue = value.toLowerCase().trim();

    let match = options.find(option => {
        const text = option.textContent?.trim().toLowerCase() || '';
        return text === searchValue;
    });
    if (match) return match;

    match = options.find(option => {
        const text = option.textContent?.trim().toLowerCase() || '';
        return text.startsWith(searchValue);
    });
    if (match) return match;

    match = options.find(option => {
        const text = option.textContent?.trim().toLowerCase() || '';
        return text.includes(searchValue);
    });
    if (match) return match;

    const searchWords = searchValue.split(' ');
    match = options.find(option => {
        const text = option.textContent?.trim().toLowerCase() || '';
        return searchWords.every(word => text.includes(word));
    });

    return match || null;
};

const typeAndSelect = (
    field: HTMLInputElement,
    value: string,
    indicator: Element | null,
    onToast: (msg: string, type: 'success' | 'error' | 'info') => void
): void => {
    field.focus();

    field.value = '';
    field.dispatchEvent(new Event('input', { bubbles: true }));

    let index = 0;
    const typeNextChar = () => {
        field.focus();

        if (index >= value.length) {
            setTimeout(() => {
                field.focus();

                const selected = document.querySelector(
                    '[role="option"][aria-selected="true"], ' +
                    '.select__option--is-focused, ' +
                    '.select__option--is-selected'
                );

                if (selected) {
                    (selected as HTMLElement).click();
                    setTimeout(() => {
                        field.dispatchEvent(new Event('input', { bubbles: true }));
                        field.dispatchEvent(new Event('change', { bubbles: true }));

                        const selectContainer = field.closest('.select');
                        if (selectContainer) {
                            const singleValue = selectContainer.querySelector('.select__single-value');
                            if (singleValue) {
                                clearSavedField(indicator);
                                onToast('Field filled!', 'success');
                                return;
                            }
                        }

                        field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                        clearSavedField(indicator);
                        onToast('Field filled!', 'success');
                    }, 50);
                } else {
                    field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                    setTimeout(() => {
                        if (field.value) {
                            clearSavedField(indicator);
                            onToast('Field filled!', 'success');
                        } else {
                            navigator.clipboard.writeText(value)
                                .then(() => onToast('No match — copied to clipboard!', 'info'))
                                .catch(() => onToast('No match found', 'error'));
                        }
                    }, 100);
                }
            }, 300);
            return;
        }

        const char = value[index];
        field.value = field.value + char;
        field.dispatchEvent(new Event('input', { bubbles: true }));

        index++;
        setTimeout(typeNextChar, 80);
    };

    typeNextChar();
};

// Force set React value through internal state
const forceSetReactValue = (field: HTMLInputElement, value: string): void => {
    const key = Object.keys(field).find(key =>
        key.startsWith('__reactFiber$') || key.startsWith('__reactInternalInstance$')
    );

    if (key) {
        const fiber = (field as any)[key];
        let node = fiber;

        while (node) {
            if (node.stateNode && node.memoizedProps) {
                if (node.memoizedProps.onChange) {
                    // Create a synthetic event
                    const syntheticEvent = {
                        target: { value: value },
                        currentTarget: { value: value },
                    };
                    node.memoizedProps.onChange(syntheticEvent);
                    break;
                }

                // Look for onSelect handler (AsyncPaginate)
                if (node.memoizedProps.onSelect) {
                    const option = { value: value, label: value };
                    node.memoizedProps.onSelect(option);
                    break;
                }
            }
            node = node.return;
        }
    }

    // Fallback: native setter
    const nativeSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value'
    )?.set;

    if (nativeSetter) {
        nativeSetter.call(field, value);
    } else {
        field.value = value;
    }

    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
};
