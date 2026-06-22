import { getInput, getSelect, setInput, setSelect } from "../dom";
import type { Salary } from "../types";


export const loadSalary = (salary: Salary): void => {
    const minInput = document.getElementById('salary-min') as HTMLInputElement;
    const maxInput = document.getElementById('salary-max') as HTMLInputElement;
    if (minInput) minInput.value = salary.min.toString();
    if (maxInput) maxInput.value = salary.max?.toString() ?? '';
    setInput('salary-currency', salary.currency);
    setSelect('salary-period', salary.period);
};

export const getSalary = (): Salary | null => {
    const minInput = document.getElementById('salary-min') as HTMLInputElement;
    const min = parseFloat(minInput?.value ?? '');
    if (isNaN(min)) return null;
    const maxInput = document.getElementById('salary-max') as HTMLInputElement;
    const max = parseFloat(maxInput?.value ?? '');
    return {
        min,
        max: isNaN(max) ? undefined : max,
        currency: getInput('salary-currency') || undefined,
        period: getSelect('salary-period') as Salary['period'] || undefined,
    };
};

