
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = ({ className, padding = 'md', children, ...props }: CardProps) => {
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
