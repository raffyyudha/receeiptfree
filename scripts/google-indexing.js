/**
 * Google Indexing API Script
 * 
 * Penggunaan: node scripts/google-indexing.js
 * 
 * PERSIAPAN WAJIB:
 * 1. Simpan file 'service-account.json' di root folder ini.
 * 2. Undang email service account tersebut ke Google Search Console sebagai 'Owner'.
 */

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KEY_FILE = path.join(__dirname, '..', 'service-account.json');

// Cek apakah file kunci ada
if (!fs.existsSync(KEY_FILE)) {
    console.error('❌ ERROR: File service-account.json tidak ditemukan di root folder!');
    console.log('Silakan buat Service Account di Google Cloud Console dan simpan kuncinya di sini.');
    process.exit(1);
}

// Konfigurasi Auth
const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/indexing'],
});

const indexing = google.indexing('v3');

async function submitUrl(url) {
    try {
        const authClient = await auth.getClient();
        google.options({ auth: authClient });

        const res = await indexing.urlNotifications.publish({
            requestBody: {
                url: url,
                type: 'URL_UPDATED',
            },
        });
        console.log(`✅ Success: ${url} (Status: ${res.status})`);
        return true;
    } catch (err) {
        console.error(`❌ Failed: ${url} - ${err.message}`);
        return false;
    }
}

async function main() {
    // Ambil daftar URL dari sitemap terbaru atau manual
    // Untuk contoh ini, kita akan ambil 200 URL (limit harian default API Indexing)
    console.log('🚀 Starting Google Indexing process...');

    // Alamat sitemap-1 sebagai sumber URL awal
    const sitemapPath = path.join(__dirname, '..', 'public', 'sitemaps', 'sitemap-1.xml');

    if (!fs.existsSync(sitemapPath)) {
        console.error('❌ ERROR: public/sitemaps/sitemap-1.xml tidak ditemukan. Jalankan generate-sitemaps dulu!');
        process.exit(1);
    }

    const content = fs.readFileSync(sitemapPath, 'utf8');
    const urls = content.match(/<loc>(.*?)<\/loc>/g).map(val => val.replace(/<\/?loc>/g, ''));

    // Ambil maksimal 200 (Quota harian standar Google)
    const toSubmit = urls.slice(0, 200);
    console.log(`📊 Found ${urls.length} URLs. Submitting top ${toSubmit.length}...`);

    for (const url of toSubmit) {
        await submitUrl(url);
        // Delay 100ms biar ga kena rate limit terlalu cepat
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n🎉 Indexing jobs finished for today!');
}

main();
