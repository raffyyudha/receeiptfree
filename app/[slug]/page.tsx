
import { notFound } from 'next/navigation';
import { COUNTRIES, INDUSTRIES, INTRO_TEMPLATES, VARIATIONS, BENEFITS } from '../../lib/pseo-data';
import { ReceiptGenerator } from '../../components/ReceiptGenerator';
import { Metadata } from 'next';
import { Receipt, Zap, ArrowRight, CheckCircle, HelpCircle } from 'lucide-react';

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
    // Optimization: Check variations first to fail fast? 
    // Actually, we must iterate.
    for (const country of COUNTRIES) {
        // Optimization: Check if slug contains country code or related patterns?
        // For now, brutal iteration is fine for build/runtime as long as we break early.
        for (const city of country.cities) {
            const citySlug = slugify(city);
            if (!slug.includes(citySlug)) continue; // Quick check

            for (const ind of INDUSTRIES) {
                const indSlug = ind.slug;
                if (!slug.includes(indSlug)) continue; // Quick check

                for (const vary of VARIATIONS) {
                    const targetSlug = `${vary.prefix}-${indSlug}-in-${citySlug}`;
                    if (slug === targetSlug) {
                        return { country, city, industry: ind, variation: vary };
                    }
                }
            }
        }
    }
    return null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const data = getDataFromSlug(params.slug);
    if (!data) return {};

    const { country, city, industry, variation } = data;
    return {
        title: `Free ${variation.label} for ${industry.title} in ${city} (${country.code})`,
        description: `Generate professional ${variation.label} for ${industry.title} in ${city}. No watermark, 100% free PDF. Compliant with ${country.name} tax rules.`
    };
}

export default function PseoPage({ params }: { params: { slug: string } }) {
    const data = getDataFromSlug(params.slug);
    if (!data) notFound();

    const { country, city, industry, variation } = data;

    // Seeded Randomness
    const seed = stringToSeed(params.slug);
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
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-md">
                            <Receipt size={18} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">FreeReceipt</span>
                    </div>
                </div>
            </nav>

            <section className="relative overflow-hidden bg-white pt-32 pb-16 lg:pt-40 lg:pb-24">
                <div className="absolute inset-0 bg-grid-pattern opacity-50" />
                <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">

                    <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm">
                        <Zap size={16} className="fill-yellow-400 text-yellow-500" />
                        <span className="tracking-wide"> {industry.title}s in {city} • {country.name}</span>
                    </div>

                    <h1 className="mx-auto max-w-5xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6">
                        {variation.label} for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-slate-900">{industry.title}s in {city}</span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg text-slate-500 mb-8 leading-relaxed">
                        {intro}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-10">
                        {shuffledBenefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-1 text-sm font-medium text-slate-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                <CheckCircle size={14} className="text-emerald-600" /> {benefit}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="#generator" className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white h-16 px-12 text-lg font-semibold shadow-lg hover:bg-slate-800 transition-all hover:scale-105 active:scale-95">
                            <span className="mr-3"><ArrowRight size={24} /></span> Create {variation.type} Now
                        </a>
                    </div>
                </div>
            </section>

            <ReceiptGenerator prefillData={prefillData} />

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
