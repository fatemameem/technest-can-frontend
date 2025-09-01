'use client';
import { Hero } from '@/components/ui/hero';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/cards/StatCard';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { EventCallout } from '@/components/events/EventCallout';
import Link from 'next/link';
import sampleData from '@/data/sample.json';
import { ArrowRight, Play, ExternalLink, Podcast } from 'lucide-react';
import PodcastsSection from '@/components/sections/PodcastSection';
// import { getEvents } from '@/lib/data';
// import { getPodcasts } from '@/lib/data';
import { useEffect, useState } from 'react';
// // export const dynamic = "force-dynamic";

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

export default function Home() {
  // Fetch events from Sheets (server-side, cached)
  // const rawEvents: any[] = await getEvents();
  // const rawPodcasts: any[] = await getPodcasts();

  const [rawEvents, setRawEvents] = useState<any[] | null>(null);
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch('/api/sheets/eventsInfo');
      if (res.ok) {
        const data = await res.json();
        setRawEvents(data);
      }
    };
    fetchEvents();
  }, []);

  const [rawPodcasts, setRawPodcasts] = useState<any[] | null>(null);
  useEffect(() => {
    const fetchPodcasts = async () => {
      const res = await fetch('/api/sheets/podcastInfo'); // <-- Fix endpoint!
      if (res.ok) {
        const data = await res.json();
        setRawPodcasts(data);
      }
    };
    fetchPodcasts();
  }, []);

  // Map into the shape PodcastCard expects
  const mappedPodcasts = (rawPodcasts || []).map((r: any) => ({
    id: r.id,
    title: r.title ?? "Untitled Podcast",
    date: r.timestamp ?? "",
    linkedin: r.linkedin ?? "",
    instagram: r.instagram ?? "",
    facebook: r.facebook ?? "",
    path: r.path ?? "",
  }));
  // console.log("Mapped podcasts:", mappedPodcasts);

  // Keep only the latest 3 podcasts, sorted descending by date
  const podcasts = mappedPodcasts
    .sort((a, b) => {
      const da = toDateObj(a.date)?.getTime() ?? 0;
      const db = toDateObj(b.date)?.getTime() ?? 0;
      return db - da;
    })
    .slice(0, 5);

    // console.log("Latest podcasts:", podcasts);

  // Map into the shape EventCallout expects and build tags
  const mappedEvents = (rawEvents || []).map((r: any) => ({
    id: r.id,
    title: r.title ?? "Untitled Event",
    date: r.date ?? "",
    time: r.time ?? "",
    location: r.location ?? "",
    description: r.description ?? "",
    links: { luma: r.lumaLink ?? "", zoom: r.zoomLink ?? "" },
    tags: [r.topic, r.location].filter(Boolean) as string[],
  }));

  // Keep only events from now forward, sorted ascending by date/time
  const now = new Date();
  const upcomingEvents = mappedEvents
    .filter((e) => {
      const d = toDateObj(e.date, e.time);
      return d ? d.getTime() >= now.getTime() : false;
    })
    .sort((a, b) => {
      const da = toDateObj(a.date, a.time)?.getTime() ?? Number.POSITIVE_INFINITY;
      const db = toDateObj(b.date, b.time)?.getTime() ?? Number.POSITIVE_INFINITY;
      return da - db;
    });

  return (
    <>
      {/* Hero Section */}
      <Hero
        title="Securing Digital Futures"
        subtitle="Leading cybersecurity consultancy and AI ethics organization dedicated to building safer, more ethical technology for everyone."
        imageUrl='./images/home.webp'
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="btn-primary px-8 py-3 text-lg">
            <Link href="/services">
              Explore Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="btn-secondary px-8 py-3 text-lg">
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
        {/* <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Latest Episodes</h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Expert insights on cybersecurity and AI ethics from our podcast series.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {sampleData.podcasts.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </div>
        <div className="text-center mt-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="border-red-500/50 text-red-400">
              <ExternalLink className="mr-1 h-3 w-3" />
              YouTube
            </Badge>
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              <ExternalLink className="mr-1 h-3 w-3" />
              Spotify
            </Badge>
            <Badge variant="outline" className="border-purple-500/50 text-purple-400">
              <ExternalLink className="mr-1 h-3 w-3" />
              Apple Podcasts
            </Badge>
          </div>
        </div> */}
        <PodcastsSection podcasts={podcasts} title="Latest Podcast Episodes" badge="Listen Now" description="Tune in for discussions on the latest in cybersecurity and AI ethics." showAllBtn={true} />
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
