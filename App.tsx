import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Trash2, Download, RotateCcw, Receipt,
  Check, Zap, ArrowRight, ChevronDown, Image as ImageIcon,
  FileText, CreditCard, Calendar, Truck, Percent,
  Eye, X
} from 'lucide-react';
import { Input, TextArea } from './components/Input';
import { Button } from './components/Button';
import { ReceiptData, ReceiptItem, CURRENCY_OPTIONS } from './types';
import { generatePDF } from './services/pdfGenerator';
import { ReceiptPreview } from './components/ReceiptPreview';

// --- Constants & Defaults ---
const DEFAULT_ITEM: ReceiptItem = {
  id: '1',
  description: '',
  quantity: 1,
  price: 0
};

const INITIAL_STATE: ReceiptData = {
  // Business
  businessName: '',
  businessAddress: '',
  businessEmail: '',
  businessWebsite: '',
  businessPhone: '',
  businessTaxId: '', // NEW

  // Transaction
  receiptNumber: '',
  date: new Date().toISOString().split('T')[0],
  dueDate: '',
  paymentMethod: '',
  currency: 'USD',

  // Customer
  customerName: '',
  customerEmail: '',
  customerAddress: '',
  customerTaxId: '', // NEW

  // Financials
  items: [{ ...DEFAULT_ITEM }],
  taxRate: 0,
  discount: 0,
  shipping: 0,

  // Meta
  notes: '',
  footer: '',

  // New Fields
  bankName: '',
  accountName: '',
  accountNumber: '',
  swiftCode: '',
  signature: '',
  status: 'PAID',

  // Customization
  template: 'classic',
  color: '#0f172a', // Default Slate-900

  // Extras
  customerPhone: '',
  customerWebsite: '',
  taxLabel: 'Tax',
  terms: '',
};

const FAQS = [
  {
    q: "Is this receipt generator truly free?",
    a: "Yes, it is 100% free. We do not charge any fees, and there are no premium tiers. The project is supported by the community."
  },
  {
    q: "Do you store my data?",
    a: "No. All generation happens in your browser (client-side). Your receipt data never leaves your device, ensuring maximum privacy."
  },
  {
    q: "Can I add my business logo?",
    a: "Yes! You can upload your business logo to make your receipts look professional. The logo is processed locally in your browser."
  },
  {
    q: "Is this suitable for official use?",
    a: "Yes. We include all necessary fields like Tax ID / VAT, address details, and breakdown of taxes to ensure it meets standard invoicing requirements."
  }
];

