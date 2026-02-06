import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ label, helperText, className = '', ...props }) => {
  return (
    <div className="group flex flex-col gap-2">
      {label && (
        <label className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`flex h-12 w-full rounded-lg border-2 border-slate-100 bg-slate-50/50 px-4 text-[15px] font-medium text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:bg-slate-50 transition-all duration-200 ease-in-out ${className}`}
          {...props}
        />
      </div>
      {helperText && <p className="text-xs text-slate-400">{helperText}</p>}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="group flex flex-col gap-2">
      {label && (
        <label className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </label>
      )}
      <textarea
        className={`flex min-h-[120px] w-full rounded-lg border-2 border-slate-100 bg-slate-50/50 p-4 text-[15px] font-medium text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:bg-slate-50 transition-all duration-200 ease-in-out resize-none ${className}`}
        {...props}
      />
    </div>
  );
};