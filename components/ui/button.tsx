import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  as?: React.ElementType;
  to?: LinkProps['to'];
}

const buttonVariants = {
  base: 'inline-flex items-center justify-center rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-950 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
  size: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  },
  variant: {
    primary: 'bg-blue-700 text-slate-50 hover:bg-blue-800 focus:ring-blue-500 shadow-md dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-600',
    secondary: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500 shadow-md dark:bg-amber-500 dark:hover:bg-amber-600 dark:focus:ring-amber-500',
    outline: 'border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-blue-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
  },
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', as: Comp = 'button', to, ...props }, ref) => {
    const classes = cn(
      buttonVariants.base,
      buttonVariants.size[size],
      buttonVariants.variant[variant],
      className
    );

    if (Comp === 'a' || (Comp === Link && to)) {
      return <Link to={to as LinkProps['to']} className={classes} {...(props as any)} />;
    }
    
    return <Comp className={classes} ref={ref} {...props} />;
  }
);

Button.displayName = 'Button';

export { Button };