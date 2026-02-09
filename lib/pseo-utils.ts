
import { COUNTRIES, INDUSTRIES, VARIATIONS } from './pseo-data';

export function slugify(text: string) {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export function getDataFromSlug(slug: string) {
    if (!slug) return null;
    let normalizedSlug = slugify(slug);

    // 1. Find Variation (Prefix) - O(V) ~30 items
    // Sort by length to match longest prefix first
    const sortedVariations = [...VARIATIONS].sort((a, b) => b.prefix.length - a.prefix.length);
    const variation = sortedVariations.find(v => normalizedSlug.startsWith(slugify(v.prefix) + '-'));

    if (!variation) return null;

    // Remove prefix and the hyphen e.g. "receipt-template-for-plumber-in-new-york" -> "plumber-in-new-york"
    const remaining = normalizedSlug.slice(slugify(variation.prefix).length + 1);

    // 2. Split by "-in-" to separate Industry and City
    // Use lastIndexOf in case industry slug accidentally contains "-in-" (unlikely but safer)
    const splitIndex = remaining.lastIndexOf('-in-');
    if (splitIndex === -1) return null;

    const industrySlug = remaining.substring(0, splitIndex);
    const citySlug = remaining.substring(splitIndex + 4); // "-in-" length is 4

    // 3. Find Industry - O(I) ~150 items
    // Industry slug is defined in pseo-data.js so look for exact match
    const industry = INDUSTRIES.find(i => slugify(i.slug) === industrySlug);
    if (!industry) return null;

    // 4. Find City & Country - O(C) ~1000 items
    // We iterate countries, then check if slugified city matches
    for (const country of COUNTRIES) {
        for (const c of country.cities) {
            if (slugify(c) === citySlug) {
                // STRICT VALIDATION: Ensure all required data exists
                if (!country || !c || !industry || !variation) return null;
                if (!industry.title || !industry.verb) return null; // Integrity check

                return { country, city: c, industry, variation };
            }
        }
    }

    return null;
}
