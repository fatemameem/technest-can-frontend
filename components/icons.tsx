
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const Shield = ({ size = 24, ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

export const Menu = ({ size = 24, ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="4" x2="20" y1="12" y2="12"></line>
    <line x1="4" x2="20" y1="6" y2="6"></line>
    <line x1="4" x2="20" y1="18" y2="18"></line>
  </svg>
);

export const X = ({ size = 24, ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const Linkedin = ({ size = 24, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect width="4" height="12" x="2" y="9"></rect>
        <circle cx="4" cy="4" r="2"></circle>
    </svg>
);

export const Twitter = ({ size = 24, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3 7.1 0 .2 0 .4-.1.6-1.3 3.3-4.5 5.7-8.3 6.3-2 .3-4 .1-5.7-.7s-3-2-4-3.6c-1-1.6-1.5-3.4-1.5-5.2 0-.2.1-.4.1-.6.1-.2.2-.4.3-.5.2-.2.4-.3.6-.4.2-.1.5-.1.7-.1h.3c.3 0 .6.1.8.2.2.1.4.3.6.4.2.2.4.4.5.6.4.6.9 1.1 1.5 1.5.6.4 1.3.7 2 .9.7.2 1.4.3 2.1.2.7-.1 1.3-.3 1.9-.6.6-.3 1.1-.7 1.6-1.2.5-.5.8-1.1 1.1-1.7.3-.6.5-1.3.5-2V8.2c.1-.1.2-.2.3-.3.2-.2.3-.3.4-.5.2-.2.3-.4.4-.6.1-.2.2-.4.2-.6 0-.2-.1-.4-.1-.6s-.1-.3-.2-.5c-.1-.1-.2-.3-.3-.4-.1-.1-.2-.2-.4-.3-.1-.1-.2-.2-.4-.2h-.4c-.1 0-.3 0-.4.1-.1 0-.2.1-.3.1-.1.1-.2.1-.3.2-.1.1-.2.2-.3.3-.1.1-.2.2-.3.3s-.2.2-.3.3c-.1.1-.2.2-.3.3-.1.1-.2.1-.3.1s-.2,0-.3-.1c-.1,0-.2-.1-.3-.1z"></path>
    </svg>
);

export const Github = ({ size = 24, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
);

export const Youtube = ({ size = 24, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10C2.5 6 7.5 4 12 4s9.5 2 9.5 3-2.5 2-2.5 2"></path><path d="M2.5 10a24.12 24.12 0 0 0 0 4c0 1 5 3 9.5 3s9.5-2 9.5-3-2.5-2-2.5-2"></path><path d="M10.1 13.5 14.5 12l-4.4-1.5"></path>
    </svg>
);

export const Spotify = ({ size = 24, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M15.71 12.65c.6.28 1.13.73.98 1.48-.15.75-.82 1.13-1.48.98-.65-.15-1.13-.73-.98-1.48.15-.75.82-1.13 1.48-.98z"></path>
        <path d="M17.43 9.61c.6.28 1.13.73.98 1.48-.15.75-.82 1.13-1.48.98-.65-.15-1.13-.73-.98-1.48.15-.75.82-1.13 1.48-.98z"></path>
        <path d="M8.29 15.35c.15.75.82 1.13 1.48.98.65-.15 1.13-.73.98-1.48s-.82-1.13-1.48-.98c-.65.15-1.13.73-.98 1.48z"></path>
    </svg>
);

export const Apple = ({ size = 24, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
        <path d="M10 2c1 .5 2 1.5 2 2.5S10.5 6 10 6c-.5 0-2-1-2-2.5S9 2.5 10 2Z"></path>
    </svg>
);

export const Calendar = ({ size = 24, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
        <line x1="16" x2="16" y1="2" y2="6"></line>
        <line x1="8" x2="8" y1="2" y2="6"></line>
        <line x1="3" x2="21" y1="10" y2="10"></line>
    </svg>
);

export const MapPin = ({ size = 24, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

export const CheckCircle = ({ size = 24, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);
