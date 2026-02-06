
import { MetadataRoute } from 'next'
import { COUNTRIES, INDUSTRIES, VARIATIONS } from '../lib/pseo-data'

export const revalidate = 3600

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
    if (!id || typeof id !== 'string' || !id.includes('-')) {
        return [];
    }

    // id format: "CODE-CHUNK_INDEX" e.g. "US-0", "US-1"
    const parts = id.split('-');
    if (parts.length < 2) return [];

    const countryCode = parts[0];
    const chunkIndex = parseInt(parts[1], 10);

    const country = COUNTRIES.find(c => c.code === countryCode);
    if (!country) return [];

    const urls: MetadataRoute.Sitemap = [];

    // Calculate start and end indices for the requested chunk
    const start = chunkIndex * MAX_URLS_PER_SITEMAP;
    const end = start + MAX_URLS_PER_SITEMAP;

    // Iterate through combinations and only collect those within the start/end range
    // This is MUCH more memory efficient than pre-building the entire list
    let currentIndex = 0;
    let itemsAdded = 0;

    for (const city of country.cities) {
        if (itemsAdded >= MAX_URLS_PER_SITEMAP) break;

        for (const ind of INDUSTRIES) {
            if (itemsAdded >= MAX_URLS_PER_SITEMAP) break;

            for (const vary of VARIATIONS) {
                if (currentIndex >= start && currentIndex < end) {
                    const citySlug = slugify(city);
                    const indSlug = ind.slug;
                    const slug = `${vary.prefix}-${indSlug}-in-${citySlug}`;

                    urls.push({
                        url: `https://freereceipt.online/${slug}`,
                        lastModified: new Date(),
                        changeFrequency: 'monthly',
                        priority: 0.8,
                    });
                    itemsAdded++;
                }

                currentIndex++;
                if (itemsAdded >= MAX_URLS_PER_SITEMAP) break;
            }
        }
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
