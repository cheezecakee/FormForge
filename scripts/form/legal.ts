import { getYesNo, setYesNo } from "../dom";
import type { Legal } from "../types";

export const loadLegal = (legal: Legal): void => {
    setYesNo('workAuthorized', legal.workAuthorized);
    setYesNo('requireSponsorship', legal.requireSponsorship);
    setYesNo('disability', legal.disability);
    setYesNo('veteran', legal.veteran);
    setYesNo('criminal', legal.criminal);
};

export const getLegal = (): Legal => ({
    workAuthorized: getYesNo('workAuthorized'),
    requireSponsorship: getYesNo('requireSponsorship'),
    disability: getYesNo('disability'),
    veteran: getYesNo('veteran'),
    criminal: getYesNo('criminal'),
});

