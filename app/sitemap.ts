
import { MetadataRoute } from 'next'
import { COUNTRIES, INDUSTRIES } from '../lib/pseo-data'

export const revalidate = 3600

const VARIATIONS = [
    { prefix: 'receipt-template-for', label: 'Receipt Template' },
    { prefix: 'invoice-template-for', label: 'Invoice Template' },
    { prefix: 'bill-format-for', label: 'Bill Format' },
    { prefix: 'cash-receipt-for', label: 'Cash Receipt' },
    { prefix: 'payment-proof-for', label: 'Payment Proof' }
];

// Maximum URLs per sitemap file (Google limit is 50k, we stay safe at 40k)
const MAX_URLS_PER_SITEMAP = 40000;

export async function generateSitemaps() {
    const sitemaps = [];

    for (const country of COUNTRIES) {
        // Calculate total potential URLs for this country
        const totalUrls = country.cities.length * INDUSTRIES.length * VARIATIONS.length;
        const requiredSitemaps = Math.ceil(totalUrls / MAX_URLS_PER_SITEMAP);

        for (let i = 0; i < requiredSitemaps; i++) {
            sitemaps.push({ id: `${country.code}-${i}` });
        }
    }

    return sitemaps;
}

function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export default function sitemap({ id }: { id: string }): MetadataRoute.Sitemap {
    // id format: "CODE-CHUNK_INDEX" e.g. "US-0", "US-1"
    const [countryCode, chunkIndexStr] = id.split('-');
    const chunkIndex = parseInt(chunkIndexStr, 10);

    const country = COUNTRIES.find(c => c.code === countryCode);
    if (!country) return [];

    const urls: MetadataRoute.Sitemap = [];

    // Flatten all combinations for this country
    const allCombinations: { city: string, industry: any, vary: any }[] = [];

    for (const city of country.cities) {
        for (const ind of INDUSTRIES) {
            for (const vary of VARIATIONS) {
                allCombinations.push({ city, industry: ind, vary });
            }
        }
    }

    // Slice the array based on chunk index
    const start = chunkIndex * MAX_URLS_PER_SITEMAP;
    const end = start + MAX_URLS_PER_SITEMAP;
    const chunk = allCombinations.slice(start, end);

    for (const combo of chunk) {
        const citySlug = slugify(combo.city);
        const indSlug = combo.industry.slug;
        // Construct URL: /prefix-industry-in-city
        // e.g. /receipt-template-for-plumber-in-new-york
        const slug = `${combo.vary.prefix}-${indSlug}-in-${citySlug}`;

        urls.push({
            url: `https://freereceipt.online/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        });
    }

    // Add homepage only to the first chunk of US
    if (countryCode === 'US' && chunkIndex === 0) {
        urls.push({
            url: 'https://freereceipt.online',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        });
    }

    return urls;
}
