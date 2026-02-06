import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";
  
  const variants = {
    // Solid Black - The "Masterpiece" primary action
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 border border-transparent",
    
    // Light Gray - Subtle secondary
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-transparent",
    
    // Outline - Clean borders
    outline: "border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-900 hover:text-slate-900",
    
    // Ghost - Minimalist
    ghost: "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
    
    // Destructive - Error states
    destructive: "bg-red-50 text-red-600 hover:bg-red-100 border border-transparent",
  };

  const sizes = {
    sm: "h-9 px-4 text-xs",
    md: "h-11 px-6 text-sm",
    lg: "h-14 px-8 text-base",
    xl: "h-16 px-10 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className={`${size === 'xl' ? 'mr-3 h-6 w-6' : 'mr-2 h-4 w-4'}`}>{icon}</span>}
      {children}
    </button>
  );
};