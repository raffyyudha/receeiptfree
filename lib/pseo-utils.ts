
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

// --- NEW SEO HELPERS ---

export function generateFAQs(industry: any, city: string, country: any, variation: any) {
    const label = variation.label;
    const title = industry.title;

    return [
        {
            question: `How do I create a free ${label.toLowerCase()} for ${title} in ${city}?`,
            answer: `You can use our free tool to instantly generate a professional ${label.toLowerCase()} for ${title} services. simply fill in your business details, add line items for ${industry.items[0]} or ${industry.items[1]}, and download the PDF. It is optimized for ${city}, ${country.name} requirements.`
        },
        {
            question: `Is this ${label.toLowerCase()} template compliant with ${country.taxLabel}?`,
            answer: `Yes, our ${label.toLowerCase()} generator allows you to add custom tax rates, making it easy to comply with ${country.taxLabel} regulations in ${country.name}.`
        },
        {
            question: `Can I customize the ${label.toLowerCase()} for my ${title} business?`,
            answer: `Absolutely. You can add your logo, change colors, and edit all text fields to match your ${title} branding. It's perfect for freelancers and small businesses in ${city}.`
        },
        {
            question: `Is it really free?`,
            answer: `Yes, this tool is 100% free with no watermarks and no sign-up required. We support the ${city} business community.`
        }
    ];
}

export function getRelatedLinks(currentSlug: string, count: number = 6) {
    // We need to access the data arrays. Since they are exported from pseo-data.js, 
    // and this file imports them, we can use them.
    // However, recreating random logic here needs to be deterministic or genuinely random.
    // Ideally deterministic based on slug hash for consistency (good for SEO).

    // Hash function to pick consistent related items
    const hashCode = (s: string) => s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    const seed = Math.abs(hashCode(currentSlug));

    const getRandom = (arr: any[], n: number, offset: number) => {
        const result = [];
        const uniqueIndices = new Set();
        let attempts = 0;
        while (result.length < n && attempts < arr.length * 2) {
            const index = (seed + offset + attempts) % arr.length;
            if (!uniqueIndices.has(index)) {
                uniqueIndices.add(index);
                result.push(arr[index]);
            }
            attempts++;
        }
        return result;
    };

    // 1. Get current data to know context (this is expensive if we do full parsing again)
    // Instead, receiving the CURRENT data objects as arguments would be better.
    // But to keep signature simple, let's just pick totally random ones for now or parse quickly.

    // Better strategy: The CALLER (ClientPseoPage) already has the data. 
    // Let's export separate functions that take the LISTS as input.
    return {
        // Placeholder, logic moved to explicit functions below
    };
}

export function getNearbyLocations(currentCountry: any, currentCity: string, count: number = 8) {
    // Filter cities in same country, exclude current city
    const otherCities = currentCountry.cities.filter((c: string) => c !== currentCity);
    // Shuffle deterministically
    // For simplicity, just pick evenly spaced or random slice
    if (otherCities.length <= count) return otherCities;

    const start = Math.floor(Math.random() * (otherCities.length - count)); // Randomized mostly for variety on refresh, or use seed if needed
    return otherCities.slice(start, start + count);
}

export function getRelatedIndustries(currentIndustry: any, count: number = 8) {
    const otherInds = INDUSTRIES.filter(i => i.slug !== currentIndustry.slug);
    if (otherInds.length <= count) return otherInds;

    const start = Math.floor(Math.random() * (otherInds.length - count));
    return otherInds.slice(start, start + count);
}

