export interface ReceiptItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface ReceiptData {
  // Business Info
  logo?: string; // Base64 string
  businessName: string;
  businessAddress: string;
  businessEmail: string;
  businessWebsite: string;
  businessPhone: string;
  businessTaxId: string; // NEW: VAT/Tax ID

  // Transaction Info
  receiptNumber: string;
  date: string;
  dueDate?: string;
  paymentMethod: string;
  currency: string;

  // Customer Info
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerTaxId: string; // NEW: Customer VAT/Tax ID

  // Financials
  items: ReceiptItem[];
  taxRate: number;
  discount: number; // Fixed amount
  shipping: number; // Fixed amount

  // Meta
  notes: string;
  footer: string; // NEW: Bottom footer text

  // New "Complete" Fields
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  swiftCode?: string;

  signature?: string; // Text name or base64 image
  status?: 'PAID' | 'PENDING' | 'UNPAID' | 'DRAFT';

  // Customization
  template: 'classic' | 'modern' | 'minimal' | 'bold' | 'simple' | 'elegant';
  color?: string; // Hex code for primary color

  // Extra Details
  customerPhone?: string;
  customerWebsite?: string;
  taxLabel?: string; // e.g. "VAT", "GST", "Tax"
  terms?: string; // Terms & Conditions text
}

export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD - US Dollar ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR - Euro (€)', symbol: '€' },
  { value: 'GBP', label: 'GBP - British Pound (£)', symbol: '£' },
  { value: 'CAD', label: 'CAD - Canadian Dollar ($)', symbol: '$' },
  { value: 'AUD', label: 'AUD - Australian Dollar ($)', symbol: '$' },
  { value: 'JPY', label: 'JPY - Japanese Yen (¥)', symbol: '¥' },
  { value: 'CNY', label: 'CNY - Chinese Yuan (¥)', symbol: '¥' },
  { value: 'INR', label: 'INR - Indian Rupee (₹)', symbol: '₹' },
  { value: 'IDR', label: 'IDR - Indonesian Rupiah (Rp)', symbol: 'Rp' },
  { value: 'SGD', label: 'SGD - Singapore Dollar ($)', symbol: '$' },
  { value: 'MYR', label: 'MYR - Malaysian Ringgit (RM)', symbol: 'RM' },
  { value: 'PHP', label: 'PHP - Philippine Peso (₱)', symbol: '₱' },
  { value: 'THB', label: 'THB - Thai Baht (฿)', symbol: '฿' },
  { value: 'VND', label: 'VND - Vietnamese Dong (₫)', symbol: '₫' },
  { value: 'KRW', label: 'KRW - South Korean Won (₩)', symbol: '₩' },
  { value: 'HKD', label: 'HKD - Hong Kong Dollar ($)', symbol: '$' },
  { value: 'TWD', label: 'TWD - New Taiwan Dollar (NT$)', symbol: 'NT$' },
  { value: 'NZD', label: 'NZD - New Zealand Dollar ($)', symbol: '$' },
  { value: 'MXN', label: 'MXN - Mexican Peso ($)', symbol: '$' },
  { value: 'BRL', label: 'BRL - Brazilian Real (R$)', symbol: 'R$' },
  { value: 'ARS', label: 'ARS - Argentine Peso ($)', symbol: '$' },
  { value: 'CLP', label: 'CLP - Chilean Peso ($)', symbol: '$' },
  { value: 'COP', label: 'COP - Colombian Peso ($)', symbol: '$' },
  { value: 'PEN', label: 'PEN - Peruvian Sol (S/.)', symbol: 'S/.' },
  { value: 'ZAR', label: 'ZAR - South African Rand (R)', symbol: 'R' },
  { value: 'NGN', label: 'NGN - Nigerian Naira (₦)', symbol: '₦' },
  { value: 'KES', label: 'KES - Kenyan Shilling (KSh)', symbol: 'KSh' },
  { value: 'EGP', label: 'EGP - Egyptian Pound (E£)', symbol: 'E£' },
  { value: 'SAR', label: 'SAR - Saudi Riyal (﷼)', symbol: '﷼' },
  { value: 'AED', label: 'AED - UAE Dirham (د.إ)', symbol: 'د.إ' },
  { value: 'ILS', label: 'ILS - Israeli New Shekel (₪)', symbol: '₪' },
  { value: 'TRY', label: 'TRY - Turkish Lira (₺)', symbol: '₺' },
  { value: 'RUB', label: 'RUB - Russian Ruble (₽)', symbol: '₽' },
  { value: 'CHF', label: 'CHF - Swiss Franc (Fr)', symbol: 'Fr' },
  { value: 'SEK', label: 'SEK - Swedish Krona (kr)', symbol: 'kr' },
  { value: 'NOK', label: 'NOK - Norwegian Krone (kr)', symbol: 'kr' },
  { value: 'DKK', label: 'DKK - Danish Krone (kr)', symbol: 'kr' },
  { value: 'PLN', label: 'PLN - Polish Zloty (zł)', symbol: 'zł' },
  { value: 'HUF', label: 'HUF - Hungarian Forint (Ft)', symbol: 'Ft' },
  { value: 'CZK', label: 'CZK - Czech Koruna (Kč)', symbol: 'Kč' },
];