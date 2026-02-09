/**
 * Google Indexing API Script - AUTOMATED PROGRESS
 * 
 * Penggunaan: node scripts/google-indexing.js
 */

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KEY_FILE = path.join(__dirname, '..', 'service-account.json');
const PROGRESS_FILE = path.join(__dirname, '..', 'indexing-progress.json');

// Cek apakah file kunci ada
if (!fs.existsSync(KEY_FILE)) {
    console.error('❌ ERROR: File service-account.json tidak ditemukan!');
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
        return { success: true };
    } catch (err) {
        if (err.message.includes('Quota exceeded')) {
            console.error('⚠️ QUOTA EXCEEDED: Jatah harian habis. Berhenti di sini.');
            return { success: false, quotaExceeded: true };
        }
        console.error(`❌ Failed: ${url} - ${err.message}`);
        return { success: false };
    }
}

async function main() {
    console.log('🚀 Starting Automated Google Indexing...');

    // 1. Baca progress terakhir
    let lastIndex = 0;
    if (fs.existsSync(PROGRESS_FILE)) {
        const progressData = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
        lastIndex = progressData.lastIndex || 0;
    }

    // 2. Kumpulkan SEMUA URL dari SEMUA sitemap
    const sitemapsDir = path.join(__dirname, '..', 'public', 'sitemaps');
    if (!fs.existsSync(sitemapsDir)) {
        console.error('❌ ERROR: Folder public/sitemaps tidak ditemukan!');
        process.exit(1);
    }

    const sitemapFiles = fs.readdirSync(sitemapsDir).filter(f => f.endsWith('.xml')).sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)[0]);
        const numB = parseInt(b.match(/\d+/)[0]);
        return numA - numB;
    });

    let allUrls = [];
    for (const file of sitemapFiles) {
        const content = fs.readFileSync(path.join(sitemapsDir, file), 'utf8');
        const matches = content.match(/<loc>(.*?)<\/loc>/g);
        if (matches) {
            allUrls.push(...matches.map(val => val.replace(/<\/?loc>/g, '')));
        }
    }

    console.log(`📊 Total URLs discovered: ${allUrls.length.toLocaleString()}`);
    console.log(`📡 Resuming from index: ${lastIndex}`);

    // 3. Ambil jatah hari ini
    const BATCH_SIZE = 200;
    const toSubmit = allUrls.slice(lastIndex, lastIndex + BATCH_SIZE);

    if (toSubmit.length === 0) {
        console.log('🎉 SEMUA URL sudah selesai diajukan!');
        return;
    }

    let currentSuccessCount = 0;
    for (let i = 0; i < toSubmit.length; i++) {
        const result = await submitUrl(toSubmit[i]);

        if (result.success) {
            currentSuccessCount++;
            lastIndex++;
            // Update progress setiap sukses
            fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ lastIndex, lastUpdated: new Date().toISOString() }, null, 2));
        }

        if (result.quotaExceeded) {
            break;
        }

        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`\n✅ Done! Berhasil mengajukan ${currentSuccessCount} URL baru.`);
    console.log(`📊 Progress: ${lastIndex} / ${allUrls.length} total URLs.`);
    if (lastIndex < allUrls.length) {
        console.log('💡 Silakan jalankan lagi besok untuk sisa URL lainnya.');
    }
}

main();
