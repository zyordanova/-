import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-bold rounded-2xl transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg fun-font";
  
  const variants = {
    primary: "bg-indigo-500 hover:bg-indigo-600 text-white border-b-4 border-indigo-700 focus:ring-indigo-300",
    secondary: "bg-amber-400 hover:bg-amber-500 text-amber-900 border-b-4 border-amber-600 focus:ring-amber-200",
    success: "bg-emerald-500 hover:bg-emerald-600 text-white border-b-4 border-emerald-700 focus:ring-emerald-300",
    danger: "bg-rose-500 hover:bg-rose-600 text-white border-b-4 border-rose-700 focus:ring-rose-300",
    outline: "bg-white text-gray-600 border-2 border-gray-300 hover:bg-gray-50",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-xl",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};