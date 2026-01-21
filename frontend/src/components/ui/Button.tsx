
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:scale-[0.98]',
      secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 active:scale-[0.98]',
      outline: 'border border-slate-300 bg-transparent hover:bg-slate-50 text-slate-700 active:scale-[0.98]',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
      destructive: 'bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
      icon: 'p-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
