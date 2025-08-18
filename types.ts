
export type EventTag = "workshop" | "webinar" | "panel" | "community";

export interface Speaker {
  name: string;
  title?: string;
  avatarUrl?: string;
  org?: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  start: string; // ISO
  end?: string; // ISO
  location: { type: "virtual" | "in-person"; details: string; link?: string };
  tags: EventTag[];
  coverImage?: string;
  agenda?: { time: string; item: string }[];
  speakers?: Speaker[];
  resources?: { label: string; url: string }[];
}

export interface PodcastEpisode {
  id: string;
  title: string;
  date: string; // ISO
  platforms: { name: "YouTube" | "Spotify" | "Apple" | "SoundCloud"; url: string }[];
  embedUrl?: string;
  summary?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl?: string;
  socials?: { platform: "linkedin" | "twitter" | "github"; url: string }[];
}

export interface Registration {
  id: string;
  eventId: string;
  fullName: string;
  email: string;
  affiliation?: string;
  consent: boolean;
  registeredAt: string; // ISO
}
