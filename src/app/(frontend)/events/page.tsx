// import type { Metadata } from 'next'
import { Hero } from '@/components/ui/hero';
import { Section } from '@/components/ui/section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCard } from '@/components/cards/EventCard';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
// import { API_BASE } from '@/lib/env';
import { UIEvent } from '@/types';

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

export const dynamic = 'force-dynamic';
// export const runtime = 'nodejs';

// export const metadata: Metadata = {
//   title: 'Events | TECH-NEST',
//   description: 'Workshops, conferences, and training sessions on cybersecurity and AI ethics.',
// };

export default async function Events() {
  const payload = await getPayload({ config: configPromise });
  const res = await payload.find({
    collection: 'events',
    where: { published: { equals: true } },
    sort: 'eventDetails.date',
    limit: 200,
    overrideAccess: true,
  });

  const rows = res.docs || [];

  const mapped: UIEvent[] = rows.map((r: any) => {
    const dateStr = r.eventDetails?.date
      ? new Date(r.eventDetails.date).toISOString().split('T')[0]
      : '';
    const tags = [r.topic, r.eventDetails?.location].filter(Boolean) as string[];
    return {
      id: r.id,
      title: r.title ?? 'Untitled Event',
      description: r.description ?? '',
      date: dateStr,
      time: r.eventDetails?.time ?? '',
      location: r.eventDetails?.location ?? '',
      topic: r.topic ?? '',
      links: { luma: r.links?.lumaLink ?? '', zoom: r.links?.zoomLink ?? '' },
      sponsors: r.sponsors ?? '',
      tags,
    };
  });

  const now = new Date();
  const upcoming = mapped
    .filter((e) => {
      const d = toDateObj(e.date, e.timeStart);
      return d ? d.getTime() >= now.getTime() : true;
    })
    .sort((a, b) => {
      const da = toDateObj(a.date, a.timeStart)?.getTime() ?? Number.POSITIVE_INFINITY;
      const db = toDateObj(b.date, b.timeStart)?.getTime() ?? Number.POSITIVE_INFINITY;
      return da - db;
    });

  const past = mapped
    .filter((e) => {
      const d = toDateObj(e.date, e.timeEnd || e.timeStart);
      return d ? d.getTime() < now.getTime() : false;
    })
    .sort((a, b) => {
      const da = toDateObj(a.date, a.timeEnd || a.timeStart)?.getTime() ?? 0;
      const db = toDateObj(b.date, b.timeEnd || b.timeStart)?.getTime() ?? 0;
      return db - da;
    });

  return (
    <>
      <Hero
        title="Events"
        subtitle="Join us for workshops, conferences, and training sessions focused on cybersecurity and AI ethics."
        imageUrl='/images/events.jpg'
      />

      <Section>
        <Tabs defaultValue="upcoming" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 surface">
            <TabsTrigger value="upcoming" className="focus-ring">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past" className="focus-ring">Past Events</TabsTrigger>
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
