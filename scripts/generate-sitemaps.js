// Script untuk generate sitemap fisik - LIMITED TO 30k URLs
// Jalankan dengan: node scripts/generate-sitemaps.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import data dari lib/pseo-data.js
import { COUNTRIES, INDUSTRIES, VARIATIONS } from '../lib/pseo-data.js';

const BASE_URL = 'https://freereceipt.online';
const MAX_URLS_PER_SITEMAP = 1000;
const TOTAL_LIMIT = 30000;
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'sitemaps');

// Buat folder sitemaps jika belum ada
if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function createSitemapXml(urls) {
    const urlsXml = urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
}

function createSitemapIndexXml(sitemapFiles) {
    const sitemapsXml = sitemapFiles.map(file => `  <sitemap>
    <loc>${BASE_URL}/sitemaps/${file}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapsXml}
</sitemapindex>`;
}

function main() {
    console.log('🚀 Generating LIMITED sitemaps...');
    console.log(`📊 Total Limit: ${TOTAL_LIMIT.toLocaleString()}`);

    const sitemapFiles = [];
    let currentUrls = [];
    let fileIndex = 1;
    let totalUrls = 0;

    // Homepage dulu
    currentUrls.push({ loc: BASE_URL, priority: '1.0', changefreq: 'daily' });
    totalUrls++;

    // Loop semua kombinasi
    outerLoop:
    for (const country of COUNTRIES) {
        for (const city of country.cities) {
            for (const ind of INDUSTRIES) {
                for (const vary of VARIATIONS) {
                    if (totalUrls >= TOTAL_LIMIT) break outerLoop;

                    const slug = `${vary.prefix}-${ind.slug}-in-${slugify(city)}`;
                    currentUrls.push({
                        loc: `${BASE_URL}/${slug}`,
                        priority: '0.8',
                        changefreq: 'monthly'
                    });
                    totalUrls++;

                    // Kalau sudah sesuai limit per file, simpan file
                    if (currentUrls.length >= MAX_URLS_PER_SITEMAP) {
                        const filename = `sitemap-${fileIndex}.xml`;
                        const xml = createSitemapXml(currentUrls);
                        fs.writeFileSync(path.join(PUBLIC_DIR, filename), xml);
                        sitemapFiles.push(filename);
                        console.log(`✅ Created ${filename} with ${currentUrls.length} URLs`);

                        currentUrls = [];
                        fileIndex++;
                    }
                }
            }
        }
    }

    // Simpan sisa URLs
    if (currentUrls.length > 0) {
        const filename = `sitemap-${fileIndex}.xml`;
        const xml = createSitemapXml(currentUrls);
        fs.writeFileSync(path.join(PUBLIC_DIR, filename), xml);
        sitemapFiles.push(filename);
        console.log(`✅ Created ${filename} with ${currentUrls.length} URLs`);
    }

    // Create sitemap index di public root
    const indexXml = createSitemapIndexXml(sitemapFiles);
    fs.writeFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), indexXml);
    console.log(`✅ Created sitemap.xml (index) pointing to ${sitemapFiles.length} sitemaps`);

    console.log(`\n🎉 Done! Total URLs: ${totalUrls.toLocaleString()}`);
    console.log(`📁 Files created: ${sitemapFiles.length + 1}`);
}

main();
