'use client';

import { useEffect, useState } from 'react';
import { Hero } from '@/components/ui/hero';
import { Section } from '@/components/ui/section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCard } from '@/components/cards/EventCard';
import { API_BASE } from '@/lib/env';

// Mock past event for testing
const MOCK_PAST_EVENT: UIEvent = {
  id: 'mock-past-1',
  title: 'Empowering Communities: From Campus to Market, Building Digital Confidence Together',
  description: 'A collaborative event focused on digital literacy and cybersecurity awareness in diverse community settings.',
  date: 'July, 2025',
  location: 'Concordia University, St. Jacques Church, Khadija Islamic Center',
  topic: 'Cybersecurity & AI Ethics',
  tags: ['AI Ethics', 'Cybersecurity', 'Community'],
  links: {
    url: 'outreach-program' // Link to the detailed recap page
  },
  sponsors: 'Tech-Nest',
  thumbnailUrl:'/images/outreach.png'
};
const MOCK_PAST_EVENT_2: UIEvent = {
  id: 'mock-past-2',
  title: 'TECH-NEST at FINDAC (Concordia) - Online Safety and AI Awareness',
  description: 'A session on online safety, AI literacy, and digital ethics with FINDAC - The Financial Data Science Club at Concordia (SGW Campus).',
  date: 'October, 2025',
  location: 'Concordia University, SGW Campus',
  topic: 'Cybersecurity & AI Ethics',
  tags: ['#CyberSafety','#AIAwareness','#TechForGood','#DigitalEthics','#Montreal','#CommunityEngagement'],
  links: {
    url: 'findac-x-technest' // Link to the detailed recap page
  },
  sponsors: 'Tech-Nest',
  thumbnailUrl:'/images/technest-findac-2025-10-31.jpeg'
};
const MOCK_PAST_EVENT_3: UIEvent = {
  id: 'mock-past-3',
  title: 'Proud to Be Part of Forces AVENIR 2025: Celebrating Student Leadership and Community Impact',
  description: "TECH-NEST's Journey in Student Leadership",
  date: 'October, 2025',
  location: 'Quebec City, QC',
  topic: 'Tech-Nest and Student Leadership',
  tags: ['#ForcesAVENIR','#StudentLeadership','#ConcordiaUniversity','#Innovation','#Networking','#TechNest','#Growth','#Gratitude'],
  links: {
    url: 'technest-at-forces-avenir' // Link to the detailed recap page
  },
  sponsors: 'Tech-Nest',
  thumbnailUrl:'/images/forces-avenir-1.jpeg'
};

interface SheetEvent {
  id: string;
  timestamp?: string;
  title?: string;
  topic?: string;
  description?: string;
  date?: string;     // e.g., "2025-09-15" or sheet-formatted date
  time?: string;     // e.g., "14:00"
  location?: string;
  lumaLink?: string;
  zoomLink?: string;
  url?: string; // For past events, link to recap page
  sponsors?: string;
  thumbnailUrl?: string; // Add this line
}

interface UIEvent {
  id: string;
  title: string;
  description: string;
  date?: string;
  time?: string;
  location?: string;
  topic?: string;
  tags?: string[];
  links?: {
    luma?: string;
    zoom?: string;
    url?: string; // For past events, link to recap page
  };
  sponsors?: string;
  thumbnailUrl?: string;
}

function toDateObj(date?: string, time?: string): Date | null {
  if (!date) return null;
  try {
    // Try ISO first
    const isoCandidate = time ? `${date}T${time}` : date;
    const d = new Date(isoCandidate);
    if (!isNaN(d.getTime())) return d;
    // Fallback: let Date parse common sheet formats (e.g., "8/30/2025 14:00")
    const alt = time ? `${date} ${time}` : date;
    const d2 = new Date(alt);
    return isNaN(d2.getTime()) ? null : d2;
  } catch {
    return null;
  }
}

export default function Events() {
  const [upcoming, setUpcoming] = useState<UIEvent[] | null>(null);
  const [past, setPast] = useState<UIEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`api/sheets/eventsInfo`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load events (${res.status})`);
        const rows: SheetEvent[] = await res.json();

        const mapped: UIEvent[] = rows.map((r) => {
          const tags = [r.topic, r.location].filter(Boolean) as string[];
          return {
            id: r.id ?? `${r.timestamp ?? Math.random()}`,
            title: r.title ?? "Untitled Event",
            description: r.description ?? "",
            date: r.date,
            time: r.time,
            location: r.location,
            topic: r.topic,
            links: { luma: r.lumaLink, zoom: r.zoomLink },
            sponsors: r.sponsors,
            tags, // ensure EventCard receives an array
            thumbnailUrl: r.thumbnailUrl || '/images/events.jpg', // Add thumbnailUrl with fallback
          };
        });

        const now = new Date();
        const upcomingEvents = mapped
          .filter((e) => {
            const d = toDateObj(e.date, e.time);
            return d ? d.getTime() >= now.getTime() : true; // if no date, treat as upcoming
          })
          .sort((a, b) => {
            const da = toDateObj(a.date, a.time)?.getTime() ?? Number.POSITIVE_INFINITY;
            const db = toDateObj(b.date, b.time)?.getTime() ?? Number.POSITIVE_INFINITY;
            return da - db;
          });

        const pastEvents = [
          MOCK_PAST_EVENT,
          MOCK_PAST_EVENT_2,
          MOCK_PAST_EVENT_3,
          ...mapped
            .filter((e) => {
              const d = toDateObj(e.date, e.time);
              return d ? d.getTime() < now.getTime() : false;
            })
        ].sort((a, b) => {
          const da = toDateObj(a.date, a.time)?.getTime() ?? 0;
          const db = toDateObj(b.date, b.time)?.getTime() ?? 0;
          return db - da;
        });

        if (alive) {
          setUpcoming(upcomingEvents);
          setPast(pastEvents);
        }
      } catch (err: any) {
        if (alive) setError(err?.message || "Failed to load events");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  const defaultTab = (upcoming && upcoming.length > 0) ? "upcoming" : "past";

  return (
    <>
      <Hero
        title="Events"
        subtitle="Join us for workshops, conferences, and training sessions focused on cybersecurity and AI ethics."
        imageUrl='/images/events.jpg'
      />

      <Section>
        <Tabs defaultValue={defaultTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 surface">
            <TabsTrigger value="upcoming" className="focus-ring">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past" className="focus-ring">Past Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-8">
            {error && <div className="text-red-600">Error: {error}</div>}
            {!upcoming && !error && <div>Loading events…</div>}
            {upcoming && upcoming.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                No upcoming events at the moment. Check back soon!
              </div>
            )}
            {upcoming && upcoming.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcoming.map((event) => (
                  <EventCard key={event.id} event={event as any} type="upcoming" />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="mt-8">
            {error && <div className="text-red-600">Error: {error}</div>}
            {!past && !error && <div>Loading events…</div>}
            {past && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {past.map((event) => (
                  <EventCard key={event.id} event={event as any} type="past" />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Section>
    </>
  );
}

// export const dynamic = "force-dynamic";