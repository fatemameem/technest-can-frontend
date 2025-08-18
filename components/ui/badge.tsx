import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

const badgeVariants = {
  base: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  variant: {
    primary: 'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    secondary: 'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    outline: 'text-slate-700 border-slate-300 dark:text-slate-300 dark:border-slate-700',
  },
};

function Badge({ className, variant = 'primary', ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants.base, badgeVariants.variant[variant], className)}
      {...props}
    />
  );
}

export { Badge };