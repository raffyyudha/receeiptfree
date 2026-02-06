import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReceiptData, CURRENCY_OPTIONS } from '../types';

// --- Type Helpers ---
const getCurrencySymbol = (code: string): string => {
  const c = CURRENCY_OPTIONS.find(opt => opt.value === code);
  return c ? c.symbol : '$';
};

// --- Utils ---
const hexToRgb = (hex: string) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt("0x" + hex[1] + hex[1]);
    g = parseInt("0x" + hex[2] + hex[2]);
    b = parseInt("0x" + hex[3] + hex[3]);
  } else if (hex.length === 7) {
    r = parseInt("0x" + hex[1] + hex[2]);
    g = parseInt("0x" + hex[3] + hex[4]);
    b = parseInt("0x" + hex[5] + hex[6]);
  }
  return [r, g, b];
};

// --- Shared Content Renderers ---
const drawPaymentInfo = (doc: jsPDF, data: ReceiptData, startY: number, margin: number): number => {
  if (!data.bankName && !data.accountNumber) return startY;

  let y = startY + 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(50, 50, 50);
  doc.text("PAYMENT DETAILS", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);

  const details = [
    data.bankName ? `Bank: ${data.bankName}` : null,
    data.accountName ? `Account Name: ${data.accountName}` : null,
    data.accountNumber ? `Account No: ${data.accountNumber}` : null,
    data.swiftCode ? `SWIFT/IBAN: ${data.swiftCode}` : null,
  ].filter(Boolean) as string[];

  details.forEach(line => {
    doc.text(line, margin, y);
    y += 5;
  });

  return y;
};

const drawSignature = (doc: jsPDF, data: ReceiptData, y: number, pageWidth: number, margin: number) => {
  if (!data.signature) return;

  const signatureY = y + 10;
  const rightX = pageWidth - margin - 40;

  // Simulate Signature
  doc.setFont("times", "italic");
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);

  // Draw signature text (if it's an image we'd handle it differently, but for now text)
  // If data.signature starts with data:image, we could try adding it as image
  // But text is safer for basic implementation
  doc.text(data.signature, pageWidth - margin, signatureY, { align: 'right' });

  doc.setDrawColor(200, 200, 200);
  doc.line(pageWidth - margin - 50, signatureY + 2, pageWidth - margin, signatureY + 2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("AUTHORIZED SIGNATURE", pageWidth - margin, signatureY + 7, { align: 'right' });
};


// --- Template Drawers ---

