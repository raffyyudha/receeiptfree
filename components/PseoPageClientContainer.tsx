
'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic import with ssr: false IS allowed here because this file is a Client Component ('use client')
const ClientPseoPage = dynamic(() => import('./ClientPseoPage'), {
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

export default function PseoPageClientContainer({ slug }: { slug: string }) {
    return <ClientPseoPage slug={slug} />;
}
