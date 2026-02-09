
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import PseoPageClientContainer from '../../components/PseoPageClientContainer';
// CRITICAL FIX: Do NOT import any data processing logic on the server.
// import { getDataFromSlug } from '../../lib/pseo-utils'; // REMOVED to prevent server crash

// ISR Config
export const revalidate = 86400;
export const dynamicParams = true;

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

    return <PseoPageClientContainer slug={slug} />;
}
