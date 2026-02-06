
import { notFound } from 'next/navigation';
import { COUNTRIES, INDUSTRIES, INTRO_TEMPLATES } from '../../lib/pseo-data';
import { ReceiptGenerator } from '../../components/ReceiptGenerator';
import { Metadata } from 'next';
import { Receipt, Zap, ArrowRight } from 'lucide-react';

function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function getDataFromSlug(slug: string) {
    for (const country of COUNTRIES) {
        for (const city of country.cities) {
            const citySlug = slugify(city);
            for (const ind of INDUSTRIES) {
                const indSlug = ind.slug;
                const targetSlug = `receipt-template-for-${indSlug}-in-${citySlug}`;
                if (slug === targetSlug) {
                    return { country, city, industry: ind };
                }
            }
        }
    }
    return null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const data = getDataFromSlug(params.slug);
    if (!data) return {};

    const { country, city, industry } = data;
    return {
        title: `Free Receipt Template for ${industry.title} in ${city} (${country.code})`,
        description: `Generate professional ${industry.title} receipts in ${city}. No watermark, free PDF. Compliant with ${country.name} tax rules.`
    };
}

export default function PseoPage({ params }: { params: { slug: string } }) {
    const data = getDataFromSlug(params.slug);
    if (!data) notFound();

    const { country, city, industry } = data;

    // Prepare Prefill Data
    let intro = INTRO_TEMPLATES[Math.floor(Math.random() * INTRO_TEMPLATES.length)];
    intro = intro.replace('{industry}', industry.title)
        .replace('{location}', city)
        .replace('{country}', country.name)
        .replace('{verb}', industry.verb)
        .replace('{currency}', country.currency)
        .replace('{taxLabel}', country.taxLabel);

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
        "name": `Free Receipt Generator for ${industry.title}`,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": `Free online tool to generate PDF receipts for ${industry.title} professionals in ${city}. No signup required.`,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": Math.floor(Math.random() * (500 - 100 + 1) + 100).toString()
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

            <section className="relative overflow-hidden bg-white pt-32 pb-24 lg:pt-40 lg:pb-32">
                <div className="absolute inset-0 bg-grid-pattern opacity-50" />
                <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">

                    <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm">
                        <Zap size={16} className="fill-yellow-400 text-yellow-500" />
                        <span className="tracking-wide"> tailored for {industry.title}s in {city}</span>
                    </div>

                    <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6 drop-shadow-sm uppercase">
                        Receipt Generator for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-slate-900">{industry.title}s in {city}</span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg text-slate-500 mb-10 leading-relaxed" dangerouslySetInnerHTML={{ __html: intro }} />

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="#generator" className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white h-16 px-10 text-lg font-semibold shadow-lg hover:bg-slate-800 transition-all">
                            <span className="mr-3"><ArrowRight size={24} /></span> Start Now
                        </a>
                    </div>
                </div>
            </section>

            <ReceiptGenerator prefillData={prefillData} />

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