const drawClassic = (doc: jsPDF, data: ReceiptData, currencySymbol: string) => {
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  const themeColor = data.color ? hexToRgb(data.color) : [15, 23, 42];

  // Header
  let currentY = 20;
  if (data.logo) {
    try {
      const imgProps = doc.getImageProperties(data.logo);
      const imgHeight = (imgProps.height * 40) / imgProps.width;
      doc.addImage(data.logo, 'JPEG', margin, currentY, 40, imgHeight);
    } catch (e) { }
  }

  // Title
  doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(data.businessName || "Business Name", margin, currentY + 30); // Below logo

  // Receipt Label Right
  doc.setFontSize(32);
  doc.setTextColor(220, 220, 220);
  doc.text("RECEIPT", pageWidth - margin, 30, { align: "right" });

  // Business Info
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.setFont("helvetica", "normal");
  const bizInfo = [
    data.businessAddress,
    data.businessEmail,
    data.businessPhone,
    data.businessWebsite,
    data.businessTaxId ? `Tax ID: ${data.businessTaxId}` : null
  ].filter(Boolean).join('\n');
  doc.text(bizInfo, margin, currentY + 40);

  // Meta Grid
  const MetaY = 70;
  const gridCols = [
    { label: 'Receipt #', val: data.receiptNumber },
    { label: 'Date', val: data.date },
    { label: 'Due Date', val: data.dueDate },
    { label: 'Status', val: data.status }
  ];

  let metaX = pageWidth - margin - 100;
  gridCols.forEach((col, i) => {
    if (!col.val) return;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(150, 150, 150);
    doc.text(col.label.toUpperCase(), metaX, MetaY + (i * 10));

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(col.val, metaX + 40, MetaY + (i * 10));
  });

  // Bill To
  doc.text("BILL TO", margin, MetaY + 20);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(data.customerName, margin, MetaY + 26);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text([data.customerAddress, data.customerEmail, data.customerPhone].filter(Boolean).join('\n'), margin, MetaY + 32);

  // Table
  const tableBody = data.items.map(item => [
    item.description,
    item.quantity.toString(),
    `${currencySymbol}${item.price.toFixed(2)}`,
    `${currencySymbol}${(item.quantity * item.price).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: MetaY + 50,
    head: [['DESCRIPTION', 'QTY', 'PRICE', 'AMOUNT']],
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [themeColor[0], themeColor[1], themeColor[2]] },
    styles: { fontSize: 9, cellPadding: 4 },
  });

  return (doc as any).lastAutoTable.finalY;
};

const drawModern = (doc: jsPDF, data: ReceiptData, currencySymbol: string) => {
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  const themeColor = data.color ? hexToRgb(data.color) : [59, 130, 246];

  // Colored Header Bar
  doc.setFillColor(themeColor[0], themeColor[1], themeColor[2]);
  doc.rect(0, 0, pageWidth, 15, 'F');

  let currentY = 35;

  // Logo & Business
  if (data.logo) {
    try {
      const imgProps = doc.getImageProperties(data.logo);
      const imgHeight = (imgProps.height * 30) / imgProps.width;
      doc.addImage(data.logo, 'JPEG', margin, currentY, 30, imgHeight);
    } catch (e) { }
  }

  doc.setFontSize(18);
  doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text(data.businessName || "Business Name", margin, currentY + 30);

  // Info Columns
  const topY = currentY;
  const rightX = pageWidth - margin;

  doc.setFontSize(30);
  doc.setTextColor(230, 230, 230);
  doc.text("INVOICE", rightX, topY + 10, { align: 'right' });

  // Meta Details Right aligned
  let metaY = topY + 30;
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`#${data.receiptNumber}`, rightX, metaY, { align: 'right' });
  doc.text(data.date, rightX, metaY + 5, { align: 'right' });

  // Table
  const tableBody = data.items.map(item => [
    item.description,
    item.quantity.toString(),
    `${currencySymbol}${item.price.toFixed(2)}`,
    `${currencySymbol}${(item.quantity * item.price).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 100,
    head: [['ITEM DESCRIPTION', 'QTY', 'PRICE', 'TOTAL']],
    body: tableBody,
    theme: 'striped',
    headStyles: {
      fillColor: [themeColor[0], themeColor[1], themeColor[2]],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      3: { fontStyle: 'bold', halign: 'right' },
      2: { halign: 'right' },
      1: { halign: 'center' }
    }
  });

  return (doc as any).lastAutoTable.finalY;
};

const drawMinimal = (doc: jsPDF, data: ReceiptData, currencySymbol: string) => {
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;

  doc.setFont("courier", "normal");

  let y = 30;

  // Center Header
  doc.setFontSize(16);
  doc.setFont("courier", "bold");
  doc.text(data.businessName || "RECEIPT", pageWidth / 2, y, { align: 'center' });
  y += 7;

  doc.setFontSize(10);
  doc.setFont("courier", "normal");
  doc.text(data.businessAddress || "", pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.text(data.businessEmail || "", pageWidth / 2, y, { align: 'center' });

  y += 15;
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // Meta
  doc.text(`Receipt #: ${data.receiptNumber}`, margin, y);
  doc.text(`Date: ${data.date}`, pageWidth - margin, y, { align: 'right' });
  y += 10;

  // Table
  const tableBody = data.items.map(item => [
    item.description,
    item.quantity.toString(),
    `${currencySymbol}${item.price.toFixed(2)}`,
    `${currencySymbol}${(item.quantity * item.price).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: y,
    head: [['ITEM', 'QTY', 'PRICE', 'TOTAL']],
    body: tableBody,
    theme: 'plain',
    styles: { font: 'courier', fontSize: 10 },
    headStyles: { fontStyle: 'bold', lineWidth: { bottom: 1, top: 0, left: 0, right: 0 }, lineColor: [0, 0, 0] },
  });

  return (doc as any).lastAutoTable.finalY;
};

const drawBold = (doc: jsPDF, data: ReceiptData, currencySymbol: string) => {
  const pageWidth = doc.internal.pageSize.width;
  const themeColor = data.color ? hexToRgb(data.color) : [15, 23, 42];

  // Giant Header Background
  doc.setFillColor(themeColor[0], themeColor[1], themeColor[2]);
  doc.rect(0, 0, pageWidth, 60, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(40);
  doc.setFont("helvetica", "bold");
  doc.text("RECEIPT", 20, 40);

  doc.setFontSize(12);
  doc.text(`#${data.receiptNumber}`, pageWidth - 20, 40, { align: 'right' });

  // Table
  const tableBody = data.items.map(item => [
    item.description,
    item.quantity.toString(),
    `${currencySymbol}${item.price.toFixed(2)}`,
    `${currencySymbol}${(item.quantity * item.price).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 80,
    head: [['DESCRIPTION', 'QTY', 'PRICE', 'AMOUNT']],
    body: tableBody,
    theme: 'plain',
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      lineWidth: { bottom: 2, top: 0, left: 0, right: 0 },
      lineColor: [0, 0, 0]
    },
    styles: { fontSize: 10, cellPadding: 5 }
  });

  return (doc as any).lastAutoTable.finalY;
};

// --- Main Generator ---

export const generatePDF = (data: ReceiptData) => {
  const doc = new jsPDF();
  const currencySymbol = getCurrencySymbol(data.currency);

  let finalY = 0;

  // Dispatch to Template
  switch (data.template) {
    case 'modern':
      finalY = drawModern(doc, data, currencySymbol);
      break;
    case 'minimal':
      finalY = drawMinimal(doc, data, currencySymbol);
      break;
    case 'bold':
      finalY = drawBold(doc, data, currencySymbol);
      break;
    case 'simple':
    case 'elegant': // Fallback to classic styled for now or implement duplicates
      finalY = drawClassic(doc, data, currencySymbol);
      break;
    case 'classic':
    default:
      finalY = drawClassic(doc, data, currencySymbol);
      break;
  }

  // --- Common Totals Calculation ---
  const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const taxAmount = Math.max(subtotal - (data.discount || 0), 0) * (data.taxRate / 100);
  const total = Math.max(subtotal - (data.discount || 0), 0) + taxAmount + (data.shipping || 0);

  // --- Draw Totals (Applies to all templates generally) ---
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let totalsY = finalY + 10;

  const rightX = pageWidth - margin;
  const labelX = rightX - 60;

  doc.setTextColor(0, 0, 0); // Reset black
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const printTotal = (label: string, val: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(label, labelX, totalsY);
    doc.text(val, rightX, totalsY, { align: 'right' });
    totalsY += 6;
  };

  printTotal("Subtotal", `${currencySymbol}${subtotal.toFixed(2)}`);
  if (data.discount) printTotal("Discount", `-${currencySymbol}${data.discount.toFixed(2)}`);
  if (data.taxRate) printTotal(`${data.taxLabel || 'Tax'} (${data.taxRate}%)`, `${currencySymbol}${taxAmount.toFixed(2)}`);
  if (data.shipping) printTotal("Shipping", `${currencySymbol}${data.shipping.toFixed(2)}`);

  totalsY += 2;
  doc.line(labelX, totalsY - 6, rightX, totalsY - 6);
  doc.setFontSize(14);
  printTotal("Total", `${currencySymbol}${total.toFixed(2)}`, true);

  // --- Payment Info & Signature ---
  // We draw this on the left side, usually aligning with totals Y
  drawPaymentInfo(doc, data, finalY + 10, margin);
  drawSignature(doc, data, totalsY + 10, pageWidth, margin);

  // --- Footer / Notes ---
  let footerY = totalsY + 40;
  if (data.notes) {
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("NOTES:", margin, footerY);
    doc.text(data.notes, margin, footerY + 5);
    footerY += 20;
  }

  if (data.terms) {
    doc.text("TERMS & CONDITIONS:", margin, footerY);
    doc.text(data.terms, margin, footerY + 5);
  }

  // Bottom branding
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text(data.footer || "Generated by FreeReceipt.online", pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });

  doc.save(`Receipt-${data.receiptNumber}.pdf`);
};