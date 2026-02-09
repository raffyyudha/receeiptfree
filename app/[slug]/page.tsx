
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';
// CRITICAL FIX: Do NOT import any data processing logic on the server.
// import { getDataFromSlug } from '../../lib/pseo-utils'; // REMOVED to prevent server crash

// ISR Config
export const revalidate = 86400;
export const dynamicParams = true;

// Client Component for Content
const ClientPseoPage = dynamic(() => import('../../components/ClientPseoPage'), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-pulse space-y-8 w-full max-w-4xl px-4">
                <div className="h-12 bg-slate-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-96 bg-slate-200 rounded"></div>
                    <div className="h-96 bg-slate-200 rounded"></div>
                </div>
            </div>
        </div>
    )
});

// Hardcoded static params to warm cache without importing data
export async function generateStaticParams() {
    // Return minimal set to avoid data processing
    return [
        { slug: 'receipt-template-for-plumber-in-new-york' },
        { slug: 'receipt-template-for-freelancer-in-los-angeles' }
    ];
}

// SIMPLIFIED METADATA: Avoid heavy processing on server
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    try {
        const resolvedParams = await params;
        if (!resolvedParams?.slug) return { title: "Free Receipt Generator" };

        // Basic slug parsing without heavy data loops
        const slug = decodeURIComponent(resolvedParams.slug);
        const parts = slug.split('-');

        // Simple heuristic for title (Capitalize words)
        const title = parts.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        return {
            title: title + " | Free Receipt Generator",
            description: "Generate professional PDF receipts instantly. No signup required."
        };
    } catch (error) {
        return {
            title: "Free Receipt Generator",
            description: "Generate free receipts and invoices instantly."
        };
    }
}

export default async function PseoPage({ params }: { params: Promise<{ slug: string }> }) {
    let slug = '';
    try {
        const resolvedParams = await params;
        slug = resolvedParams?.slug ? decodeURIComponent(resolvedParams.slug) : '';
    } catch (e) {
        // Ignore params error
    }

    if (!slug) notFound();

    return <ClientPseoPage slug={slug} />;
}
