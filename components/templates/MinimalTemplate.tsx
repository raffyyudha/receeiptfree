import React from 'react';
import { ReceiptData, CURRENCY_OPTIONS } from '../../types';

interface TemplateProps {
    data: ReceiptData;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ data }) => {
    const currencyObj = CURRENCY_OPTIONS.find(c => c.value === data.currency) || CURRENCY_OPTIONS[0];
    const currencySymbol = currencyObj.symbol;

    const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    const taxableAmount = Math.max(subtotal - (data.discount || 0), 0);
    const taxAmount = taxableAmount * (data.taxRate / 100);
    const total = taxableAmount + taxAmount + (data.shipping || 0);

    const themeColor = data.color || '#000000';

    return (
        <div className="mx-auto min-h-[1000px] w-full max-w-[800px] bg-white p-12 shadow-2xl ring-1 ring-black/5 lg:min-h-[1123px] font-mono text-sm text-slate-800">

            {/* Centered Header */}
            <div className="text-center mb-16">
                {data.logo && (
                    <img src={data.logo} alt="Logo" className="h-16 w-auto mx-auto mb-6 grayscale" />
                )}
                <h1 className="text-2xl font-bold uppercase tracking-widest border-b-2 border-black pb-4 mb-4 inline-block" style={{ borderColor: themeColor, color: themeColor }}>
                    {data.businessName || 'RECEIPT'}
                </h1>
                <div className="space-y-1 text-xs uppercase tracking-wider">
                    <p>{data.businessAddress}</p>
                    <p>{data.businessPhone}</p>
                    <p>{data.businessEmail}</p>
                </div>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-12 border-b-2 border-dashed border-slate-300 pb-8">
                <div>
                    <div className="mb-4">
                        <span className="block text-xs text-slate-400 uppercase">Billed To</span>
                        <span className="font-bold">{data.customerName}</span>
                        <div className="text-xs mt-1">{data.customerAddress}</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="grid grid-cols-2 gap-2 text-right">
                        <span className="text-slate-400 uppercase text-xs">Receipt #</span>
                        <span>{data.receiptNumber}</span>

                        <span className="text-slate-400 uppercase text-xs">Date</span>
                        <span>{data.date}</span>

                        <span className="text-slate-400 uppercase text-xs">Due</span>
                        <span>{data.dueDate}</span>
                    </div>
                </div>
            </div>

            {/* Items List */}
            <div className="mb-8">
                <div className="grid grid-cols-12 border-b border-black pb-2 mb-4 font-bold uppercase" style={{ borderColor: themeColor, color: themeColor }}>
                    <div className="col-span-6">Item</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-right">Price</div>
                    <div className="col-span-2 text-right">Total</div>
                </div>
                <div className="space-y-3">
                    {data.items.map(item => (
                        <div key={item.id} className="grid grid-cols-12">
                            <div className="col-span-6 truncate pr-2">{item.description}</div>
                            <div className="col-span-2 text-center text-slate-500">{item.quantity}</div>
                            <div className="col-span-2 text-right text-slate-500">{item.price.toFixed(2)}</div>
                            <div className="col-span-2 text-right font-bold">{(item.quantity * item.price).toFixed(2)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Totals - Right Aligned */}
            <div className="flex justify-end mb-16">
                <div className="w-1/2 border-t border-black pt-4 space-y-2" style={{ borderColor: themeColor }}>
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{currencySymbol}{subtotal.toFixed(2)}</span>
                    </div>
                    {data.discount > 0 && (
                        <div className="flex justify-between">
                            <span>Discount</span>
                            <span>-{currencySymbol}{data.discount.toFixed(2)}</span>
                        </div>
                    )}
                    {data.taxRate > 0 && (
                        <div className="flex justify-between">
                            <span>Tax ({data.taxRate}%)</span>
                            <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
                        </div>
                    )}
                    {data.shipping > 0 && (
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>{currencySymbol}{data.shipping.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-4 border-t-2 border-dashed border-black mt-2" style={{ borderColor: themeColor }}>
                        <span className="uppercase" style={{ color: themeColor }}>Total Due</span>
                        <span style={{ color: themeColor }}>{currencySymbol}{total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Footer Info */}
            <div className="text-center space-y-4">
                {data.bankName && (
                    <div className="border border-slate-200 p-4 inline-block text-xs text-left">
                        <div className="font-bold uppercase mb-1">Payment Instructions</div>
                        <div>Bank: {data.bankName}</div>
                        <div>Acc: {data.accountNumber}</div>
                    </div>
                )}

                <div className="pt-8 text-xs uppercase tracking-widest text-slate-400">
                    {data.footer || 'Thank you for your business'}
                </div>
            </div>

        </div>
    );
};
