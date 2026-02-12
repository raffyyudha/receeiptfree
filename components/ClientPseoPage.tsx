'use client';

import React, { useMemo } from 'react';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getDataFromSlug, generateFAQs, getNearbyLocations, getRelatedIndustries, slugify } from '../lib/pseo-utils';
import { INTRO_TEMPLATES, BENEFITS, FIRST_NAMES, REVIEW_TEMPLATES } from '../lib/pseo-data';
import { Receipt, Zap, ArrowRight, CheckCircle, HelpCircle, Star, User, MapPin, Briefcase } from 'lucide-react';

const ReceiptGenerator = dynamic(() => import('./ReceiptGenerator').then(mod => mod.ReceiptGenerator), {
    ssr: false,
    loading: () => <div className="h-96 w-full animate-pulse bg-slate-100 rounded-xl" />
});

// Seeded Randomness utilities
function stringToSeed(str: string) {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

function mulberry32(a: number) {
    return function () {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}

function spinText(template: string, rngFn: () => number) {
    if (!template) return "";
    try {
        const generator = rngFn; // Capture explicitly
        return template.replace(/\{([^{}]+)\}/g, (match, content) => {
            const options = content.split('|');
            if (!generator) return options[0]; // Fallback
            const randVal = generator();
            return options[Math.floor(randVal * options.length)];
        });
    } catch (e) {
        console.error("SpinText error:", e);
        return template;
    }
}

interface ClientPseoPageProps {
    slug: string;
}

export default function ClientPseoPage({ slug }: ClientPseoPageProps) {
    const data = useMemo(() => {
        try {
            return getDataFromSlug(slug);
        } catch (e) {
            console.error("Error getting data from slug:", e);
            return null;
        }
    }, [slug]);

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
                    <p className="text-slate-500">The requested receipt template could not be generated.</p>
                </div>
            </div>
        );
    }

    const { country, city, industry, variation } = data;

    // Seeded Randomness
    const seed = stringToSeed(slug);
    const rand = mulberry32(seed);
    const safeRand = () => rand();

    // 1. Spintax Intro
    // Ensure we pick a valid template
    const templateIndex = Math.floor(rand() * INTRO_TEMPLATES.length);
    let rawIntro = INTRO_TEMPLATES[templateIndex] || INTRO_TEMPLATES[0];

    // Replace Vars first with safe checks
    let intro = rawIntro
        .replace(/{industry}/g, industry.title)
        .replace(/{location}/g, city)
        .replace(/{verb}/g, industry.verb)
        .replace(/{variation}/g, variation.label.toLowerCase())
        .replace(/{taxLabel}/g, country.taxLabel)
        .replace(/{currency}/g, country.currency)
        .replace(/{items0}/g, industry.items[0] || 'Services')
        .replace(/{items1}/g, industry.items[1] || 'Products');

    // Resolve Spintax {A|B}
    intro = spinText(intro, safeRand);

    // 2. Reviews
    // Ensure we don't loop forever if NAMES < 3 (unlikely but safe)
    const reviews = [];
    const usedNames = new Set();
    const maxReviews = Math.min(3, FIRST_NAMES.length);

    for (let i = 0; i < maxReviews; i++) {
        let nameIndex = Math.floor(rand() * FIRST_NAMES.length);
        let attempts = 0;
        while (usedNames.has(nameIndex) && attempts < 10) {
            nameIndex = Math.floor(rand() * FIRST_NAMES.length);
            attempts++;
        }
        usedNames.add(nameIndex);

        let reviewTemplateIndex = Math.floor(rand() * REVIEW_TEMPLATES.length);
        let rawReview = REVIEW_TEMPLATES[reviewTemplateIndex] || REVIEW_TEMPLATES[0];

        let reviewText = rawReview
            .replace(/{industry}/g, industry.title)
            .replace(/{location}/g, city)
            .replace(/{variation}/g, variation.label)
            .replace(/{verb}/g, industry.verb); // Added verb just in case

        reviews.push({
            name: FIRST_NAMES[nameIndex],
            text: reviewText,
            stars: 4 + (rand() > 0.3 ? 1 : 0) // Mostly 5 stars
        });
    }

    // Prefill Data
    const prefillData = {
        currency: country.currency,
        taxLabel: country.taxLabel,
        items: [
            { id: '1', description: industry.items[0] || 'Service', quantity: 1, price: 100 },
            { id: '2', description: industry.items[1] || 'Product', quantity: 1, price: 50 },
        ],
        footer: `Registered in ${city}, ${country.name}.`
    };

    // --- NEW SEO LOGIC ---
    const faqs = generateFAQs(industry, city, country, variation);
    const nearbyCities = getNearbyLocations(country, city, 12);
    const relatedIndustries = getRelatedIndustries(industry, 12);

    // Schema Markup
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": f.answer
            }
        }))
    };

    // Breadcrumb Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "sitemap", "item": "https://freereceipt.online/sitemap.xml" },
            { "@type": "ListItem", "position": 2, "name": variation.label, "item": `https://freereceipt.online/${slug}` }
        ]
    };

    const labelHasFree = variation.label.toLowerCase().startsWith('free ');
    const displayLabel = labelHasFree ? variation.label.slice(5) : variation.label;

    return (
        <main className="min-h-screen bg-slate-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([schemaData, breadcrumbSchema]) }}
            />

            {/* Hero Section */}
            <section className="bg-slate-900 px-4 py-20 text-center text-white sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
                </div>

                <div className="mx-auto max-w-4xl space-y-6 relative z-10">
                    <div className="item-center mx-auto mb-6 flex w-fit gap-2 rounded-full bg-slate-800 px-4 py-1.5 text-sm font-medium text-slate-300 ring-1 ring-inset ring-slate-700">
                        <CheckCircle size={16} className="text-emerald-400" />
                        <span>Trusted by {industry.title}s in {city}</span>
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                        Free <span className="text-emerald-400">{displayLabel}</span> for <br className="hidden sm:block" />
                        {industry.title} in {city}
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg text-slate-400 leading-relaxed">
                        {intro}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <button onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-lg font-bold text-slate-900 transition-all hover:bg-emerald-400 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20">
                            <Zap size={20} fill="currentColor" />
                            Create Free Receipt
                        </button>
                        <button onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 rounded-full bg-white/10 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/20 backdrop-blur-sm">
                            <HelpCircle size={20} />
                            FAQ
                        </button>
                    </div>
                </div>
            </section>

            {/* Generator App */}
            <div id="generator" className="scroll-mt-10">
                <ReceiptGenerator prefillData={prefillData} />
            </div>

            {/* Value Props & Reviews */}
            <section id="benefits" className="py-24 bg-white border-b border-slate-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
                        {/* Benefits List */}
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">
                                Why {industry.title}s in {city} switch to this tool?
                            </h2>
                            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                                We designed this {variation.label.toLowerCase()} generator specifically for the billing needs of {industry.title} businesses operating in {city}. It ensures you look professional and get paid faster, while fully complying with {country.name} tax standards.
                            </p>

                            <dl className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                                {BENEFITS.map((benefit, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 transition-colors group-hover:bg-emerald-100">
                                            <CheckCircle className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                                        </div>
                                        <dt className="text-base font-bold leading-7 text-slate-900 self-center">
                                            {benefit}
                                        </dt>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        {/* Reviews Card */}
                        <div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-200 shadow-sm relative">
                            <div className="absolute -top-4 -right-4 bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-bold shadow-sm">
                                4.9/5 Rating
                            </div>
                            <h3 className="flex items-center gap-2 font-bold text-slate-900 text-xl mb-8">
                                <Star className="text-amber-400 fill-amber-400" />
                                What {city} locals say
                            </h3>
                            <div className="space-y-6">
                                {reviews.map((review, i) => (
                                    <div key={i} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-bold">
                                                {review.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-slate-900">{review.name}</div>
                                                <div className="text-xs text-slate-500 font-medium">{industry.title}, {city}</div>
                                            </div>
                                            <div className="ml-auto flex gap-0.5">
                                                {[...Array(review.stars)].map((_, si) => (
                                                    <Star key={si} size={14} className="text-amber-400 fill-amber-400" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 italic leading-relaxed">"{review.text}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section (Programmatic) */}
            <section id="faq" className="py-24 bg-slate-50 border-b border-slate-200">
                <div className="mx-auto max-w-3xl px-6 lg:px-8">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 text-center mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-md">
                                <h3 className="text-lg font-bold text-slate-900 mb-3 flex gap-3 items-start">
                                    <HelpCircle className="text-emerald-500 shrink-0 mt-1" size={20} />
                                    {faq.question}
                                </h3>
                                <p className="text-slate-600 leading-relaxed pl-8">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Internal Linking: The Spider Web */}
            <section className="py-20 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16">
                        {/* Nearby Locations */}
                        <div>
                            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-6 border-b pb-4 border-slate-100">
                                <MapPin className="text-slate-400" />
                                Nearby Locations in {country.name}
                            </h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {nearbyCities.map((c, i) => (
                                    <li key={i}>
                                        <Link
                                            href={`/${variation.prefix}-${industry.slug}-in-${slugify(String(c))}`}
                                            className="text-slate-600 hover:text-emerald-600 hover:underline transition-colors text-sm flex items-center gap-2"
                                        >
                                            <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                                            {variation.label} in {c}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Related Industries */}
                        <div>
                            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-6 border-b pb-4 border-slate-100">
                                <Briefcase className="text-slate-400" />
                                Other Professionals in {city}
                            </h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {relatedIndustries.map((ind, i) => (
                                    <li key={i}>
                                        <Link
                                            href={`/${variation.prefix}-${ind.slug}-in-${slugify(city)}`}
                                            className="text-slate-600 hover:text-emerald-600 hover:underline transition-colors text-sm flex items-center gap-2"
                                        >
                                            <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                                            {variation.label} for {ind.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}
