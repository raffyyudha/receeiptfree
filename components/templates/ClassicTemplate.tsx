import React from 'react';
import { ReceiptData, CURRENCY_OPTIONS } from '../../types';

interface TemplateProps {
    data: ReceiptData;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
    const currencyObj = CURRENCY_OPTIONS.find(c => c.value === data.currency) || CURRENCY_OPTIONS[0];
    const currencySymbol = currencyObj.symbol;

    const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    const taxableAmount = Math.max(subtotal - (data.discount || 0), 0);
    const taxAmount = taxableAmount * (data.taxRate / 100);
    const total = taxableAmount + taxAmount + (data.shipping || 0);

    const themeColor = data.color || '#0f172a';

    return (
        <div className="mx-auto min-h-[1000px] w-full max-w-[800px] bg-white p-8 shadow-2xl ring-1 ring-black/5 md:p-12 lg:min-h-[1123px]">

            {/* Header */}
            <div className="mb-12 flex justify-between items-start">
                <div className="w-1/2">
                    {data.logo ? (
                        <img src={data.logo} alt="Business Logo" className="mb-4 h-20 w-auto object-contain object-left" />
                    ) : (
                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded bg-gray-50 text-xs text-gray-300 border border-dashed border-gray-200">
                            NO LOGO
                        </div>
                    )}
                    <h1 className="text-xl font-bold text-slate-900" style={{ color: themeColor }}>{data.businessName || 'Your Business Name'}</h1>
                    <div className="mt-2 text-sm text-slate-500 whitespace-pre-line leading-relaxed">
                        {data.businessAddress || '123 Business Address'}
                    </div>
                    {(data.businessEmail || data.businessPhone || data.businessWebsite) && (
                        <div className="mt-3 text-sm text-slate-500 space-y-0.5">
                            {data.businessEmail && <p>{data.businessEmail}</p>}
                            {data.businessPhone && <p>{data.businessPhone}</p>}
                            {data.businessWebsite && <p>{data.businessWebsite}</p>}
                        </div>
                    )}
                    {data.businessTaxId && (
                        <p className="mt-2 text-sm font-medium text-slate-600">Tax ID: {data.businessTaxId}</p>
                    )}
                </div>

                <div className="text-right w-1/2">
                    <div className="text-4xl font-extrabold tracking-tight text-slate-200 uppercase" style={{ color: themeColor, opacity: 0.1 }}>Receipt</div>
                    <div className="mt-6 space-y-2">
                        <div className="flex justify-end gap-4">
                            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Receipt #</span>
                            <span className="text-sm font-bold text-slate-900 min-w-[80px]">{data.receiptNumber}</span>
                        </div>
                        <div className="flex justify-end gap-4">
                            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Date</span>
                            <span className="text-sm font-medium text-slate-900 min-w-[80px]">{data.date}</span>
                        </div>
                        {data.dueDate && (
                            <div className="flex justify-end gap-4">
                                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Due Date</span>
                                <span className="text-sm font-medium text-slate-900 min-w-[80px]">{data.dueDate}</span>
                            </div>
                        )}
                        <div className="flex justify-end gap-4">
                            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Status</span>
                            <span className={`text-sm font-bold min-w-[80px] ${data.status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>{data.status}</span>
                        </div>
                    </div>
                    {data.paymentMethod && (
                        <div className="mt-4 inline-block rounded bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600 border border-slate-100">
                            Paid via {data.paymentMethod}
                        </div>
                    )}
                </div>
            </div>

            <div className="my-8 h-px w-full bg-slate-100"></div>

            {/* Bill To */}
            <div className="mb-12">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Bill To</h3>
                <div className="text-base font-bold text-slate-900">{data.customerName || 'Customer Name'}</div>
                <div className="mt-1 text-sm text-slate-500 whitespace-pre-line">{data.customerAddress}</div>
                {data.customerEmail && <div className="mt-1 text-sm text-slate-500">{data.customerEmail}</div>}
                {data.customerTaxId && (
                    <p className="mt-2 text-sm font-medium text-slate-600">Tax ID: {data.customerTaxId}</p>
                )}
            </div>

            {/* Items Table */}
            <div className="mb-8">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-slate-900 text-left text-xs font-bold uppercase tracking-wider text-slate-900" style={{ borderColor: themeColor }}>
                            <th className="py-3" style={{ color: themeColor }}>Description</th>
                            <th className="py-3 text-center w-24" style={{ color: themeColor }}>Qty</th>
                            <th className="py-3 text-right w-32" style={{ color: themeColor }}>Price</th>
                            <th className="py-3 text-right w-32" style={{ color: themeColor }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {data.items.map((item) => (
                            <tr key={item.id}>
                                <td className="py-4 font-medium text-slate-900">{item.description || 'Item Name'}</td>
                                <td className="py-4 text-center text-slate-500">{item.quantity}</td>
                                <td className="py-4 text-right text-slate-500">{currencySymbol}{item.price.toFixed(2)}</td>
                                <td className="py-4 text-right font-medium text-slate-900">{currencySymbol}{(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Calculations */}
            <div className="flex justify-end">
                <div className="w-64 space-y-3">
                    <div className="flex justify-between text-sm text-slate-500">
                        <span>Subtotal</span>
                        <span className="font-medium text-slate-900">{currencySymbol}{subtotal.toFixed(2)}</span>
                    </div>
                    {data.discount > 0 && (
                        <div className="flex justify-between text-sm text-emerald-600">
                            <span>Discount</span>
                            <span>-{currencySymbol}{data.discount.toFixed(2)}</span>
                        </div>
                    )}
                    {data.taxRate > 0 && (
                        <div className="flex justify-between text-sm text-slate-500">
                            <span>Tax ({data.taxRate}%)</span>
                            <span className="font-medium text-slate-900">{currencySymbol}{taxAmount.toFixed(2)}</span>
                        </div>
                    )}
                    {data.shipping > 0 && (
                        <div className="flex justify-between text-sm text-slate-500">
                            <span>Shipping</span>
                            <span className="font-medium text-slate-900">{currencySymbol}{data.shipping.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="border-t border-slate-900 pt-3">
                        <div className="flex justify-between items-baseline">
                            <span className="text-base font-bold text-slate-900">Total</span>
                            <span className="text-2xl font-bold text-slate-900" style={{ color: themeColor }}>{currencySymbol}{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bank Details & Signature Section */}
            {(data.bankName || data.signature) && (
                <div className="mt-12 grid grid-cols-2 gap-8 border-t border-slate-100 pt-8">
                    <div>
                        {data.bankName && (
                            <div className="text-sm">
                                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Payment Details</h4>
                                <p className="font-semibold text-slate-900">{data.bankName}</p>
                                <p className="text-slate-500">Account: {data.accountName}</p>
                                <p className="text-slate-500">No: {data.accountNumber}</p>
                                {data.swiftCode && <p className="text-slate-500">SWIFT: {data.swiftCode}</p>}
                            </div>
                        )}
                    </div>
                    <div className="text-right flex flex-col items-end">
                        {data.signature && (
                            <>
                                <div className="mb-2 h-16 w-32 border-b border-slate-300 flex items-end justify-center pb-2 font-dancing-script text-xl text-slate-800 italic">
                                    {/* If it's an image, render img, else text */}
                                    {data.signature}
                                </div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Authorized Signature</p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Footer Notes */}
            {(data.notes || data.footer) && (
                <div className="mt-8 pt-8">
                    {data.notes && (
                        <div className="mb-6">
                            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Notes</h4>
                            <p className="text-sm text-slate-500 whitespace-pre-line leading-relaxed">{data.notes}</p>
                        </div>
                    )}
                    {data.footer && (
                        <div className="text-center text-xs text-slate-400 mt-8">
                            {data.footer}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
