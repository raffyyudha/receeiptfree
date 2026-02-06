import React from 'react';
import { ReceiptData, CURRENCY_OPTIONS } from '../../types';

interface TemplateProps {
    data: ReceiptData;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
    const currencyObj = CURRENCY_OPTIONS.find(c => c.value === data.currency) || CURRENCY_OPTIONS[0];
    const currencySymbol = currencyObj.symbol;

    const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    const taxableAmount = Math.max(subtotal - (data.discount || 0), 0); // Discount is pre-tax in this logic
    const taxAmount = taxableAmount * (data.taxRate / 100);
    const total = taxableAmount + taxAmount + (data.shipping || 0);

    const themeColor = data.color || '#3b82f6'; // Default blue

    return (
        <div className="mx-auto min-h-[1000px] w-full max-w-[800px] bg-white shadow-2xl ring-1 ring-black/5 lg:min-h-[1123px] flex flex-col">

            {/* Header Bar */}
            <div className="h-4 w-full" style={{ backgroundColor: themeColor }}></div>

            <div className="p-8 md:p-12 flex-1 flex flex-col">
                {/* Top Section */}
                <div className="flex justify-between items-start mb-12">
                    <div className="flex items-center gap-4">
                        {data.logo && (
                            <img src={data.logo} alt="Logo" className="h-16 w-16 object-contain rounded-lg" />
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900" style={{ color: themeColor }}>{data.businessName || 'Business Name'}</h1>
                            <div className="text-sm text-slate-500 mt-1">
                                {data.businessAddress}<br />
                                {data.businessEmail}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-5xl font-light text-slate-200">INVOICE</div>
                        <div className="text-slate-900 font-bold text-lg mt-2">#{data.receiptNumber}</div>
                        <div className="text-slate-500 text-sm">{data.date}</div>
                    </div>
                </div>

                {/* Address Grid */}
                <div className="grid grid-cols-2 gap-12 mb-16">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">From</h3>
                        <div className="text-sm font-medium text-slate-900">
                            <p>{data.businessName}</p>
                            <p className="text-slate-500 font-normal mt-1 whitespace-pre-line">{data.businessAddress}</p>
                            {data.businessTaxId && <p className="mt-2 text-xs text-slate-400">Tax ID: {data.businessTaxId}</p>}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Bill To</h3>
                        <div className="text-sm font-medium text-slate-900">
                            <p>{data.customerName || 'Customer Name'}</p>
                            <p className="text-slate-500 font-normal mt-1 whitespace-pre-line">{data.customerAddress}</p>
                            {data.customerTaxId && <p className="mt-2 text-xs text-slate-400">Tax ID: {data.customerTaxId}</p>}
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="mb-8">
                    <div className="flex text-xs font-bold uppercase tracking-wider text-white px-4 py-3 rounded" style={{ backgroundColor: themeColor }}>
                        <div className="flex-1">Description</div>
                        <div className="w-24 text-center">Qty</div>
                        <div className="w-32 text-right">Price</div>
                        <div className="w-32 text-right">Total</div>
                    </div>
                    <div className="mt-2 space-y-2">
                        {data.items.map((item, i) => (
                            <div key={item.id} className={`flex items-center px-4 py-3 text-sm ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                                <div className="flex-1 font-medium text-slate-900">{item.description}</div>
                                <div className="w-24 text-center text-slate-500">{item.quantity}</div>
                                <div className="w-32 text-right text-slate-500">{currencySymbol}{item.price.toFixed(2)}</div>
                                <div className="w-32 text-right font-bold text-slate-900">{currencySymbol}{(item.quantity * item.price).toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-12">
                    <div className="w-1/3 min-w-[250px] space-y-3">
                        <div className="flex justify-between text-sm text-slate-500 border-b border-slate-100 pb-2">
                            <span>Subtotal</span>
                            <span className="font-medium text-slate-900">{currencySymbol}{subtotal.toFixed(2)}</span>
                        </div>
                        {data.discount > 0 && (
                            <div className="flex justify-between text-sm text-emerald-600 border-b border-slate-100 pb-2">
                                <span>Discount</span>
                                <span>-{currencySymbol}{data.discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm text-slate-500 border-b border-slate-100 pb-2">
                            <span>Tax ({data.taxRate}%)</span>
                            <span className="font-medium text-slate-900">{currencySymbol}{taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-slate-900 pt-2">
                            <span>Total</span>
                            <span style={{ color: themeColor }}>{currencySymbol}{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-auto grid grid-cols-2 gap-8 pt-8 border-t-4 border-slate-100">
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-2">Payment Info</h4>
                        <div className="text-sm text-slate-500 space-y-1">
                            {data.bankName && <p>Bank: {data.bankName}</p>}
                            {data.accountName && <p>Account: {data.accountName}</p>}
                            {data.accountNumber && <p>No: {data.accountNumber}</p>}
                        </div>
                        {data.notes && (
                            <div className="mt-6">
                                <h4 className="font-bold text-slate-900 text-sm mb-2">Notes</h4>
                                <p className="text-sm text-slate-500 italic">{data.notes}</p>
                            </div>
                        )}
                    </div>
                    <div className="text-right flex flex-col items-end justify-end">
                        {data.signature && (
                            <div className="text-center">
                                <div className="text-2xl font-dancing-script mb-2 text-slate-800">{data.signature}</div>
                                <div className="border-t border-slate-300 w-40 pt-2 text-xs uppercase tracking-wider text-slate-400">Authorized Signatory</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Branding */}
                {data.footer && (
                    <div className="text-center text-xs text-slate-300 mt-8">
                        {data.footer}
                    </div>
                )}
            </div>
        </div>
    );
};
