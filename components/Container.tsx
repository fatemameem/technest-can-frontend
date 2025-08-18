
import React from 'react';
import { cn } from '../lib/utils.js';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const Container = ({ children, className, ...props }: ContainerProps) => {
    return (
        <div className={cn("container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props}>
            {children}
        </div>
    );
};

export default Container;