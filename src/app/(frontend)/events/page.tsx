// import type { Metadata } from 'next'
import { Hero } from '@/components/ui/hero';
import { Section } from '@/components/ui/section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCard } from '@/components/cards/EventCard';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { UIEvent } from '@/types';

function toDateObj(date?: string, time?: string): Date | null {
  if (!date) return null;
  try {
    if (time) {
      return new Date(`${date}T${time}`);
    }
    return new Date(date);
  } catch {
    return null;
  }
}

export const dynamic = 'force-dynamic';

export default async function Events() {
  const payload = await getPayload({ config: configPromise });

  // Server-side fetch via Payload Node API (no public REST exposure)
  const eventsRes = await payload.find({
    collection: 'events',
    where: { published: { equals: true } },
    sort: 'eventDetails.date',
    overrideAccess: true,
  });

  const rawEvents = eventsRes?.docs ?? [];

  // Map Payload events to UIEvent structure
  const mappedEvents: UIEvent[] = rawEvents.map((event: any) => ({
    id: event.id,
    title: event.title ?? "Untitled Event",
    description: event.description ?? "No description available.",
    date: event.eventDetails?.date 
      ? new Date(event.eventDetails.date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      : undefined,
    timeStart: event.eventDetails?.timeStart,
    timeEnd: event.eventDetails?.timeEnd,
    timeZone: event.eventDetails?.timeZone,
    location: event.eventDetails?.location,
    topic: event.topic,
    tags: event.topic ? [event.topic] : [],
    links: {
      luma: event.links?.lumaLink,
      zoom: event.links?.zoomLink,
      recapUrl: event.links?.recapUrl, // Map the recapUrl from Payload
    },
    sponsors: event.sponsors,
  }));

  // Separate upcoming and past events
  const now = new Date();
  const upcoming = mappedEvents.filter(event => {
    if (!event.date) return false;
    const eventDate = new Date(event.date);
    return eventDate >= now;
  });

  const past = mappedEvents.filter(event => {
    if (!event.date) return true; // Events without dates go to past
    const eventDate = new Date(event.date);
    return eventDate < now;
  });

  return (
    <>
      <Hero
        title="Events"
        subtitle="Workshops, conferences, and training sessions on cybersecurity and AI ethics."
      />
      
      <Section>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming Events ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="past">Past Events ({past.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event as any} type="upcoming" />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="past" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {past.map((event) => (
                <EventCard key={event.id} event={event as any} type="past" />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Section>
    </>
  );
}

// Keep SSR dynamic to reflect live updates from Payload
