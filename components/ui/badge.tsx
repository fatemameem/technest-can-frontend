
import React from 'react';
import { cn } from '../../lib/utils.js';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

function Badge({ className, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-dark-accent/50 bg-dark-accent/10 px-2.5 py-0.5 text-xs font-semibold text-dark-accent transition-colors focus:outline-none focus:ring-2 focus:ring-dark-accent focus:ring-offset-2',
        className
      )}
      {...props}
    />
  );
}

export { Badge };