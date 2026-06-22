import { LoadProfile } from './storage.ts';
import { toTitle } from './dom.ts';
import type {
    About,
    Contact,
    Address,
    Language,
    Skill,
    Links,
    Legal,
    Identification,
    WorkHistory,
    Education,
    CoverLetter,
    FAQ,
    Salary
} from './types.ts';

const SECTION_LABELS = {
    about: 'About',
    contact: 'Contact',
    addresses: 'Addresses',
    workHistory: 'Work History',
    education: 'Education',
    identification: 'Identification',
    legal: 'Legal',
    coverLetters: 'Cover Letters',
    faq: 'FAQ',
    languages: 'Languages',
    skills: 'Skills',
    links: 'Links',
    salary: 'Salary',
} as const;

// ─── Helpers ─────────────────────────────────────────────────────

const cloneTemplate = (id: string): HTMLElement => {
    const template = document.getElementById(id) as HTMLTemplateElement;
    return template.content.firstElementChild!.cloneNode(true) as HTMLElement;
};

const createField = (
    label: string,
    value?: string | number | null
): HTMLElement => {
    const el = cloneTemplate('view-field-template');

    el.querySelector('.view-label')!.textContent = label;
    el.querySelector('.view-value')!.textContent =
        value !== undefined && value !== null && value !== ''
            ? String(value)
            : '—';

    return el;
};

const createBoolField = (
    label: string,
    value?: boolean | null
): HTMLElement =>
    createField(
        label,
        value === true
            ? 'Yes'
            : value === false
                ? 'No'
                : 'Not specified'
    );

const createSection = (
    title: string
): { section: HTMLElement; content: HTMLElement } => {
    const section = cloneTemplate('view-section-template');

    section.querySelector('.view-section-title')!.textContent = title;

    return {
        section,
        content: section.querySelector('.view-section-content') as HTMLElement,
    };
};

const createEntry = (): HTMLElement =>
    cloneTemplate('view-entry-template');

const appendFields = (
    container: HTMLElement,
    fields: HTMLElement[]
): void => {
    fields.forEach(field => container.appendChild(field));
};

const appendEntries = (
    content: HTMLElement,
    entries: HTMLElement[]
): void => {
    entries.forEach(entry => {
        content.appendChild(entry);
    });
};

// ─── Renderers ───────────────────────────────────────────────────

const renderAbout = (about: About, container: HTMLElement): void => {
    const { section, content } = createSection(SECTION_LABELS.about);

    appendFields(content, [
        createField('Prefix', about.prefix),
        createField('First Name', about.firstName),
        createField('Middle Name', about.middleName),
        createField('Last Name', about.lastName),
        createField('Full Name', about.fullName),
        createField('Preferred Name', about.preferredName),
        createField('Birth Date', about.birthDate),
        createField('Citizenship', about.citizenship),
        createField('Nationality', about.nationality),
        createField('Gender', about.gender),
        createField('Race', about.race),
        createBoolField('Hispanic or Latino', about.hispanicOrLatino),
    ]);

    container.appendChild(section);
};

const renderContact = (contact: Contact, container: HTMLElement): void => {
    const { section, content } = createSection(SECTION_LABELS.contact);

    appendFields(content, [
        createField('Email', toTitle(contact.email)),
        createField('Country Code', contact.countryCode),
        createField('Phone', contact.phone),
        createField('Mobile', contact.mobile),
    ]);

    container.appendChild(section);
};

const renderAddresses = (
    addresses: Address[],
    container: HTMLElement
): void => {
    const { section, content } = createSection(SECTION_LABELS.addresses);

    const entries = addresses.map(address => {
        const entry = createEntry();

        appendFields(entry, [
            createField('Type', address.type === 'current' ? 'Current' : 'Permanent'),
            createField('Line 1', address.line1),
            createField('Line 2', address.line2),
            createField('City', address.city),
            createField('State', address.state),
            createField('Country', address.country),
            createField('Zip Code', address.zipCode),
        ]);

        return entry;
    });

    appendEntries(content, entries);
    container.appendChild(section);
};

const renderIdentification = (
    entries: Identification[],
    container: HTMLElement
): void => {
    const { section, content } =
        createSection(SECTION_LABELS.identification);

    appendEntries(
        content,
        entries.map(id => {
            const entry = createEntry();

            appendFields(entry, [
                createField(
                    'Type',
                    id.type.replace(/-/g, ' ')
                        .replace(/\b\w/g, c => c.toUpperCase())
                ),
                ...(id.type === 'custom'
                    ? [createField('Custom Type', id.customType)]
                    : []),
                createField('Value', id.value),
                createField('Country', id.country),
                createField('Expiry', id.expiry),
            ]);

            return entry;
        })
    );

    container.appendChild(section);
};

const renderWorkHistory = (
    entries: WorkHistory[],
    container: HTMLElement
): void => {
    const { section, content } =
        createSection(SECTION_LABELS.workHistory);

    appendEntries(
        content,
        entries.map(work => {
            const entry = createEntry();

            appendFields(entry, [
                createField('Title', work.title),
                createField('Company', work.company),
                createField('Location', work.location),
                createField('Start Date', work.startDate),
                createField('End Date', work.current ? 'Present' : work.endDate),
                createField('Description', work.description),
            ]);

            return entry;
        })
    );

    container.appendChild(section);
};

