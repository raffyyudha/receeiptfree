const { COUNTRIES, INDUSTRIES, VARIATIONS } = require('./lib/pseo-data.js');

function slugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function getDataFromSlug(slug) {
    let normalizedSlug = slugify(slug);

    const sortedVariations = [...VARIATIONS].sort((a, b) => b.prefix.length - a.prefix.length);
    const variation = sortedVariations.find(v => normalizedSlug.startsWith(slugify(v.prefix) + '-'));
    
    if (!variation) return "Variation not found";

    const remaining = normalizedSlug.slice(slugify(variation.prefix).length + 1);

    const splitIndex = remaining.lastIndexOf('-in-');
    if (splitIndex === -1) return "Split index not found";

    const industrySlug = remaining.substring(0, splitIndex);
    const citySlug = remaining.substring(splitIndex + 4); 

    console.log("Industry Slug:", industrySlug);
    console.log("City Slug:", citySlug);

    const industry = INDUSTRIES.find(i => slugify(i.slug) === industrySlug);
    if (!industry) return "Industry not found: " + industrySlug;

    for (const country of COUNTRIES) {
        for (const c of country.cities) {
            if (slugify(c) === citySlug) {
                if (!country || !c || !industry || !variation) return "Incomplete data";
                return "SUCCESS: Found " + c + ", " + country.name;
            }
        }
    }

    return "City/Country not found: " + citySlug;
}

console.log(getDataFromSlug('free-receipt-for-freelancer-in-colorado-springs'));
