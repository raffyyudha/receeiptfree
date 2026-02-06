
import React from 'react';
import { Receipt, Zap, ArrowRight, Check } from 'lucide-react';
import { ReceiptGenerator } from '../components/ReceiptGenerator';

const FAQS = [
    {
        q: "Is this receipt generator truly free?",
        a: "Yes, it is 100% free. We do not charge any fees, and there are no premium tiers. The project is supported by the community."
    },
    {
        q: "Do you store my data?",
        a: "No. All generation happens in your browser (client-side). Your receipt data never leaves your device, ensuring maximum privacy."
    },
    {
        q: "Can I add my business logo?",
        a: "Yes! You can upload your business logo to make your receipts look professional. The logo is processed locally in your browser."
    },
    {
        q: "Is this suitable for official use?",
        a: "Yes. We include all necessary fields like Tax ID / VAT, address details, and breakdown of taxes to ensure it meets standard invoicing requirements."
    }
];

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* --- Navigation --- */}
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

            {/* --- Hero Section --- */}
            <section className="relative overflow-hidden bg-white pt-32 pb-24 lg:pt-40 lg:pb-32">
                <div className="absolute inset-0 bg-grid-pattern opacity-50" />
                <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">

                    <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition-transform hover:scale-105">
                        <Zap size={16} className="fill-yellow-400 text-yellow-500" />
                        <span className="tracking-wide">Professional Invoicing, 100% Free</span>
                    </div>

                    <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl mb-6 drop-shadow-sm uppercase">
                        Receipt Generator<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900">PDF Free - No Watermark</span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg text-slate-500 mb-10 leading-relaxed">
                        Instantly create professional receipts. <strong>100% Free. No Watermark. No Signup.</strong>
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="#generator"
                            className="inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 border border-transparent h-16 px-10 text-lg w-full sm:w-auto"
                        >
                            <span className="mr-3 h-6 w-6"><ArrowRight /></span>
                            Create My Receipt
                        </a>
                        <div className="flex items-center gap-4 px-4 text-sm font-medium text-slate-500">
                            <span>Try it below ↓</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Main Workspace --- */}
            <ReceiptGenerator />

            {/* --- FAQ Section --- */}
            <section id="faq" className="bg-white py-24">
                <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Frequently Asked Questions</h2>
                        <p className="mt-4 text-slate-500">Everything you need to know about our receipt generator.</p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        {FAQS.map((faq, i) => (
                            <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 transition-all hover:bg-slate-50">
                                <h3 className="font-bold text-slate-900 mb-3">{faq.q}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- DraftKit CTA --- */}
            <section className="bg-slate-900 py-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[120px]"></div>
                    <div className="absolute -bottom-[20%] -left-[10%] w-[400px] h-[400px] bg-indigo-500 rounded-full blur-[100px]"></div>
                </div>

                <div className="mx-auto max-w-4xl px-4 sm:px-6 relative z-10 text-center">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-8 shadow-xl">
                        Recommended Tool
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
                        Need to send a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Professional Invoice?</span>
                    </h2>

                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                        Receipts are for payments made. Invoices are for getting paid.
                        Generate beautiful, branded PDF invoices for free with our sister tool.
                    </p>

                    <a
                        href="https://draftkit.online"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:-translate-y-1 transition-all shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)]"
                    >
                        <span>Go to DraftKit Invoices</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>

                    <p className="mt-6 text-sm text-slate-500 font-medium">
                        100% Free • No Sign-up • No Watermark
                    </p>
                </div>
            </section>

            {/* --- Footer --- */}
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
