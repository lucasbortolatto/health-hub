import React from 'react';
import { cn } from '@/lib/utils';

// Fixed: Explicitly extending HTMLAttributes and ensuring className/children are recognized
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

// Fixed: Using React.FC to ensure React reserved props like 'key' and standard attributes are handled correctly
const Card: React.FC<CardProps> = ({ className, padding = 'md', children, ...props }) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-100 bg-white shadow-sm transition-all',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
