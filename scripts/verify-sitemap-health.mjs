import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONCURRENCY = 50; // Check 50 URLs at once
const TIMEOUT_MS = 10000; // 10 seconds timeout
const SITEMAP_DIR = path.join(__dirname, '../public/sitemaps');
const REPORT_FILE = path.join(__dirname, '../health-check-report.json');

// Colors for console
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

async function main() {
    console.log(`${colors.cyan}🚀 Starting Sitemap Health Check...${colors.reset}`);

    // 1. Collect URLs
    const files = fs.readdirSync(SITEMAP_DIR).filter(f => f.endsWith('.xml'));
    if (files.length === 0) {
        console.error(`${colors.red}❌ No sitemaps found in ${SITEMAP_DIR}${colors.reset}`);
        process.exit(1);
    }

    let urls = [];
    console.log(`${colors.yellow}📂 Reading ${files.length} sitemap files...${colors.reset}`);

    for (const file of files) {
        const content = fs.readFileSync(path.join(SITEMAP_DIR, file), 'utf-8');
        const matches = content.match(/<loc>(.*?)<\/loc>/g);
        if (matches) {
            urls.push(...matches.map(m => m.replace(/<\/?loc>/g, '')));
        }
    }

    // Deduplicate
    urls = [...new Set(urls)];
    const totalUrls = urls.length;
    console.log(`${colors.green}📊 Found ${totalUrls.toLocaleString()} unique URLs to check.${colors.reset}\n`);

    // 2. Check URLs with Concurrency
    let results = {
        total: totalUrls,
        success: 0,
        failed: 0,
        errors: []
    };

    let completed = 0;
    const startTime = Date.now();

    // Helper to update progress
    const updateProgress = () => {
        const percent = ((completed / totalUrls) * 100).toFixed(1);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
        process.stdout.write(`\r⏳ Checking: ${percent}% | ✅ ${results.success} | ❌ ${results.failed} | ⏱️ ${elapsed}s`);
    };

    // Worker function
    const checkUrl = async (url) => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

            const res = await fetch(url, {
                method: 'HEAD', // HEAD is faster than GET
                signal: controller.signal,
                headers: { 'User-Agent': 'SitemapHealthBot/1.0' }
            });

            clearTimeout(timeoutId);

            if (res.ok) {
                results.success++;
            } else {
                results.failed++;
                // Double check with GET if HEAD fails (some servers block HEAD)
                if (res.status === 405 || res.status === 404) {
                    const resGet = await fetch(url, { method: 'GET', signal: controller.signal });
                    if (resGet.ok) {
                        results.success++;
                        results.failed--; // Revert failure
                        return;
                    }
                }

                results.errors.push({ url, status: res.status, statusText: res.statusText });
                // Print error immediately
                process.stdout.write(`\n${colors.red}❌ [${res.status}] ${url}${colors.reset}\n`);
            }
        } catch (err) {
            results.failed++;
            results.errors.push({ url, error: err.message });
            process.stdout.write(`\n${colors.red}❌ [ERR] ${url} : ${err.message}${colors.reset}\n`);
        } finally {
            completed++;
            updateProgress();
        }
    };

    // Process chunk by chunk
    for (let i = 0; i < urls.length; i += CONCURRENCY) {
        const batch = urls.slice(i, i + CONCURRENCY);
        await Promise.all(batch.map(url => checkUrl(url)));
    }

    console.log(`\n\n${colors.green}✅ Verification Complete!${colors.reset}`);
    console.log(`Total: ${results.total}`);
    console.log(`Success: ${results.success}`);
    console.log(`Failed: ${results.failed}`);

    if (results.failed > 0) {
        fs.writeFileSync(REPORT_FILE, JSON.stringify(results.errors, null, 2));
        console.log(`${colors.red}⚠️  Failures saved to ${REPORT_FILE}${colors.reset}`);
        process.exit(1); // Exit with error code so CI fails
    } else {
        console.log(`${colors.green}🎉 All URLs are healthy!${colors.reset}`);
    }
}

main().catch(console.error);
