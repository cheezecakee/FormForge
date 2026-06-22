export const Websites = [
    "workday.com",
    "linkedin.com/jobs",
    "greenhouse.io",
    "bamboohr.com",
    "fullstack.com"
];

export const prefix = [
    "Mr",
    "Mrs",
    "Ms",
    "Mx",
] as const;

export type Prefix = typeof prefix[number];

export const race = [
    "American Indian or Alaska Native",
    "Asian",
    "Black",
    "Native Hawaiian or Other Pacific Islander",
    "Two or More Races",
    "White",
    "Prefer not to say",
] as const;

export type Race = typeof race[number];
export const gender = [
    "Cisgender Male",
    "Cisgender Female",
    "Transgender Male",
    "Transgender Female",
    "Non-binary",
    "Genderqueer",
    "Self-describe",
    "Prefer not to say",
] as const;

export type Gender = typeof gender[number];

// export const 

export type Year = `${number}${number}${number}${number}`;
export type Month =
    | "01" | "02" | "03" | "04"
    | "05" | "06" | "07" | "08"
    | "09" | "10" | "11" | "12";
export type Day =
    | "01" | "02" | "03" | "04" | "05"
    | "06" | "07" | "08" | "09" | "10"
    | "11" | "12" | "13" | "14" | "15"
    | "16" | "17" | "18" | "19" | "20"
    | "21" | "22" | "23" | "24" | "25"
    | "26" | "27" | "28" | "29" | "30"
    | "31";
export type IsoDate = `${Year}-${Month}-${Day}`;

export const idTypes = [
    'passport',
    'driver-license',
    'national-id',
    'social-security',
    'tax-id',
    'residence-permit',
    'custom',
] as const;

export type IdType = typeof idTypes[number];

export const educationLevels = [
    'high-school',
    'associate',
    'bachelor',
    'master',
    'doctorate',
] as const;

export type EducationLevel = typeof educationLevels[number];
