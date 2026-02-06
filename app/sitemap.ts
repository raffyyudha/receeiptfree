
import { MetadataRoute } from 'next'
import { COUNTRIES, INDUSTRIES } from '../lib/pseo-data'


export const revalidate = 3600 // Revalidate every hour

export async function generateSitemaps() {
    return COUNTRIES.map((c) => ({ id: c.code }))
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
    // 'id' here will be the country code (e.g. 'US', 'AU') passed from generateSitemaps

    const country = COUNTRIES.find(c => c.code === id);
    if (!country) return [];

    const urls: MetadataRoute.Sitemap = [];

    // Generate Loop for THIS specific country
    // Multplying scale: Cities * Industries
    for (const city of country.cities) {
        const citySlug = slugify(city);
        for (const ind of INDUSTRIES) {
            const indSlug = ind.slug;

            // Standard Variation
            urls.push({
                url: `https://freereceipt.online/receipt-template-for-${indSlug}-in-${citySlug}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.8,
            });

            // Variation 2: "invoice-generator-..." (Doubling the count)
            // We can enable this to literally double the page count instantly
            /*
            urls.push({
              url: `https://freereceipt.online/invoice-generator-${indSlug}-${citySlug}`,
              lastModified: new Date(),
              changeFrequency: 'monthly',
              priority: 0.7,
            });
            */
        }
    }

    // If this is the 'US' sitemap, add the homepage too
    if (id === 'US') {
        urls.push({
            url: 'https://freereceipt.online',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        });
    }

    return urls;
}
