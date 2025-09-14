import { Hero } from '@/components/ui/hero';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/cards/StatCard';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { EventCallout } from '@/components/events/EventCallout';
import Link from 'next/link';
import sampleData from '@/data/sample.json';
import { ArrowRight, ExternalLink, } from 'lucide-react';
import PodcastsSection from '@/components/sections/PodcastSection';
import configPromise from '@payload-config'
import { getPayload } from 'payload'
// import type { Metadata } from 'next'

export const dynamic = 'force-dynamic';

// export const metadata: Metadata = {
//   title: 'Securing Digital Futures | STEM Canada',
//   description:
//     'Cybersecurity consultancy and AI ethics organization building safer, more ethical technology for everyone. Explore services, events, and podcasts.',
//   openGraph: {
//     title: 'Securing Digital Futures | STEM Canada',
//     description:
//       'Cybersecurity consultancy and AI ethics organization building safer, more ethical technology for everyone.',
//     url: '/',
//     type: 'website',
//     images: [{ url: '/images/home.webp' }],
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'Securing Digital Futures | STEM Canada',
//     description:
//       'Cybersecurity consultancy and AI ethics organization building safer, more ethical technology for everyone.',
//     images: ['/images/home.webp'],
//   },
// };

function toDateObj(date?: string, time?: string): Date | null {
  if (!date) return null;
  try {
    const iso = time ? `${date}T${time}` : date;
    const d = new Date(iso);
    if (!isNaN(d.getTime())) return d;
    const alt = time ? `${date} ${time}` : date;
    const d2 = new Date(alt);
    return isNaN(d2.getTime()) ? null : d2;
  } catch {
    return null;
  }
}

export default async function Home() {
  const payload = await getPayload({ config: configPromise });

  // Server-side fetch via Payload Node API (no public REST exposure)
  const [eventsRes, podcastsRes] = await Promise.all([
    payload.find({
      collection: 'events',
      where: { published: { equals: true } },
      sort: 'eventDetails.date',
      limit: 3,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'podcasts',
      where: { published: { equals: true } },
      sort: '-createdAt',
      limit: 5,
      overrideAccess: true,
    }),
  ]);
  const rawEvents = eventsRes?.docs ?? [];
  // console.log("Fetched events:", rawEvents);
  const rawPodcasts = podcastsRes?.docs ?? [];

  // Map into the shape PodcastCard expects
  const mappedPodcasts = (rawPodcasts || []).map((r: any) => ({
    id: r.id,
    title: r.title ?? "Untitled Podcast",
    // Use createdAt as a date surrogate if no explicit date field exists
    date: r.createdAt ?? "",
    linkedin: r.socialLinks?.linkedin ?? "",
    instagram: r.socialLinks?.instagram ?? "",
    facebook: r.socialLinks?.facebook ?? "",
    // Prefer internal slug route; fallback to listing
    path: r.slug ? `/podcasts/podcast/${r.slug}` : "/podcasts",
  }));

  // Keep only the latest 3 podcasts, sorted descending by date
  const podcasts = mappedPodcasts
    .sort((a, b) => {
      const da = toDateObj(a.date)?.getTime() ?? 0;
      const db = toDateObj(b.date)?.getTime() ?? 0;
      return db - da;
    })
    .slice(0, 5);

  // Map into the shape EventCallout expects and build tags
  const mappedEvents = (rawEvents || []).map((r: any) => ({
    id: r.id,
    title: r.title ?? "Untitled Event",
    // Keep the original date for display formatting
    date: r.eventDetails?.date
      ? new Date(r.eventDetails.date).toISOString().split('T')[0]
      : "",
    // Store the original ISO date for comparison
    rawDate: r.eventDetails?.date,
    // time: r.eventDetails?.time ?? "",
    timeStart: r.eventDetails?.timeStart ?? "",
    timeEnd: r.eventDetails?.timeEnd ?? "",
    timeZone: r.eventDetails?.timeZone ?? "",
    location: r.eventDetails?.location ?? "",
    description: r.description ?? "",
    links: { luma: r.links?.lumaLink ?? "", zoom: r.links?.zoomLink ?? "" },
    tags: [r.topic, r.eventDetails?.location].filter(Boolean) as string[],
  }));

  // Keep only events from now forward, sorted ascending by date/time
  const now = new Date();
  const upcomingEvents = mappedEvents
    .filter((e) => {
      // Use the original date directly if available
      if (e.rawDate) {
        return new Date(e.rawDate).getTime() >= now.getTime();
      }
      // Fall back to the parsed date+time if needed
      const d = toDateObj(e.date, e.timeStart);
      return d ? d.getTime() >= now.getTime() : false;
    })
    .sort((a, b) => {
      const da = toDateObj(a.date, a.timeStart)?.getTime() ?? Number.POSITIVE_INFINITY;
      const db = toDateObj(b.date, b.timeStart)?.getTime() ?? Number.POSITIVE_INFINITY;
      return da - db;
    });

    // console.log("upcomingEvents:", upcomingEvents); 

  return (
    <>
      {/* Hero Section */}
      <Hero
        title="Securing Digital Futures"
        subtitle="Leading cybersecurity consultancy and AI ethics organization dedicated to building safer, more ethical technology for everyone."
        imageUrl='./images/home.webp'
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="btn-primary text-white px-8 py-3 text-lg">
            <Link href="/services">
              Explore Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="btn-secondary text-slate-300 px-8 py-3 text-lg ">
            <Link href="/events">
              Upcoming Events
              <ExternalLink className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </Hero>

      {/* Impact Stats */}
      <Section className="hidden bg-slate-900/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleData.stats.map((stat, index) => (
            <StatCard
              key={index}
              number={stat.number}
              label={stat.label}
              description={stat.description}
            />
          ))}
        </div>
      </Section>

      {/* Featured Services */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Comprehensive cybersecurity solutions and AI ethics guidance for organizations of all sizes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleData.services.map((service) => (
            <ServiceCard
              key={service.id}
              service={{
                ...service,
                icon: service.icon as "shield-check" | "file-text" | "mail" | "graduation-cap"
              }}
            />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild className="btn-primary">
            <Link href="/services">View All Services</Link>
          </Button>
        </div>
      </Section>

      {/* Podcasts Section */}
      <Section className="">
      {podcasts.length === 0 && (
        <div className="text-center text-slate-400">No podcasts available.</div>
      )}
      {podcasts.length > 0 && (
        <PodcastsSection
          podcasts={podcasts}
          title="Latest Podcast Episodes"
          badge="Listen Now"
          description="Tune in for discussions on the latest in cybersecurity and AI ethics."
          showAllBtn={true}
        />
      )}
      </Section>

      {/* Upcoming Event Callout */}
      <Section>
        <div className="max-w-5xl mx-auto">
          {upcomingEvents.length === 0 ? (
            <div className="text-center text-slate-400">No upcoming events.</div>
          ) : (
            <div className="space-y-6">
              {upcomingEvents.map((evt) => (
                <EventCallout key={evt.id} event={evt} />
              ))}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
