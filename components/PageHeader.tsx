
import React from 'react';
import { cn } from '../lib/utils.js';

interface PageHeaderProps {
    title: string;
    subtitle: string;
    className?: string;
    children?: React.ReactNode;
}

const PageHeader = ({ title, subtitle, className, children }: PageHeaderProps) => {
    return (
        <div className={cn("text-center", className)}>
            <h1 className="text-4xl font-extrabold tracking-tight text-dark-text-primary sm:text-5xl lg:text-6xl">
                {title}
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-dark-text-secondary">
                {subtitle}
            </p>
            {children && <div className="mt-6">{children}</div>}
        </div>
    );
};

export default PageHeader;