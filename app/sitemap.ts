
import { MetadataRoute } from 'next'
import { COUNTRIES, INDUSTRIES } from '../lib/pseo-data'

function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export default function sitemap(): MetadataRoute.Sitemap {
    const urls: MetadataRoute.Sitemap = [
        {
            url: 'https://freereceipt.online',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
    ]

    for (const country of COUNTRIES) {
        for (const city of country.cities) {
            const citySlug = slugify(city);
            for (const ind of INDUSTRIES) {
                const indSlug = ind.slug;
                const slug = `receipt-template-for-${indSlug}-in-${citySlug}`;
                urls.push({
                    url: `https://freereceipt.online/${slug}`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly',
                    priority: 0.8,
                });
            }
        }
    }

    return urls;
}
