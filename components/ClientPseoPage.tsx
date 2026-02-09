
'use client';

import React, { useMemo } from 'react';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getDataFromSlug } from '../lib/pseo-utils';
import { INTRO_TEMPLATES, BENEFITS, FIRST_NAMES, REVIEW_TEMPLATES } from '../lib/pseo-data';
import { Receipt, Zap, ArrowRight, CheckCircle, HelpCircle, Star, User } from 'lucide-react';

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

function spinText(template: string, seedFunc: () => number) {
    if (!template) return "";
    return template.replace(/\{([^{}]+)\}/g, (match, content) => {
        const options = content.split('|');
        return options[Math.floor(seedFunc() * options.length)];
    });
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

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="bg-slate-900 px-4 py-20 text-center text-white sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl space-y-6">
                    <div className="item-center mx-auto mb-6 flex w-fit gap-2 rounded-full bg-slate-800 px-4 py-1.5 text-sm font-medium text-slate-300 ring-1 ring-inset ring-slate-700">
                        <CheckCircle size={16} className="text-emerald-400" />
                        <span>Trusted by {industry.title}s in {city}</span>
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                        Free <span className="text-emerald-400">{variation.label}</span> for <br className="hidden sm:block" />
                        {industry.title} in {city}
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg text-slate-400 leading-relaxed">
                        {intro}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <button onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-lg font-bold text-slate-900 transition-all hover:bg-emerald-400 hover:scale-105 active:scale-95">
                            <Zap size={20} fill="currentColor" />
                            Create Free Receipt
                        </button>
                        <button onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 rounded-full bg-white/10 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/20">
                            Learn More <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Generator App */}
            <ReceiptGenerator prefillData={prefillData} />

            {/* SEO Content / Value Props */}
            <section id="benefits" className="py-24 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">
                                Why {industry.title}s in {city} use this tool?
                            </h2>
                            <p className="text-lg text-slate-600 mb-8">
                                We designed this {variation.label.toLowerCase()} generator specifically for the needs of {industry.title} businesses operating in {city}, complying with {country.name} standards.
                            </p>

                            <dl className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                                {BENEFITS.map((benefit, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600">
                                            <CheckCircle className="h-6 w-6 text-white" aria-hidden="true" />
                                        </div>
                                        <dt className="text-base font-semibold leading-7 text-slate-900">
                                            {benefit}
                                        </dt>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        {/* Fake Reviews / Social Proof */}
                        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                            <h3 className="flex items-center gap-2 font-bold text-slate-900 text-xl mb-6">
                                <Star className="text-amber-400 fill-amber-400" /> Recent Reviews
                            </h3>
                            <div className="space-y-6">
                                {reviews.map((review, i) => (
                                    <div key={i} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                                                <User size={16} className="text-slate-500" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-slate-900">{review.name} from {city}</div>
                                                <div className="flex gap-0.5">
                                                    {[...Array(review.stars)].map((_, si) => (
                                                        <Star key={si} size={12} className="text-amber-400 fill-amber-400" />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 italic">"{review.text}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

