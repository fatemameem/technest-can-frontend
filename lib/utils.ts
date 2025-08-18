
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { EventItem } from '../types.js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(dateString));
}

export function formatDateRange(start: string, end?: string): string {
    const startDate = new Date(start);
    const options: Intl.DateTimeFormatOptions = {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    };

    if (!end) {
        return startDate.toLocaleDateString('en-US', options);
    }

    const endDate = new Date(end);
    if (startDate.toDateString() === endDate.toDateString()) {
        return startDate.toLocaleDateString('en-US', options);
    }

    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
}

export function getUpcomingEvents(events: EventItem[]): EventItem[] {
  const now = new Date();
  return events
    .filter(event => new Date(event.start) >= now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

export function getPastEvents(events: EventItem[]): EventItem[] {
  const now = new Date();
  return events
    .filter(event => new Date(event.start) < now)
    .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
}

export function slugify(text: string): string {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}

export function downloadCSV(data: any[], filename: string) {
    if (data.length === 0) {
        alert("No data to export.");
        return;
    }
    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','), 
        ...data.map(row => 
            headers.map(fieldName => 
                JSON.stringify(row[fieldName], (key, value) => value === null ? '' : value)
            ).join(',')
        )
    ];

    const csvString = csvRows.join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}