// --- Main App Component ---
const App: React.FC = () => {
  const [data, setData] = useState<ReceiptData>(INITIAL_STATE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const generatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setData(prev => ({
      ...prev,
      receiptNumber: Math.floor(100000 + Math.random() * 900000).toString()
    }));
  }, []);

  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleItemChange = (id: string, field: keyof ReceiptItem, value: string | number) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    setData(prev => ({
      ...prev,
      items: [...prev.items, { ...DEFAULT_ITEM, id: Date.now().toString() }]
    }));
  };

  const removeItem = (id: string) => {
    if (data.items.length === 1) return;
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleReset = () => {
    if (window.confirm('Reset everything to default?')) {
      setData({
        ...INITIAL_STATE,
        receiptNumber: Math.floor(100000 + Math.random() * 900000).toString(),
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      generatePDF(data);
    } catch (error) {
      console.error(error);
      alert("Error generating PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const currencySymbol = CURRENCY_OPTIONS.find(c => c.value === data.currency)?.symbol || '$';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">

      {/* --- Navigation --- */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-md">
              <Receipt size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">FreeReceipt</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
            <Button size="sm" onClick={scrollToGenerator}>Start Now</Button>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative overflow-hidden bg-white pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">

          <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition-transform hover:scale-105">
            <Zap size={16} className="fill-yellow-400 text-yellow-500" />
            <span className="tracking-wide">Professional Invoicing, 100% Free</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl mb-6 drop-shadow-sm uppercase">
            Receipt Generator<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900">PDF Free - No Watermark</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-500 mb-10 leading-relaxed">
            Instantly create professional receipts. <strong>100% Free. No Watermark. No Signup.</strong>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="xl" onClick={scrollToGenerator} icon={<ArrowRight />} className="w-full sm:w-auto shadow-xl shadow-slate-900/10">
              Create My Receipt
            </Button>
            <div className="flex items-center gap-4 px-4 text-sm font-medium text-slate-500">
              <span>Try it below ↓</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- Main Workspace (Split View) --- */}
      <div id="generator" ref={generatorRef} className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">

            {/* --- LEFT COLUMN: The Form --- */}
            <div className="lg:col-span-6 xl:col-span-5 space-y-8">

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Edit Receipt</h2>
                  <p className="text-slate-500 text-sm">Fill in the details below.</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleReset} icon={<RotateCcw size={14} />}>
                  Reset
                </Button>
              </div>

              {/* Form Container */}
              <div className="space-y-8 pb-20">

                {/* 0. Design & Customization (NEW) */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm ring-4 ring-slate-50/50">
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                    <Zap size={18} className="text-amber-500 fill-amber-500" /> Design & Template
                  </h3>

                  <div className="mb-6">
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-500">Choose Template</label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        { id: 'classic', label: 'Classic' },
                        { id: 'modern', label: 'Modern' },
                        { id: 'minimal', label: 'Minimal' },
                        { id: 'bold', label: 'Bold' },
                        { id: 'simple', label: 'Simple' },
                        { id: 'elegant', label: 'Elegant' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setData(prev => ({ ...prev, template: t.id as any }))}
                          className={`rounded-lg border-2 px-2 py-3 text-sm font-medium transition-all ${data.template === t.id
                            ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-500">Accent Color</label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        '#0f172a', // Slate 900
                        '#3b82f6', // Blue 500
                        '#ef4444', // Red 500
                        '#10b981', // Emerald 500
                        '#f59e0b', // Amber 500
                        '#8b5cf6', // Violet 500
                        '#ec4899', // Pink 500
                      ].map((c) => (
                        <button
                          key={c}
                          onClick={() => setData(prev => ({ ...prev, color: c }))}
                          className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${data.color === c ? 'border-slate-900 ring-2 ring-slate-200 ring-offset-2' : 'border-transparent'
                            }`}
                          style={{ backgroundColor: c }}
                          aria-label={`Select color ${c}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* 1. Branding & Business */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                    <ImageIcon size={18} /> Branding & Business
                  </h3>

                  {/* Logo Upload */}
                  <div className="mb-6">
                    <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Business Logo</label>
                    <div className="group relative flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-slate-900 hover:bg-slate-100">
                      {data.logo ? (
                        <>
                          <img src={data.logo} alt="Logo" className="h-full w-full object-contain p-2" />
                          <button
                            onClick={() => setData(prev => ({ ...prev, logo: undefined }))}
                            className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-sm hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="mb-2 text-slate-400" size={24} />
                          <span className="text-sm font-medium text-slate-500">Click to upload logo</span>
                        </>
                      )}
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 cursor-pointer opacity-0" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Input label="Business Name" name="businessName" placeholder="e.g. Acme Studio" value={data.businessName} onChange={handleInputChange} />
                    <TextArea label="Business Address" name="businessAddress" placeholder="Full address" value={data.businessAddress} onChange={handleInputChange} className="min-h-[80px]" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Tax ID / VAT No" name="businessTaxId" placeholder="Optional" value={data.businessTaxId} onChange={handleInputChange} />
                      <Input label="Phone" name="businessPhone" placeholder="Optional" value={data.businessPhone} onChange={handleInputChange} />
                    </div>
                    <Input label="Email" name="businessEmail" placeholder="help@acme.com" value={data.businessEmail} onChange={handleInputChange} />
                    <Input label="Website" name="businessWebsite" placeholder="www.acme.com" value={data.businessWebsite} onChange={handleInputChange} />
                  </div>
                </div>

                {/* 2. Customer Info */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                    <FileText size={18} /> Customer Details
                  </h3>
                  <div className="space-y-4">
                    <Input label="Customer Name" name="customerName" placeholder="Client Name" value={data.customerName} onChange={handleInputChange} />
                    <Input label="Customer Email" name="customerEmail" placeholder="client@email.com" value={data.customerEmail} onChange={handleInputChange} />
                    <Input label="Customer Phone" name="customerPhone" placeholder="+1 234 567 890" value={data.customerPhone} onChange={handleInputChange} />
                    <Input label="Customer Website" name="customerWebsite" placeholder="client-site.com" value={data.customerWebsite} onChange={handleInputChange} />
                    <TextArea label="Customer Address" name="customerAddress" placeholder="Billing Address" value={data.customerAddress} onChange={handleInputChange} className="min-h-[80px]" />
                    <Input label="Customer Tax ID / VAT" name="customerTaxId" placeholder="Optional" value={data.customerTaxId} onChange={handleInputChange} />
                  </div>
                </div>

                {/* 3. Receipt Meta */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                    <Calendar size={18} /> Receipt Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Receipt Number" name="receiptNumber" value={data.receiptNumber} onChange={handleInputChange} />
                    <Input label="Date Issued" name="date" type="date" value={data.date} onChange={handleInputChange} />
                    <Input label="Payment Method" name="paymentMethod" placeholder="e.g. Credit Card" value={data.paymentMethod} onChange={handleInputChange} />
                    <Input label="Due Date" name="dueDate" type="date" value={data.dueDate} onChange={handleInputChange} />

                    <div className="col-span-2">
                      <div className="group flex flex-col gap-2">
                        <label className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">Currency</label>
                        <div className="relative">
                          <select
                            name="currency"
                            value={data.currency}
                            onChange={handleInputChange}
                            className="flex h-12 w-full appearance-none rounded-lg border-2 border-slate-100 bg-slate-50/50 px-4 text-[15px] font-medium text-slate-900 hover:border-slate-300 focus:border-slate-900 focus:bg-white focus:outline-none transition-all"
                          >
                            {CURRENCY_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Items */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                    <CreditCard size={18} /> Items
                  </h3>
                  <div className="space-y-4">
                    {data.items.map((item) => (
                      <div key={item.id} className="relative grid grid-cols-12 gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                        <div className="col-span-12 sm:col-span-6">
                          <label className="mb-1 block text-xs font-semibold text-slate-500">Description</label>
                          <input
                            className="w-full bg-transparent text-sm font-medium text-slate-900 focus:outline-none"
                            placeholder="Item name"
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          />
                        </div>
                        <div className="col-span-4 sm:col-span-2">
                          <label className="mb-1 block text-xs font-semibold text-slate-500">Qty</label>
                          <input
                            type="number" min="0"
                            className="w-full rounded bg-white px-2 py-1 text-sm border border-slate-200 focus:border-slate-900 focus:outline-none"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label className="mb-1 block text-xs font-semibold text-slate-500">Price</label>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">{currencySymbol}</span>
                            <input
                              type="number" min="0" step="0.01"
                              className="w-full rounded bg-white pl-5 pr-2 py-1 text-sm border border-slate-200 focus:border-slate-900 focus:outline-none"
                              value={item.price}
                              onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                        <div className="col-span-2 sm:col-span-1 flex items-end justify-center pb-1">
                          <button onClick={() => removeItem(item.id)} disabled={data.items.length === 1} className="text-slate-400 hover:text-red-500 disabled:opacity-0">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addItem} icon={<Plus size={14} />} className="w-full">
                      Add Item
                    </Button>
                  </div>
                </div>

                {/* 5. Totals & Settings */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                    <Percent size={18} /> Taxes & Fees
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">Discount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{currencySymbol}</span>
                        <input
                          type="number" name="discount" min="0" step="0.01"
                          value={data.discount} onChange={handleNumberChange}
                          className="w-full rounded-lg border-2 border-slate-100 bg-slate-50/50 pl-8 pr-4 py-2 text-sm font-medium focus:border-slate-900 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex gap-2">
                        <label className="text-xs font-semibold text-slate-500 w-2/3">Tax Label</label>
                        <label className="text-xs font-semibold text-slate-500 w-1/3">Rate %</label>
                      </div>
                      <div className="flex gap-2">
                        <input name="taxLabel" value={data.taxLabel || 'Tax'} onChange={handleInputChange} className="w-2/3 rounded-lg border-2 border-slate-100 bg-slate-50/50 px-3 py-2 text-sm font-medium focus:border-slate-900 focus:bg-white focus:outline-none" />
                        <input
                          type="number" name="taxRate" min="0" step="0.1"
                          value={data.taxRate} onChange={handleNumberChange}
                          className="w-full rounded-lg border-2 border-slate-100 bg-slate-50/50 px-4 py-2 text-sm font-medium focus:border-slate-900 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <label className="text-xs font-semibold text-slate-500">Shipping Cost</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{currencySymbol}</span>
                        <input
                          type="number" name="shipping" min="0" step="0.01"
                          value={data.shipping} onChange={handleNumberChange}
                          className="w-full rounded-lg border-2 border-slate-100 bg-slate-50/50 pl-8 pr-4 py-2 text-sm font-medium focus:border-slate-900 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. Payment Details & Status (NEW) */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                    <Truck size={18} /> Payment Info
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Bank Name" name="bankName" placeholder="Bank Name" value={data.bankName} onChange={handleInputChange} />
                    <Input label="Account Name" name="accountName" placeholder="Holder Name" value={data.accountName} onChange={handleInputChange} />
                    <Input label="Account Number" name="accountNumber" placeholder="xxxx-xxxx" value={data.accountNumber} onChange={handleInputChange} />
                    <Input label="SWIFT / IBAN" name="swiftCode" placeholder="Optional" value={data.swiftCode} onChange={handleInputChange} />

                    <div className="col-span-2 border-t border-slate-100 pt-4 mt-2">
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Signature / Signatory</label>
                      <Input label="" name="signature" placeholder="Name or Text to display as signature" value={data.signature} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>

                {/* 7. Notes & Footer */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                    <FileText size={18} /> Notes & Footer
                  </h3>
                  <div className="space-y-4">
                    <TextArea label="Notes" name="notes" placeholder="e.g. Thank you for your business!" value={data.notes} onChange={handleInputChange} className="min-h-[80px]" />
                    <TextArea label="Terms & Conditions" name="terms" placeholder="e.g. Please pay within 14 days." value={data.terms} onChange={handleInputChange} className="min-h-[100px]" />
                    <Input label="Footer Text" name="footer" placeholder="e.g. Registered in NY, USA. No: 12345" value={data.footer} onChange={handleInputChange} helperText="Appears at the very bottom center of the PDF." />
                  </div>
                </div>

              </div>
            </div>

            {/* --- RIGHT COLUMN: Live Preview --- */}
            <div className="hidden lg:block lg:col-span-6 xl:col-span-7">
              <div className="sticky top-24 space-y-6">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    Live Preview
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700 uppercase">Real-time</span>
                  </h2>
                  <div className="text-sm text-slate-500">
                    A4 Format
                  </div>
                </div>

                {/* The Preview Component */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-200/50 shadow-inner">
                  <div className="h-[800px] w-full overflow-y-auto p-4 custom-scrollbar">
                    <ReceiptPreview data={data} />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    size="xl"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    icon={!isGenerating ? <Download /> : undefined}
                    className="w-full shadow-xl shadow-slate-900/20 transition-transform hover:-translate-y-1"
                  >
                    {isGenerating ? 'Generating PDF...' : 'Download PDF Receipt'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Preview Modal */}
            {showMobilePreview && (
              <div className="fixed inset-0 z-[100] flex flex-col bg-slate-50 lg:hidden">
                <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <h2 className="flex items-center gap-2 font-bold text-slate-900">
                    <Eye size={18} className="text-slate-600" /> Live Preview
                  </h2>
                  <button
                    onClick={() => setShowMobilePreview(false)}
                    className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto bg-slate-200/50 p-4">
                  <div className="mx-auto max-w-[800px] origin-top scale-[0.85] sm:scale-100">
                    <ReceiptPreview data={data} />
                  </div>
                </div>

                <div className="border-t border-slate-200 bg-white p-4">
                  <Button
                    size="xl"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    icon={!isGenerating ? <Download /> : undefined}
                    className="w-full shadow-xl shadow-slate-900/20"
                  >
                    {isGenerating ? 'Generating PDF...' : 'Download PDF Receipt'}
                  </Button>
                </div>
              </div>
            )}

            {/* Mobile Action Bar (Sticky Bottom) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-3 border-t border-slate-200 bg-white/80 p-4 backdrop-blur-md lg:hidden">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowMobilePreview(true)}
                className="flex-1"
                icon={<Eye size={18} />}
              >
                Preview
              </Button>
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 shadow-lg shadow-slate-900/20"
              >
                {isGenerating ? 'Generating...' : 'Download'}
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* --- FAQ Section --- */}
      <section id="faq" className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Frequently Asked Questions</h2>
            <p className="mt-4 text-slate-500">Everything you need to know about our receipt generator.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 transition-all hover:bg-slate-50">
                <h3 className="font-bold text-slate-900 mb-3">{faq.q}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Receipt className="text-white" size={24} />
            <span className="font-bold text-white text-lg">ReceiptGen</span>
          </div>
          <div className="text-sm">
            © {new Date().getFullYear()} ReceiptGen. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;