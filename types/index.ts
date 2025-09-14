// Types for your data structures
export interface Podcast {
  id: string
  title: string
  description: string
  thumbnail: string
  socialLinks: {
    linkedin?: string
    instagram?: string
    facebook?: string
  }
  driveLink: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: string
  title: string
  topic: string
  description: string
  eventDetails: {
    date: string
    time: string
    location: string
  }
  links: {
    lumaLink?: string
    zoomLink?: string
  }
  sponsors: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface EventCardProps {
  event: {
  id: string;
  title: string;
  cover?: string;
  description: string;
  date?: string;
  // time?: string;
  timeStart?: string;
  timeEnd?: string;
  timeZone?: string;
  location?: string;
  topic?: string;
  tags?: string[];
  links?: {
    luma?: string;
    zoom?: string;
  };
  sponsors?: string[];
  };
  type: 'upcoming' | 'past';
}

export interface UIEvent {
  id: string;
  title: string;
  description: string;
  date?: string;
  // time?: string;
  timeStart?: string;
  timeEnd?: string;
  timeZone?: string;
  location?: string;
  topic?: string;
  tags?: string[];
  links?: {
    luma?: string;
    zoom?: string;
  };
  sponsors?: string;
}

export type TeamMember = {
  id: string | number;
  name: string;
  role?: string;
  bio?: string;
  imageUrl?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  email?: string;
  website?: string;
  timestamp?: string;
  [key: string]: any; // allow extra fields from Sheets without breaking
};