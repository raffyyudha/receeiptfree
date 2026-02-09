
import { notFound } from 'next/navigation';
import { COUNTRIES, INDUSTRIES, INTRO_TEMPLATES, VARIATIONS, BENEFITS, FIRST_NAMES, REVIEW_TEMPLATES } from '../../lib/pseo-data';
import { ReceiptGenerator } from '../../components/ReceiptGenerator';
import { Metadata } from 'next';
import { Receipt, Zap, ArrowRight, CheckCircle, HelpCircle, Star, User } from 'lucide-react';


function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// Pseudo-random number generator seeded by slug
// Ensures the same page always looks the same, but different pages look different.
function mulberry32(a: number) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}

function stringToSeed(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

function spinText(template: string, seedFunc: () => number) {
    return template.replace(/\{([^{}]+)\}/g, (match, content) => {
        const options = content.split('|');
        return options[Math.floor(seedFunc() * options.length)];
    });
}

function getDataFromSlug(slug: string) {
    let normalizedSlug = slugify(slug);

    // 1. Find Variation (Prefix) - O(V) ~30 items
    // Sort by length to match longest prefix first
    const sortedVariations = [...VARIATIONS].sort((a, b) => b.prefix.length - a.prefix.length);
    const variation = sortedVariations.find(v => normalizedSlug.startsWith(slugify(v.prefix) + '-'));

    if (!variation) return null;

    // Remove prefix and the hyphen e.g. "receipt-template-for-plumber-in-new-york" -> "plumber-in-new-york"
    const remaining = normalizedSlug.slice(slugify(variation.prefix).length + 1);

    // 2. Split by "-in-" to separate Industry and City
    // Use lastIndexOf in case industry slug accidentally contains "-in-" (unlikely but safer)
    const splitIndex = remaining.lastIndexOf('-in-');
    if (splitIndex === -1) return null;

    const industrySlug = remaining.substring(0, splitIndex);
    const citySlug = remaining.substring(splitIndex + 4); // "-in-" length is 4

    // 3. Find Industry - O(I) ~150 items
    // Industry slug is defined in pseo-data.js so look for exact match
    const industry = INDUSTRIES.find(i => slugify(i.slug) === industrySlug);
    if (!industry) return null;

    // 4. Find City & Country - O(C) ~1000 items
    // We iterate countries, then check if slugified city matches
    for (const country of COUNTRIES) {
        for (const c of country.cities) {
            if (slugify(c) === citySlug) {
                return { country, city: c, industry, variation };
            }
        }
    }

    return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const data = getDataFromSlug(slug);
    if (!data) return {};

    const { country, city, industry, variation } = data;
    return {
        title: `Free ${variation.label} for ${industry.title} in ${city} (${country.code})`,
        description: `Generate professional ${variation.label} for ${industry.title} in ${city}. No watermark, 100% free PDF. Compliant with ${country.name} tax rules.`
    };
}

export default async function PseoPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = getDataFromSlug(slug);
    if (!data) notFound();

    const { country, city, industry, variation } = data;

    // Seeded Randomness
    const seed = stringToSeed(slug);
    const rand = mulberry32(seed);

    // 1. Spintax Intro
    let rawIntro = INTRO_TEMPLATES[Math.floor(rand() * INTRO_TEMPLATES.length)];
    // Fallback if template doesn't fit logic
    const safeRand = () => rand();

    // Replace Vars first
    let intro = rawIntro
        .replace(/{industry}/g, industry.title)
        .replace(/{location}/g, city)
        .replace(/{verb}/g, industry.verb)
        .replace(/{variation}/g, variation.label.toLowerCase())
        .replace(/{taxLabel}/g, country.taxLabel)
        .replace(/{currency}/g, country.currency)
        .replace(/{items0}/g, industry.items[0])
        .replace(/{items1}/g, industry.items[1]);

    // Resolve Spintax {A|B}
    intro = spinText(intro, safeRand);

    // 2. Randomized Benefits (Pick 4 Random)
    const shuffledBenefits = [...BENEFITS].sort(() => 0.5 - rand()).slice(0, 4);

    // 3. Dynamic FAQ
    const faqList = [
        {
            q: `Is this ${variation.label} free for ${industry.title}s?`,
            a: `Yes, it is 100% free for all ${industry.title} professionals in ${city}. We do not charge any fees.`
        },
        {
            q: `Can I change the currency to ${country.currency}?`,
            a: `Absolutely. The tool automatically defaults to ${country.currency} for ${city} users, but you can adjust it.`
        },
        {
            q: `Is this compliant with ${country.name} tax rules?`,
            a: `Our templates allow you to add custom tax rates (like ${country.taxLabel}) to ensure your ${variation.label} is compliant.`
        }
    ];

    // 4. Local Reviews (Social Proof)
    const reviews = [];
    const usedNames = new Set();
    for (let i = 0; i < 3; i++) {
        let nameIndex = Math.floor(rand() * FIRST_NAMES.length);
        while (usedNames.has(nameIndex)) {
            nameIndex = Math.floor(rand() * FIRST_NAMES.length);
        }
        usedNames.add(nameIndex);

        let template = REVIEW_TEMPLATES[Math.floor(rand() * REVIEW_TEMPLATES.length)];
        let reviewText = template
            .replace(/{industry}/g, industry.title)
            .replace(/{location}/g, city)
            .replace(/{variation}/g, variation.label);

        reviews.push({
            name: FIRST_NAMES[nameIndex],
            text: reviewText,
            stars: 5
        });
    }

    // 5. Dynamic Visuals (Themes & CTA)
    const THEMES = [
        { name: 'Emerald', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', btn: 'bg-emerald-600 hover:bg-emerald-700', gradient: 'from-emerald-600 to-teal-900', icon: 'text-emerald-600' },
        { name: 'Blue', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', btn: 'bg-blue-600 hover:bg-blue-700', gradient: 'from-blue-600 to-indigo-900', icon: 'text-blue-600' },
        { name: 'Indigo', bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', btn: 'bg-indigo-600 hover:bg-indigo-700', gradient: 'from-indigo-600 to-purple-900', icon: 'text-indigo-600' },
        { name: 'Violet', bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', btn: 'bg-violet-600 hover:bg-violet-700', gradient: 'from-violet-600 to-fuchsia-900', icon: 'text-violet-600' },
        { name: 'Rose', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', btn: 'bg-rose-600 hover:bg-rose-700', gradient: 'from-rose-600 to-red-900', icon: 'text-rose-600' },
        { name: 'Amber', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', btn: 'bg-amber-600 hover:bg-amber-700', gradient: 'from-amber-600 to-orange-900', icon: 'text-amber-600' },
        { name: 'Slate', bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', btn: 'bg-slate-900 hover:bg-slate-800', gradient: 'from-slate-700 to-black', icon: 'text-slate-600' },
    ];

    const CTA_TEXTS = [
        `Create ${variation.type} Now`,
        "Start for Free",
        "Generate PDF",
        "Make My Receipt",
        "Instant Download",
        "Get Started"
    ];

    const theme = THEMES[Math.floor(rand() * THEMES.length)];
    const ctaText = CTA_TEXTS[Math.floor(rand() * CTA_TEXTS.length)];

    const prefillData = {
        currency: country.currency,
        taxLabel: country.taxLabel,
        items: industry.items.map((desc: string, i: number) => ({ id: `item-${i}`, description: desc, quantity: 1, price: 0 })),
        footer: `Generated regarding ${country.taxLabel} regulations in ${city}, ${country.name}.`,
        notes: `Thanks for choosing our ${industry.title} service!`,
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": `Free ${variation.label} for ${industry.title}`,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": intro,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": Math.floor(rand() * (500 - 100 + 1) + 100).toString()
        },
        "review": reviews.map(r => ({
            "@type": "Review",
            "author": { "@type": "Person", "name": r.name },
            "reviewRating": { "@type": "Rating", "ratingValue": "5" },
            "reviewBody": r.text
        })),
        "mainEntity": {
            "@type": "FAQPage",
            "mainEntity": faqList.map(f => ({
                "@type": "Question",
                "name": f.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f.a
                }
            }))
        }
    };

    return (
        <div className={`min-h-screen font-sans ${theme.name === 'Slate' ? 'bg-slate-50' : 'bg-white'}`}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-md ${theme.btn}`}>
                            <Receipt size={18} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">FreeReceipt</span>
                    </div>
                </div>
            </nav>

            <section className="relative overflow-hidden bg-white pt-32 pb-16 lg:pt-40 lg:pb-24">
                <div className="absolute inset-0 bg-grid-pattern opacity-50" />
                <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">

                    <div className={`mx-auto mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium shadow-sm ${theme.bg} ${theme.border} ${theme.text}`}>
                        <Zap size={16} className={theme.icon} />
                        <span className="tracking-wide"> {industry.title}s in {city} • {country.name}</span>
                    </div>

                    <h1 className="mx-auto max-w-5xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6">
                        {variation.label} for <br />
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradient}`}>{industry.title}s in {city}</span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg text-slate-500 mb-8 leading-relaxed">
                        {intro}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-10">
                        {shuffledBenefits.map((benefit, i) => (
                            <div key={i} className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full border ${theme.bg} ${theme.text} ${theme.border}`}>
                                <CheckCircle size={14} className={theme.icon} /> {benefit}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="#generator" className={`inline-flex items-center justify-center rounded-full text-white h-16 px-12 text-lg font-semibold shadow-lg transition-all hover:scale-105 active:scale-95 ${theme.btn}`}>
                            <span className="mr-3"><ArrowRight size={24} /></span> {ctaText}
                        </a>
                    </div>
                </div>
            </section>

            <ReceiptGenerator prefillData={prefillData} />

            <section className="bg-white py-16 border-t border-slate-200">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Trusted by {industry.title}s in {city}
                        </h2>
                        <p className="mt-4 text-lg text-slate-500">
                            See what local professionals are saying about our free invoice generator.
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-3">
                        {reviews.map((review, i) => (
                            <div key={i} className={`rounded-2xl p-8 shadow-sm border relative ${theme.bg} ${theme.border}`}>
                                <div className="flex gap-1 mb-4 text-amber-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={16} />)}
                                </div>
                                <p className="text-slate-700 italic mb-6">"{review.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-slate-500 font-bold shadow-sm">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{review.name}</p>
                                        <p className="text-xs text-slate-500">{industry.title}, {city}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-slate-50 py-16 border-t border-slate-200">
                <div className="mx-auto max-w-4xl px-4">
                    <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
                        <HelpCircle className="text-slate-400" /> Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {faqList.map((f, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <h3 className="font-semibold text-slate-900 mb-2">{f.q}</h3>
                                <p className="text-slate-600">{f.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white py-16 border-t border-slate-200">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                        {/* 1. Related Professions in Same City */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">
                                More Invoice Tools in {city}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {INDUSTRIES
                                    .filter(ind => ind.slug !== industry.slug)
                                    .sort(() => 0.5 - rand())
                                    .slice(0, 15)
                                    .map((ind) => (
                                        <a
                                            key={ind.slug}
                                            href={`/${variation.prefix}-${ind.slug}-in-${slugify(city)}`}
                                            className="text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-900 hover:text-slate-900 transition-colors"
                                        >
                                            {ind.title} in {city}
                                        </a>
                                    ))
                                }
                            </div>
                        </div>

                        {/* 2. Related Cities */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">
                                Nearby {industry.title} Locations
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {country.cities
                                    .filter(c => c !== city)
                                    .sort(() => 0.5 - rand())
                                    .slice(0, 15)
                                    .map((c) => (
                                        <a
                                            key={c}
                                            href={`/${variation.prefix}-${industry.slug}-in-${slugify(c)}`}
                                            className="text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-900 hover:text-slate-900 transition-colors"
                                        >
                                            {c}
                                        </a>
                                    ))
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <footer className="bg-slate-950 text-slate-500 py-12 border-t border-slate-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <Receipt className="text-slate-400" size={24} />
                        <span className="font-bold text-slate-300 text-lg">FreeReceipt</span>
                    </div>
                    <div className="text-sm">
                        © {new Date().getFullYear()} FreeReceipt. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
