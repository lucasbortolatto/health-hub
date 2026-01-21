
import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-slate-700 px-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
            error ? 'border-red-500 focus-visible:ring-red-500' : 'hover:border-slate-300',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs font-medium text-red-500 px-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 px-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
