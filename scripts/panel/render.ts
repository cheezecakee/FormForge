import type { Profile, About, Contact, Address, Identification, WorkHistory, Education, Legal, Language, Skill, Links, Salary, CoverLetter, FAQ } from '../types.ts';

type OnClick = (value: string) => void;

// ─── Template Helpers ─────────────────────────────────────────────

const cloneTemplate = (shadow: ShadowRoot, id: string): HTMLElement => {
    const template = shadow.getElementById(id) as HTMLTemplateElement;
    return template.content.firstElementChild!.cloneNode(true) as HTMLElement;
};

const createSection = (shadow: ShadowRoot, title: string, extraClass?: string): { section: HTMLElement, content: HTMLElement } => {
    const section = cloneTemplate(shadow, 'forge-section-template');
    if (extraClass) section.classList.add(extraClass);
    section.querySelector('.forge-section-title')!.textContent = title;
    const content = section.querySelector('.forge-section-content') as HTMLElement;
    return { section, content };
};

const createEntry = (shadow: ShadowRoot, header: string): { entry: HTMLElement, fields: HTMLElement } => {
    const entry = cloneTemplate(shadow, 'forge-entry-template');
    entry.querySelector('.forge-entry-header')!.textContent = header;
    const fields = entry.querySelector('.forge-entry-fields') as HTMLElement;
    return { entry, fields };
};

const createFieldRow = (shadow: ShadowRoot, label: string, value: string, onClick: OnClick, displayValue?: string): HTMLElement => {
    const row = cloneTemplate(shadow, 'forge-field-row-template');

    row.querySelector('.forge-field-label')!.textContent = label;

    const btn = row.querySelector('.forge-field-btn')!;
    btn.textContent = displayValue ?? value;
    btn.addEventListener('click', () => onClick(value));
    return row;
};

// Plain button — used for unlabelled items (skills, languages)
const createBtn = (shadow: ShadowRoot, value: string, onClick: OnClick): HTMLElement => {
    const btn = cloneTemplate(shadow, 'forge-btn-template');
    btn.textContent = value;
    btn.addEventListener('click', () => onClick(value));
    return btn;
};

const appendRows = (
    container: HTMLElement,
    fields: {
        label: string;
        value?: string | undefined | null;
        displayValue?: string;
    }[],
    shadow: ShadowRoot,
    onClick: OnClick
): void => {
    fields.forEach(({ label, value, displayValue }) => {
        if (!value) return;

        container.appendChild(
            createFieldRow(
                shadow,
                label,
                value,
                onClick,
                displayValue,
            ));
    });
};

// ─── Section Renderers ────────────────────────────────────────────

const renderAbout = (about: About, content: HTMLElement, shadow: ShadowRoot, onClick: OnClick): void => {
    appendRows(content, [
        { label: 'Prefix', value: about.prefix },
        { label: 'First Name', value: about.firstName },
        { label: 'Middle Name', value: about.middleName },
        { label: 'Last Name', value: about.lastName },
        { label: 'Full Name', value: about.fullName },
        { label: 'Preferred Name', value: about.preferredName },
        { label: 'Birth Date', value: about.birthDate },
        { label: 'Citizenship', value: about.citizenship },
        { label: 'Nationality', value: about.nationality },
        { label: 'Gender', value: about.gender },
        { label: 'Race', value: about.race },
        { label: 'Hispanic / Latino', value: about.hispanicOrLatino != null ? String(about.hispanicOrLatino) : null },
    ], shadow, onClick);
};

const renderContact = (contact: Contact, content: HTMLElement, shadow: ShadowRoot, onClick: OnClick): void => {
    appendRows(content, [
        { label: 'Email', value: contact.email },
        { label: 'Country Code', value: contact.countryCode },
        { label: 'Phone', value: contact.phone },
        { label: 'Mobile', value: contact.mobile },
    ], shadow, onClick);
};

const renderAddresses = (addresses: Address[], content: HTMLElement, shadow: ShadowRoot, onClick: OnClick): void => {
    addresses.forEach(address => {
        const header = `${address.type === 'current' ? 'Current' : 'Permanent'} — ${address.city}, ${address.country}`;
        const { entry, fields } = createEntry(shadow, header);
        appendRows(fields, [
            { label: 'Line 1', value: address.line1 },
            { label: 'Line 2', value: address.line2 },
            { label: 'City', value: address.city },
            { label: 'State', value: address.state },
            { label: 'Country', value: address.country },
            { label: 'Zip Code', value: address.zipCode },
        ], shadow, onClick);
        content.appendChild(entry);
    });
};

