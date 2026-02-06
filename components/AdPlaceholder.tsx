import React from 'react';

interface AdPlaceholderProps {
    className?: string;
    size?: 'leaderboard' | 'rectangle' | 'sidebar';
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ className = '', size = 'rectangle' }) => {
    // In production, you will replace this component content with actual Google AdSense code
    // Example: <ins class="adsbygoogle" ... />

    let height = 'h-[250px]';
    let width = 'w-full';
    let label = 'Advertisement (300x250)';

    if (size === 'leaderboard') {
        height = 'h-[90px]';
        width = 'w-[728px]';
        label = 'Leaderboard (728x90)';
    } else if (size === 'sidebar') {
        height = 'h-[600px]';
        label = 'Skyscraper (160x600)';
    }

    return (
        <div className={`flex items-center justify-center bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg text-slate-400 text-sm font-medium ${height} ${width} ${className} overflow-hidden my-6 mx-auto`}>
            <div className="text-center p-4">
                <p className="mb-2">GOOGLE ADSENSE SLOT</p>
                <p className="text-xs opacity-75">{label}</p>
            </div>
        </div>
    );
};
