import type { Profile } from "./types";
import { Websites } from './const.ts';

export async function LoadProfile(): Promise<Profile | null> {
    return new Promise((resolve) => {
        chrome.storage.local.get(['profile'], (result) => {
            resolve((result.profile as Profile) ?? null);
        });
    });
}

export async function SaveProfile(profile: Profile): Promise<void> {
    return new Promise((resolve) => {
        chrome.storage.local.set({ profile }, () => resolve());
    });
}

export async function ClearProfile(): Promise<void> {
    return new Promise((resolve) => {
        chrome.storage.local.remove('profile', () => resolve());
    });
}

export async function LoadCustomSites(): Promise<string[]> {
    return new Promise((resolve) => {
        chrome.storage.local.get(['customSites'], (result) => {
            resolve((result.customSites as string[]) ?? []);
        });
    });
}

export async function SaveCustomSites(sites: string[]): Promise<void> {
    return new Promise((resolve) => {
        chrome.storage.local.set({ customSites: sites }, () => resolve());
    });
}

export async function LoadAllSites(): Promise<string[]> {
    const custom = await LoadCustomSites();
    return [...Websites, ...custom];
}
