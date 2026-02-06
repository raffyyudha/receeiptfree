import React from 'react';
import { ReceiptData, CURRENCY_OPTIONS } from '../../types';

interface TemplateProps {
    data: ReceiptData;
}

export const ElegantTemplate: React.FC<TemplateProps> = ({ data }) => {
    const currencyObj = CURRENCY_OPTIONS.find(c => c.value === data.currency) || CURRENCY_OPTIONS[0];
    const currencySymbol = currencyObj.symbol;

    const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    const taxableAmount = Math.max(subtotal - (data.discount || 0), 0);
    const taxAmount = taxableAmount * (data.taxRate / 100);
    const total = taxableAmount + taxAmount + (data.shipping || 0);
    const taxLabel = data.taxLabel || 'Tax';

    // Theme color applied delicately
    const themeColor = data.color || '#000000';

    return (
        <div className="mx-auto min-h-[1000px] w-full max-w-[800px] bg-[#fffaf5] p-16 shadow-2xl ring-1 ring-black/5 lg:min-h-[1123px] font-serif text-slate-800">

            {/* Header */}
            <div className="text-center mb-16">
                {data.logo && <img src={data.logo} alt="Logo" className="h-24 w-auto mx-auto mb-6 object-contain" />}
                <h1 className="text-4xl font-medium tracking-wide mb-2" style={{ color: themeColor }}>{data.businessName || 'Business Name'}</h1>
                <div className="text-sm text-slate-500 italic font-light">
                    {data.businessAddress} • {data.businessEmail} • {data.businessWebsite}
                </div>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center mb-12 opacity-30">
                <div className="h-px bg-slate-400 w-1/3"></div>
                <div className="px-4 text-xl">♦</div>
                <div className="h-px bg-slate-400 w-1/3"></div>
            </div>

            {/* Details Grid */}
            <div className="flex justify-between mb-12 text-sm">
                <div>
                    <h3 className="uppercase tracking-widest text-xs font-bold mb-4 opacity-60">Recipient</h3>
                    <div className="text-lg mb-1">{data.customerName}</div>
                    <div className="opacity-80 leading-relaxed whitespace-pre-line">
                        {data.customerAddress}
                        {data.customerPhone && <div>{data.customerPhone}</div>}
                    </div>
                </div>
                <div className="text-right">
                    <h3 className="uppercase tracking-widest text-xs font-bold mb-4 opacity-60">Receipt Details</h3>
                    <div className="space-y-2">
                        <div>
                            <span className="opacity-60 mr-4">No.</span>
                            <span className="font-medium text-lg">{data.receiptNumber}</span>
                        </div>
                        <div>
                            <span className="opacity-60 mr-4">Date</span>
                            <span className="font-medium">{data.date}</span>
                        </div>
                        {data.status && (
                            <div className="mt-2 text-xs uppercase tracking-widest border border-slate-300 px-2 py-1 inline-block">
                                {data.status}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Items */}
            <table className="w-full mb-12">
                <thead>
                    <tr className="border-b border-double border-slate-300">
                        <th className="text-left font-normal italic pb-4 opacity-60 pl-2">Item Description</th>
                        <th className="text-center font-normal italic pb-4 opacity-60 w-20">Qty</th>
                        <th className="text-right font-normal italic pb-4 opacity-60 w-24">Price</th>
                        <th className="text-right font-normal italic pb-4 opacity-60 w-32 pr-2">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.items.map(item => (
                        <tr key={item.id}>
                            <td className="py-4 pl-2">{item.description}</td>
                            <td className="py-4 text-center opacity-70">{item.quantity}</td>
                            <td className="py-4 text-right opacity-70 detail-font">{currencySymbol}{item.price.toFixed(2)}</td>
                            <td className="py-4 text-right font-medium pr-2 detail-font">{currencySymbol}{(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Footer Totals */}
            <div className="flex justify-end mb-16">
                <div className="w-1/2 space-y-3">
                    <div className="flex justify-between text-sm opacity-70">
                        <span>Subtotal</span>
                        <span>{currencySymbol}{subtotal.toFixed(2)}</span>
                    </div>
                    {data.discount > 0 && (
                        <div className="flex justify-between text-sm text-emerald-700 italic">
                            <span>Discount</span>
                            <span>-{currencySymbol}{data.discount.toFixed(2)}</span>
                        </div>
                    )}
                    {data.taxRate > 0 && (
                        <div className="flex justify-between text-sm opacity-70">
                            <span>{taxLabel} ({data.taxRate}%)</span>
                            <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-2xl border-t border-slate-300 pt-6 mt-4" style={{ color: themeColor }}>
                        <span className="font-medium italic">Total</span>
                        <span className="font-bold">{currencySymbol}{total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Payment & Terms */}
            <div className="bg-white p-8 border border-slate-100 shadow-sm rounded-sm">
                <div className="flex gap-8">
                    <div className="w-1/2">
                        <h4 className="uppercase tracking-widest text-xs font-bold mb-4 opacity-60">Payment</h4>
                        {data.bankName ? (
                            <div className="text-sm space-y-1 opacity-80">
                                <div>{data.bankName}</div>
                                <div>{data.accountName}</div>
                                <div className="font-mono text-xs mt-1">{data.accountNumber}</div>
                            </div>
                        ) : (
                            <div className="text-sm opacity-50 italic">No payment details provided.</div>
                        )}
                    </div>
                    <div className="w-1/2">
                        <h4 className="uppercase tracking-widest text-xs font-bold mb-4 opacity-60">Terms & Notes</h4>
                        <div className="text-sm opacity-80 leading-relaxed">
                            {data.notes}
                            {data.terms && <div className="mt-2 pt-2 border-t border-slate-100 italic">{data.terms}</div>}
                        </div>
                    </div>
                </div>
            </div>

            {data.signature && (
                <div className="mt-16 text-center">
                    <div className="font-dancing-script text-3xl mb-2" style={{ color: themeColor }}>{data.signature}</div>
                    <div className="text-xs uppercase tracking-widest opacity-40">Authorized Signature</div>
                </div>
            )}

            <div className="mt-16 text-center text-xs opacity-30">
                {data.footer}
            </div>

        </div>
    );
};
