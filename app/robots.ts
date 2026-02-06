import { MetadataRoute } from 'next'

// CHANGE THIS TO YOUR PRODUCTION DOMAIN
const BASE_URL = 'https://receeiptfree.online';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/_next/'],
        },
        sitemap: `${BASE_URL}/sitemap.xml`,
    }
}
