import { ReactNode } from 'react';

interface HeroProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

export function Hero({ title, subtitle, children, className = '' }: HeroProps) {
  return (
    <section className={`py-20 lg:py-32 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}