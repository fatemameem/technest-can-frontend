
import React from 'react';
import { cn } from '../lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const Section: React.FC<SectionProps> = ({ children, className, id }) => {
  return (
    <section id={id} className={cn('py-16 sm:py-20', className)}>
      {children}
    </section>
  );
};

export default Section;