const renderEducation = (
    entries: Education[],
    container: HTMLElement
): void => {
    const { section, content } =
        createSection(SECTION_LABELS.education);

    appendEntries(
        content,
        entries.map(edu => {
            const entry = createEntry();

            appendFields(entry, [
                createField('Level', toTitle(edu.level)),
                createField('Institution', edu.institution),
                createField('Location', edu.location),
                createField('Degree', edu.degree),
                createField('Field of Study', edu.fieldOfStudy),
                createField('Start Date', edu.startDate),
                createField('End Date', edu.endDate),
                createField('GPA', edu.gpa),
                createField('Honors', edu.honors),
            ]);

            return entry;
        })
    );

    container.appendChild(section);
};

const renderLegal = (
    legal: Legal,
    container: HTMLElement
): void => {
    const { section, content } = createSection(SECTION_LABELS.legal);

    appendFields(content, [
        createBoolField('Work Authorized', legal.workAuthorized),
        createBoolField('Requires Sponsorship', legal.requireSponsorship),
        createBoolField('Disability', legal.disability),
        createBoolField('Veteran', legal.veteran),
        createBoolField('Criminal Record', legal.criminal),
    ]);

    container.appendChild(section);
};

const renderSkills = (
    skills: Skill[],
    container: HTMLElement
): void => {
    const { section, content } =
        createSection(SECTION_LABELS.skills);

    const list = document.createElement('div');
    list.className = 'skill-list';

    skills.forEach(skill => {
        const item = document.createElement('span');
        item.className = 'skill-item';
        item.textContent = skill.name;
        list.appendChild(item);
    });

    content.appendChild(list);
    container.appendChild(section);
};

const renderLanguages = (
    languages: Language[],
    container: HTMLElement
): void => {
    const { section, content } =
        createSection(SECTION_LABELS.languages);

    appendFields(
        content,
        languages.map(language =>
            createField(language.language, toTitle(language.proficiency))
        )
    );

    container.appendChild(section);
};

const renderLinks = (
    links: Links,
    container: HTMLElement
): void => {
    const { section, content } =
        createSection(SECTION_LABELS.links);

    appendFields(content, [
        createField('LinkedIn', links.linkedIn),
        createField('GitHub', links.github),
        createField('X', links.x),
        createField('Instagram', links.instagram),
        createField('Portfolio', links.portfolio),
        createField('Website', links.website),
        createField('Blog', links.blog),
    ]);

    container.appendChild(section);
};

const renderSalary = (
    salary: Salary,
    container: HTMLElement
): void => {
    const { section, content } =
        createSection(SECTION_LABELS.salary);

    appendFields(content, [
        createField('Minimum', salary.min),
        createField('Maximum', salary.max),
        createField('Currency', salary.currency),
        createField('Period', toTitle(salary.period)),
    ]);

    container.appendChild(section);
};

const renderCoverLetters = (
    entries: CoverLetter[],
    container: HTMLElement
): void => {
    const { section, content } =
        createSection(SECTION_LABELS.coverLetters);

    appendEntries(
        content,
        entries.map(letter => {
            const entry = createEntry();

            appendFields(entry, [
                createField('Label', letter.label),
                createField('Body', letter.body),
            ]);

            return entry;
        })
    );

    container.appendChild(section);
};

const renderFAQs = (
    entries: FAQ[],
    container: HTMLElement
): void => {
    const { section, content } =
        createSection(SECTION_LABELS.faq);

    appendEntries(
        content,
        entries.map(faq => {
            const entry = createEntry();

            appendFields(entry, [
                createField('Question', faq.question),
                createField('Answer', faq.answer),
            ]);

            return entry;
        })
    );

    container.appendChild(section);
};

// ─── Init ────────────────────────────────────────────────────────

export const initView = async (): Promise<void> => {
    const container = document.getElementById('profile-view');

    if (!container) return;

    const profile = await LoadProfile();

    if (!profile) {
        const empty = document.createElement('p');
        empty.textContent =
            'No profile data found. Go to Edit to add your information.';
        container.appendChild(empty);
        return;
    }

    if (profile.about) renderAbout(profile.about, container);
    if (profile.contact) renderContact(profile.contact, container);
    if (profile.addresses?.length) renderAddresses(profile.addresses, container);
    if (profile.identification?.length) renderIdentification(profile.identification, container);
    if (profile.workHistory?.length) renderWorkHistory(profile.workHistory, container);
    if (profile.education?.length) renderEducation(profile.education, container);
    if (profile.legal) renderLegal(profile.legal, container);
    if (profile.faq?.length) renderFAQs(profile.faq, container);
    if (profile.languages?.length) renderLanguages(profile.languages, container);
    if (profile.skills?.length) renderSkills(profile.skills, container);
    if (profile.links) renderLinks(profile.links, container);
    if (profile.salary) renderSalary(profile.salary, container);
    if (profile.coverLetters?.length) renderCoverLetters(profile.coverLetters, container);
};