const renderIdentification = (entries: Identification[], content: HTMLElement, shadow: ShadowRoot, onClick: OnClick): void => {
    entries.forEach(id => {
        const header = id.customType ?? id.type.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const { entry, fields } = createEntry(shadow, header);
        appendRows(fields, [
            { label: 'Type', value: id.customType ?? id.type },
            { label: 'Value', value: id.value },
            { label: 'Country', value: id.country },
            { label: 'Expiry', value: id.expiry },
        ], shadow, onClick);
        content.appendChild(entry);
    });
};

const renderWorkHistory = (entries: WorkHistory[], content: HTMLElement, shadow: ShadowRoot, onClick: OnClick): void => {
    entries.forEach(work => {
        const header = [work.title, work.company].filter(Boolean).join(' - ');
        const { entry, fields } = createEntry(shadow, header);
        appendRows(fields, [
            { label: 'Title', value: work.title },
            { label: 'Company', value: work.company },
            { label: 'Location', value: work.location },
            { label: 'Start Date', value: work.startDate },
            { label: 'End Date', value: work.current ? 'Present' : work.endDate },
            { label: 'Description', value: work.description },
        ], shadow, onClick);
        content.appendChild(entry);
    });
};

const renderEducation = (entries: Education[], content: HTMLElement, shadow: ShadowRoot, onClick: OnClick): void => {
    entries.forEach(edu => {
        const header = [edu.level, edu.institution].filter(Boolean).join(' — ');
        const { entry, fields } = createEntry(shadow, header);
        appendRows(fields, [
            { label: 'Level', value: edu.level },
            { label: 'Institution', value: edu.institution },
            { label: 'Location', value: edu.location },
            { label: 'Degree', value: edu.degree },
            { label: 'Field of Study', value: edu.fieldOfStudy },
            { label: 'Start Date', value: edu.startDate },
            { label: 'End Date', value: edu.endDate },
            { label: 'GPA', value: edu.gpa },
            { label: 'Honors', value: edu.honors },
        ], shadow, onClick);
        content.appendChild(entry);
    });
};

const renderLegal = (legal: Legal, content: HTMLElement, shadow: ShadowRoot, onClick: OnClick): void => {
    const boolVal = (v?: boolean | null) => v != null ? (v ? 'Yes' : 'No') : null;
    appendRows(content, [
        { label: 'Work Authorized', value: boolVal(legal.workAuthorized) },
        { label: 'Sponsorship', value: boolVal(legal.requireSponsorship) },
        { label: 'Disability', value: boolVal(legal.disability) },
        { label: 'Veteran', value: boolVal(legal.veteran) },
        { label: 'Criminal Record', value: boolVal(legal.criminal) },
    ], shadow, onClick);
};

const renderLanguages = (languages: Language[], content: HTMLElement, shadow: ShadowRoot, onClick: OnClick): void => {
    languages.forEach(l => content.appendChild(createBtn(shadow, `${l.language} — ${l.proficiency}`, onClick)));
};

const renderSkills = (skills: Skill[], content: HTMLElement, shadow: ShadowRoot, onClick: OnClick): void => {
    skills.forEach(s => content.appendChild(createBtn(shadow, s.name, onClick)));
};

const displayLink = (url?: string): string | undefined => {
    if (!url) return undefined;

    const clean = url
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '');

    if (clean.startsWith('linkedin.com/in/')) {
        return clean.replace('linkedin.com/in/', '');
    }

    if (clean.startsWith('github.com/')) {
        return clean.replace('github.com/', '');
    }

    if (clean.startsWith('x.com/')) {
        return `@${clean.replace('x.com/', '')}`;
    }

    if (clean.startsWith('twitter.com/')) {
        return `@${clean.replace('twitter.com/', '')}`;
    }

    if (clean.startsWith('instagram.com/')) {
        return `@${clean.replace('instagram.com/', '')}`;
    }

    return clean;
};

const renderLinks = (
    links: Links,
    content: HTMLElement,
    shadow: ShadowRoot,
    onClick: OnClick
): void => {
    appendRows(content, [
        { label: 'LinkedIn', value: links.linkedIn, displayValue: displayLink(links.linkedIn) },
        { label: 'GitHub', value: links.github, displayValue: displayLink(links.github) },
        { label: 'X', value: links.x, displayValue: displayLink(links.x) },
        { label: 'Instagram', value: links.instagram, displayValue: displayLink(links.instagram) },
        { label: 'Portfolio', value: links.portfolio, displayValue: displayLink(links.portfolio) },
        { label: 'Website', value: links.website, displayValue: displayLink(links.website) },
        { label: 'Blog', value: links.blog, displayValue: displayLink(links.blog) },
    ], shadow, onClick);
};

