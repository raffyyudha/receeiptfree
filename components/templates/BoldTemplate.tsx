import React from 'react';
import { ReceiptData, CURRENCY_OPTIONS } from '../../types';

interface TemplateProps {
    data: ReceiptData;
}

export const BoldTemplate: React.FC<TemplateProps> = ({ data }) => {
    const currencyObj = CURRENCY_OPTIONS.find(c => c.value === data.currency) || CURRENCY_OPTIONS[0];
    const currencySymbol = currencyObj.symbol;

    const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    const taxableAmount = Math.max(subtotal - (data.discount || 0), 0);
    const taxAmount = taxableAmount * (data.taxRate / 100);
    const total = taxableAmount + taxAmount + (data.shipping || 0);

    const themeColor = data.color || '#0f172a';

    return (
        <div className="mx-auto min-h-[1000px] w-full max-w-[800px] bg-white shadow-2xl ring-1 ring-black/5 lg:min-h-[1123px] flex flex-col font-sans">

            {/* Huge Header */}
            <div className="bg-slate-900 text-white p-12 py-16" style={{ backgroundColor: themeColor }}>
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-5xl font-black tracking-tighter">RECEIPT</h1>
                    <div className="text-right opacity-50 font-mono">
                        #{data.receiptNumber}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-12">
                    <div>
                        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>Issued By</div>
                        <h2 className="text-2xl font-bold mb-1">{data.businessName || 'Business Name'}</h2>
                        <div className="text-sm text-slate-300 opacity-80 leading-relaxed max-w-xs">
                            {data.businessAddress}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>Total Amount</div>
                        <div className="text-4xl font-bold text-emerald-400" style={{ color: '#fff' }}>{currencySymbol}{total.toFixed(2)}</div>
                        <div className="text-sm mt-2 text-slate-300">Due {data.dueDate}</div>
                    </div>
                </div>
            </div>

            <div className="p-12 flex-1">
                {/* Client Info */}
                <div className="mb-16">
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Billed To</div>
                    <div className="text-xl font-bold text-slate-900 mb-1">{data.customerName}</div>
                    <div className="text-slate-500">{data.customerAddress}</div>
                </div>

                {/* Items */}
                <table className="w-full mb-12">
                    <thead className="border-b-4 border-slate-900" style={{ borderColor: themeColor }}>
                        <tr className="text-left text-sm font-black uppercase tracking-wider">
                            <th className="py-4">Item Description</th>
                            <th className="py-4 text-center">Qty</th>
                            <th className="py-4 text-right">Price</th>
                            <th className="py-4 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.items.map((item) => (
                            <tr key={item.id}>
                                <td className="py-4 font-bold text-slate-900">{item.description}</td>
                                <td className="py-4 text-center text-slate-500 font-medium">{item.quantity}</td>
                                <td className="py-4 text-right text-slate-500">{currencySymbol}{item.price.toFixed(2)}</td>
                                <td className="py-4 text-right font-bold text-slate-900">{currencySymbol}{(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Breakdown */}
                <div className="flex justify-end mb-16">
                    <div className="w-1/2 md:w-1/3 space-y-4">
                        <div className="flex justify-between font-medium text-slate-500">
                            <span>Subtotal</span>
                            <span>{currencySymbol}{subtotal.toFixed(2)}</span>
                        </div>
                        {data.taxRate > 0 && (
                            <div className="flex justify-between font-medium text-slate-500">
                                <span>Tax {data.taxRate}%</span>
                                <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-2xl font-black text-slate-900 border-t-4 border-slate-900 pt-4" style={{ borderColor: themeColor, color: themeColor }}>
                            <span>Total</span>
                            <span>{currencySymbol}{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {data.bankName && (
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-8">
                        <div className="flex items-start gap-4">
                            <div className="bg-slate-900 text-white p-2 rounded" style={{ backgroundColor: themeColor }}>
                                <span className="font-bold text-xs">PAY</span>
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 mb-1">Payment Details</div>
                                <div className="text-sm text-slate-500 grid grid-cols-2 gap-x-8 gap-y-1">
                                    <span>Bank: {data.bankName}</span>
                                    <span>Account: {data.accountNumber}</span>
                                    {data.swiftCode && <span>Swift: {data.swiftCode}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {data.notes && (
                    <div className="text-sm text-slate-500 border-l-4 border-slate-200 pl-4 italic">
                        {data.notes}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-slate-900 text-slate-500 p-6 text-center text-xs uppercase tracking-widest" style={{ backgroundColor: themeColor, color: 'rgba(255,255,255,0.5)' }}>
                {data.footer || 'Generated by ReceiptGen'}
            </div>
        </div>
    );
};
