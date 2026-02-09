
// Mock data and function for testing
const COUNTRIES = [
    { code: 'US', cities: ['New York', 'Los Angeles'] }
];
const INDUSTRIES = [
    { slug: 'plumber', title: 'Plumber' },
    { slug: 'freelancer', title: 'Freelancer' }
];
const VARIATIONS = [
    { prefix: 'receipt-template-for', label: 'Receipt Template' },
    { prefix: 'free-receipt-for', label: 'Free Receipt' }
];

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function getDataFromSlug(slug) {
    let normalizedSlug = slugify(slug);

    // 1. Find Variation (Prefix)
    const sortedVariations = [...VARIATIONS].sort((a, b) => b.prefix.length - a.prefix.length);
    const variation = sortedVariations.find(v => normalizedSlug.startsWith(slugify(v.prefix) + '-'));

    if (!variation) return null;

    const remaining = normalizedSlug.slice(slugify(variation.prefix).length + 1);

    // 2. Split by "-in-"
    const splitIndex = remaining.lastIndexOf('-in-');
    if (splitIndex === -1) return null;

    const industrySlug = remaining.substring(0, splitIndex);
    const citySlug = remaining.substring(splitIndex + 4);

    // 3. Find Industry
    const industry = INDUSTRIES.find(i => slugify(i.slug) === industrySlug);
    if (!industry) return null;

    console.log(`Debug: Industry=${industrySlug}, City=${citySlug}`);

    // 4. Find City
    for (const country of COUNTRIES) {
        for (const c of country.cities) {
            if (slugify(c) === citySlug) {
                return { country, city: c, industry, variation };
            }
        }
    }

    return null;
}

const slug = "free-receipt-for-freelancer-in-miami";
// miami not in mock cities, adds it
COUNTRIES[0].cities.push('Miami');

console.log("Testing slug:", slug);
const result = getDataFromSlug(slug);
console.log("Result:", result);

const slug2 = "receip-template-for-plumber-in-new-york"; // typo
console.log("Testing typo slug:", slug2);
console.log("Result:", getDataFromSlug(slug2));
