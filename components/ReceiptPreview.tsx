import React from 'react';
import { ReceiptData } from '../types';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { BoldTemplate } from './templates/BoldTemplate';
import { SimpleTemplate } from './templates/SimpleTemplate';
import { ElegantTemplate } from './templates/ElegantTemplate';

interface ReceiptPreviewProps {
  data: ReceiptData;
}

export const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ data }) => {
  const renderTemplate = () => {
    switch (data.template) {
      case 'modern':
        return <ModernTemplate data={data} />;
      case 'minimal':
        return <MinimalTemplate data={data} />;
      case 'bold':
        return <BoldTemplate data={data} />;
      case 'simple':
        return <SimpleTemplate data={data} />;
      case 'elegant':
        return <ElegantTemplate data={data} />;
      case 'classic':
      default:
        return <ClassicTemplate data={data} />;
    }
  };

  return (
    <div className="h-full w-full rounded bg-gray-200/50 p-4 lg:p-8 overflow-y-auto">
      {renderTemplate()}
    </div>
  );
};