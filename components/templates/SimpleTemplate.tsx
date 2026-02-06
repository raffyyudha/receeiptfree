import React from 'react';
import { ReceiptData, CURRENCY_OPTIONS } from '../../types';

interface TemplateProps {
    data: ReceiptData;
}

export const SimpleTemplate: React.FC<TemplateProps> = ({ data }) => {
    const currencyObj = CURRENCY_OPTIONS.find(c => c.value === data.currency) || CURRENCY_OPTIONS[0];
    const currencySymbol = currencyObj.symbol;

    const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    const taxableAmount = Math.max(subtotal - (data.discount || 0), 0);
    const taxAmount = taxableAmount * (data.taxRate / 100);
    const total = taxableAmount + taxAmount + (data.shipping || 0);
    const taxLabel = data.taxLabel || 'Tax';

    return (
        <div className="mx-auto min-h-[1000px] w-full max-w-[800px] bg-white p-12 shadow-2xl ring-1 ring-black/5 lg:min-h-[1123px] font-sans text-slate-900">
            {/* Header: Logo Left, Title Right */}
            <div className="flex justify-between items-start mb-8 border-b-2 border-slate-900 pb-8">
                <div className="flex flex-col items-start">
                    {data.logo ? (
                        <img src={data.logo} alt="Logo" className="h-16 w-auto object-contain mb-4" />
                    ) : (
                        <h1 className="text-3xl font-bold uppercase tracking-tight">{data.businessName || 'RECEIPT'}</h1>
                    )}
                    {data.logo && <h2 className="text-xl font-bold">{data.businessName}</h2>}
                    <div className="text-sm mt-2 space-y-1">
                        <p>{data.businessAddress}</p>
                        <p>{data.businessEmail}</p>
                        <p>{data.businessPhone}</p>
                        {data.businessWebsite && <p>{data.businessWebsite}</p>}
                        {data.businessTaxId && <p>Tax ID: {data.businessTaxId}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-5xl font-light text-slate-300 mb-4">RECEIPT</div>
                    <div className="space-y-1 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                            <span className="font-bold text-slate-600">Receipt #:</span>
                            <span>{data.receiptNumber}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <span className="font-bold text-slate-600">Date:</span>
                            <span>{data.date}</span>
                        </div>
                        {data.dueDate && (
                            <div className="grid grid-cols-2 gap-4">
                                <span className="font-bold text-slate-600">Due Date:</span>
                                <span>{data.dueDate}</span>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <span className="font-bold text-slate-600">Status:</span>
                            <span className={data.status === 'PAID' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>{data.status}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bill To */}
            <div className="mb-12">
                <h3 className="text-sm font-bold uppercase text-slate-400 mb-2">Bill To</h3>
                <div className="text-lg font-bold">{data.customerName}</div>
                <div className="text-sm text-slate-600 mt-1 whitespace-pre-line">
                    {data.customerAddress}
                    {data.customerEmail && <div>{data.customerEmail}</div>}
                    {data.customerPhone && <div>{data.customerPhone}</div>}
                    {data.customerWebsite && <div>{data.customerWebsite}</div>}
                    {data.customerTaxId && <div className="mt-1">Tax ID: {data.customerTaxId}</div>}
                </div>
            </div>

            {/* Table */}
            <table className="w-full mb-8 border-collapse">
                <thead>
                    <tr className="border-b border-slate-300">
                        <th className="py-3 text-left text-sm font-bold text-slate-600 uppercase">Description</th>
                        <th className="py-3 text-center text-sm font-bold text-slate-600 uppercase w-20">Qty</th>
                        <th className="py-3 text-right text-sm font-bold text-slate-600 uppercase w-32">Price</th>
                        <th className="py-3 text-right text-sm font-bold text-slate-600 uppercase w-32">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map(item => (
                        <tr key={item.id} className="border-b border-slate-100">
                            <td className="py-4 text-slate-800">{item.description}</td>
                            <td className="py-4 text-center text-slate-600">{item.quantity}</td>
                            <td className="py-4 text-right text-slate-600">{currencySymbol}{item.price.toFixed(2)}</td>
                            <td className="py-4 text-right font-bold text-slate-900">{currencySymbol}{(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-12">
                <div className="w-1/2 space-y-2">
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>Subtotal</span>
                        <span>{currencySymbol}{subtotal.toFixed(2)}</span>
                    </div>
                    {data.discount > 0 && (
                        <div className="flex justify-between text-sm text-emerald-600">
                            <span>Discount</span>
                            <span>-{currencySymbol}{data.discount.toFixed(2)}</span>
                        </div>
                    )}
                    {data.taxRate > 0 && (
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>{taxLabel} ({data.taxRate}%)</span>
                            <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
                        </div>
                    )}
                    {data.shipping > 0 && (
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Shipping</span>
                            <span>{currencySymbol}{data.shipping.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-xl font-bold text-slate-900 border-t-2 border-slate-900 pt-4 mt-4">
                        <span>Total</span>
                        <span>{currencySymbol}{total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Bottom Info */}
            <div className="grid grid-cols-2 gap-8 text-sm">
                <div>
                    {data.notes && (
                        <div className="mb-6">
                            <h4 className="font-bold text-slate-900 mb-1">Notes</h4>
                            <p className="text-slate-600 leading-relaxed">{data.notes}</p>
                        </div>
                    )}
                    {data.terms && (
                        <div className="mb-6">
                            <h4 className="font-bold text-slate-900 mb-1">Terms & Conditions</h4>
                            <p className="text-slate-600 leading-relaxed text-xs">{data.terms}</p>
                        </div>
                    )}
                </div>
                <div>
                    {data.bankName && (
                        <div className="bg-slate-50 p-4 rounded mb-6">
                            <h4 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-2">Payment Details</h4>
                            <div className="space-y-1 text-slate-600">
                                <div><span className="font-medium">Bank:</span> {data.bankName}</div>
                                <div><span className="font-medium">Account Name:</span> {data.accountName}</div>
                                <div><span className="font-medium">Account No:</span> {data.accountNumber}</div>
                                {data.swiftCode && <div><span className="font-medium">SWIFT/IBAN:</span> {data.swiftCode}</div>}
                            </div>
                        </div>
                    )}
                    {data.signature && (
                        <div className="mt-8 text-right">
                            <div className="font-dancing-script text-2xl text-slate-800 mb-2">{data.signature}</div>
                            <div className="border-t border-slate-300 inline-block pt-1 uppercase text-xs tracking-wider text-slate-400">Authorized Signature</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-12 text-center text-xs text-slate-400">
                {data.footer}
            </div>

        </div>
    );
};
