
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import { getDataFromSlug } from '../../lib/pseo-utils';

// ISR Config: Cache meta-shells for 1 day.
export const revalidate = 86400;
export const dynamicParams = true;

// Client Component for the actual content
const ClientPseoPage = dynamic(() => import('../../components/ClientPseoPage'), {
    ssr: false, // NUCLEAR OPTION: No Server Side Rendering for content
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

// Pre-render a few popular paths
export async function generateStaticParams() {
    const params = [];
    // Generate ~10 sample paths
    for (const city of ['new-york', 'los-angeles']) {
        for (const ind of ['plumber']) {
            params.push({ slug: `receipt-template-for-${ind}-in-${city}` });
        }
    }
    return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    try {
        const resolvedParams = await params;
        if (!resolvedParams?.slug) return {};

        const slug = decodeURIComponent(resolvedParams.slug);
        const data = getDataFromSlug(slug);
        if (!data) return {};

        const { country, city, industry, variation } = data;

        // Safe access with fallbacks
        const label = variation?.label || 'Receipt';
        const title = industry?.title || 'Professional';
        const cityName = city || 'Your City';
        const countryCode = country?.code || 'US';
        const countryName = country?.name || 'Country';

        return {
            title: `Free ${label} for ${title} in ${cityName} (${countryCode})`,
            description: `Generate professional ${label} for ${title} in ${cityName}. No watermark, 100% free PDF. Compliant with ${countryName} tax rules.`
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
