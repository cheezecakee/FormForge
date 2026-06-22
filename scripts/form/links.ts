import { getInput, setInput } from '../dom.ts';
import type { Links } from '../types.ts';

export const loadLinks = (links: Links): void => {
    setInput('linkedIn', links.linkedIn);
    setInput('github', links.github);
    setInput('x', links.x);
    setInput('instagram', links.instagram);
    setInput('portfolio', links.portfolio);
    setInput('website', links.website);
    setInput('blog', links.blog);
};

export const getLinks = (): Links => ({
    linkedIn: getInput('linkedIn') || undefined,
    github: getInput('github') || undefined,
    x: getInput('x') || undefined,
    instagram: getInput('instagram') || undefined,
    portfolio: getInput('portfolio') || undefined,
    website: getInput('website') || undefined,
    blog: getInput('blog') || undefined,
});
