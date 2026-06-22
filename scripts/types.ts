import type {
    Prefix,
    Race,
    Gender,
    IdType,
    EducationLevel,
    IsoDate,
} from './const.ts';

import type { CountryCode } from './data/country-codes.ts'
import type { Country } from './data/countries.ts'


export interface Profile {
    about: About;
    contact?: Contact;
    addresses?: Address[];
    workHistory?: WorkHistory[];
    education?: Education[];
    identification?: Identification[];
    legal?: Legal;
    coverLetters?: CoverLetter[];
    faq?: FAQ[];
    languages?: Language[];
    skills?: Skill[];
    links?: Links;
    salary?: Salary;
}

// ─── About ───────────────────────────────────────────────────────

export interface About {
    prefix?: Prefix;

    firstName: string;
    middleName?: string;
    lastName: string;
    fullName: string;
    preferredName?: string;

    birthDate?: IsoDate;     // "YYYY-MM-DD"

    citizenship?: Country;  // legal status/passports
    nationality?: Country;  // national identity/origin

    // mothersName?: string;
    // fathersName?: string;

    gender?: Gender;
    race?: Race;

    hispanicOrLatino?: boolean;
}

// ─── Contact ─────────────────────────────────────────────────────

export interface Contact {
    email: string;
    countryCode?: CountryCode;
    phone?: string;
    mobile?: string;
}

// ─── Address ─────────────────────────────────────────────────────

export type AddressType = 'current' | 'permanent';

export interface Address {
    type: AddressType;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    country: Country;
    zipCode?: string;
}

// ─── Identification ──────────────────────────────────────────────
export interface Identification {
    type: IdType;
    customType?: string;    // only used when type === 'custom' 
    value: string;          // ID number/value
    country?: Country;      // issuing country
    expiry?: IsoDate;        // "YYYY-MM-DD"
}

// ─── Work history ────────────────────────────────────────────────

export interface WorkHistory {
    title: string;
    company?: string;
    location?: string;
    startDate: IsoDate;
    endDate?: IsoDate;
    current?: boolean;
    description?: string;
}


// ─── Education ───────────────────────────────────────────────────

export interface Education {
    level: EducationLevel;

    institution: string;
    location?: Country;

    degree?: string;
    fieldOfStudy?: string;

    startDate?: IsoDate;
    endDate?: IsoDate;

    gpa?: string; // TODO Later on put a grading type with a converter
    honors?: string;
}

// ─── Legal ───────────────────────────────────────────────────────
export interface Legal {
    workAuthorized?: boolean;
    requireSponsorship?: boolean;
    disability?: boolean;
    veteran?: boolean
    criminal?: boolean;
}

// ─── FAQ answers ─────────────────────────────────────────────────
export interface FAQ {
    id: string;             // Auto generated
    question: string;
    answer: string;
}

// ─── Links ─────────────────────────────────────────────────
export interface Links {
    linkedIn?: string;
    github?: string;
    x?: string;
    instagram?: string;
    portfolio?: string;
    website?: string;
    blog?: string;
}


// ─── Languages ─────────────────────────────────────────────────
export type LanguageProficiency =
    | 'basic'
    | 'intermediate'
    | 'fluent'
    | 'native';

export interface Language {
    language: string;
    proficiency: LanguageProficiency;
}

export interface Skill {
    name: string;
}

// ─── Salary ────────────────────────────────────────────────

// This is just a base desired salary
export interface Salary {
    min: number;
    max?: number;
    currency?: string; // TODO add currency types later
    period?: 'annual' | 'monthly' | 'hourly';
}

// ─── Cover letters ───────────────────────────────────────────────
export interface CoverLetter {
    id: string;     // Auto generated
    label: string;  // "General", "Startup focused", "Big Tech"
    body: string;
}
