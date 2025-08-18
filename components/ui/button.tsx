
import React from 'react';
import { cn } from '../../lib/utils.js';
import { Link, LinkProps } from 'react-router-dom';

const buttonVariants = {
  variant: {
    primary: 'bg-dark-primary text-white hover:bg-blue-500',
    secondary: 'bg-dark-surface text-dark-text-primary hover:bg-slate-700 border border-slate-600',
    destructive: 'bg-dark-danger text-white hover:bg-rose-600',
    ghost: 'hover:bg-dark-surface hover:text-dark-text-primary',
    link: 'text-dark-accent underline-offset-4 hover:underline',
  },
  size: {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  },
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-dark-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export interface ButtonLinkProps extends LinkProps {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
}

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    return (
      <Link
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-dark-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
ButtonLink.displayName = 'ButtonLink';

export { Button, ButtonLink };