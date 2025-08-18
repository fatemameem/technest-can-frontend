
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  };
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(dateString));
}

export function getUpcomingEvents(events: any[]): any[] {
    const now = new Date();
    return events
        .filter(event => new Date(event.start) >= now)
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

export function getPastEvents(events: any[]): any[] {
    const now = new Date();
    return events
        .filter(event => new Date(event.start) < now)
        .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
}
