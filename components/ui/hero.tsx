// 'use client';
import { ReactNode } from 'react';
// import LetterGlitch from './LetterGlitch';
// import DecryptedText from './DecryptedText';

interface HeroProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  children?: ReactNode;
  className?: string;
}

export function Hero({
  title,
  subtitle,
  imageUrl,
  children,
  className = '',
}: HeroProps) {
  return (
    <section
      className={`relative py-20 lg:py-32 ${className}`}
      style={{
        backgroundImage: imageUrl
          ? `url('${imageUrl}')`
          : undefined,
        backgroundSize: imageUrl ? 'cover' : undefined,
        backgroundPosition: imageUrl ? 'center' : undefined,
        backgroundRepeat: imageUrl ? 'no-repeat' : undefined,
      }}
    >
      {imageUrl && (
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      )}
      {/* <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
          glitchColors={['#2b4539', '#61dca3', '#61b3dc']}
          characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        /> */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="leading-tight text-4xl lg:text-6xl lg:leading-tight font-bold mb-6 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent ">
          {title}
        </h1>
        {subtitle && (
          <p className="font-poppins text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}