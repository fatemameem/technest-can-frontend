
import React from 'react';
import { cn } from '../lib/utils.js';

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const Section = ({ children, className, ...props }: SectionProps) => {
    return (
        <section className={cn("py-16 sm:py-20", className)} {...props}>
            {children}
        </section>
    );
};

export default Section;