const renderSalary = (salary: Salary, content: HTMLElement, shadow: ShadowRoot, onClick: OnClick): void => {
    appendRows(content, [
        { label: 'Min', value: String(salary.min) },
        { label: 'Max', value: salary.max != null ? String(salary.max) : null },
        { label: 'Currency', value: salary.currency },
        { label: 'Period', value: salary.period },
    ], shadow, onClick);
};

const renderCoverLetters = (entries: CoverLetter[], content: HTMLElement, shadow: ShadowRoot, onClick: OnClick): void => {
    const el = cloneTemplate(shadow, 'forge-select-template');
    const select = el.querySelector('.forge-select') as HTMLSelectElement;
    const selectContent = el.querySelector('.forge-select-content') as HTMLElement;

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Select a cover letter...';
    select.appendChild(placeholder);

    entries.forEach((cl, i) => {
        const opt = document.createElement('option');
        opt.value = String(i);
        opt.textContent = cl.label;
        select.appendChild(opt);
    });

    select.addEventListener('change', () => {
        selectContent.innerHTML = '';
        const idx = parseInt(select.value);
        if (isNaN(idx)) return;
        selectContent.appendChild(createBtn(shadow, entries[idx]?.body, onClick));
    });

    content.appendChild(el);
};

const renderFaq = (entries: FAQ[], content: HTMLElement, shadow: ShadowRoot, onClick: OnClick): void => {
    const el = cloneTemplate(shadow, 'forge-select-template');
    const select = el.querySelector('.forge-select') as HTMLSelectElement;
    const selectContent = el.querySelector('.forge-select-content') as HTMLElement;

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Select a question...';
    select.appendChild(placeholder);

    entries.forEach((faq, i) => {
        const opt = document.createElement('option');
        opt.value = String(i);
        opt.textContent = faq.question;
        select.appendChild(opt);
    });

    select.addEventListener('change', () => {
        selectContent.innerHTML = '';
        const idx = parseInt(select.value);
        if (isNaN(idx)) return;
        selectContent.appendChild(createBtn(shadow, entries[idx].answer, onClick));
    });

    content.appendChild(el);
};

// ─── Main Render ──────────────────────────────────────────────────

export const renderPanel = (profile: Profile, shadow: ShadowRoot, onClick: OnClick): void => {
    const container = shadow.querySelector('#forge-panel-content');
    if (!container) return;
    container.innerHTML = '';

    const add = (title: string, render: (content: HTMLElement) => void, extraClass?: string) => {
        const { section, content } = createSection(shadow, title, extraClass);
        render(content);
        if (content.children.length > 0) container.appendChild(section);
    };

    if (profile.about) add('About', c => renderAbout(profile.about!, c, shadow, onClick));
    if (profile.contact) add('Contact', c => renderContact(profile.contact!, c, shadow, onClick));
    if (profile.addresses?.length) add('Addresses', c => renderAddresses(profile.addresses!, c, shadow, onClick));
    if (profile.identification?.length) add('Identification', c => renderIdentification(profile.identification!, c, shadow, onClick));
    if (profile.workHistory?.length) add('Work History', c => renderWorkHistory(profile.workHistory!, c, shadow, onClick));
    if (profile.education?.length) add('Education', c => renderEducation(profile.education!, c, shadow, onClick));
    if (profile.legal) add('Legal', c => renderLegal(profile.legal!, c, shadow, onClick));
    if (profile.languages?.length) add('Languages', c => renderLanguages(profile.languages!, c, shadow, onClick));
    if (profile.skills?.length) add('Skills', c => renderSkills(profile.skills!, c, shadow, onClick));
    if (profile.links) add('Links', c => renderLinks(profile.links!, c, shadow, onClick));
    if (profile.salary) add('Salary', c => renderSalary(profile.salary!, c, shadow, onClick));
    if (profile.coverLetters?.length) add('Cover Letters', c => renderCoverLetters(profile.coverLetters!, c, shadow, onClick));
    if (profile.faq?.length) add('FAQ', c => renderFaq(profile.faq!, c, shadow, onClick));
};
