import { Hero } from '@/components/ui/hero';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CustomizedCard } from '@/components/ui/card';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { EventCallout } from '@/components/events/EventCallout';
import Link from 'next/link';
import sampleData from '@/data/sample.json';
import { ArrowRight, ExternalLink, } from 'lucide-react';
import PodcastsSection from '@/components/sections/PodcastSection';
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic';

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
    thumbnailUrl: r.thumbnail?.url || r.featuredImage?.url || "/images/default-podcast.jpg",
  }));
  // console.log('Mapped Podcasts:', mappedPodcasts);

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
    timeStart: r.eventDetails?.timeStart ?? "",
    timeEnd: r.eventDetails?.timeEnd ?? "",
    timeZone: r.eventDetails?.timeZone ?? "",
    location: r.eventDetails?.location ?? "",
    description: r.description ?? "",
    links: { luma: r.links?.lumaLink ?? "", zoom: r.links?.zoomLink ?? "", recapUrl: r.links?.recapUrl ?? "" },
    tags: [r.topic, r.eventDetails?.location].filter(Boolean) as string[],
  }));

  // Keep only events from now forward, sorted ascending by date/time
  const now = new Date();
  const upcomingEvents = mappedEvents
    .filter((e) => {
      if (e.rawDate) {
        return new Date(e.rawDate).getTime() >= now.getTime();
      }
      const d = toDateObj(e.date, e.timeStart);
      return d ? d.getTime() >= now.getTime() : false;
    })
    .sort((a, b) => {
      const da = toDateObj(a.date, a.timeStart)?.getTime() ?? Number.POSITIVE_INFINITY;
      const db = toDateObj(b.date, b.timeStart)?.getTime() ?? Number.POSITIVE_INFINITY;
      return da - db;
    });

    const embedUrl = "https://www.youtube.com/embed/S1e1oRZXRIA?si=pSXxiWWhQIpC3fck"; // Replace with your podcast embed URL

  return (
    <>
      <Hero
        title="Securing Digital Futures"
        subtitle="Leading cybersecurity consultancy and AI ethics organization dedicated to building safer, more ethical technology for everyone."
        imageUrl='./images/home.webp'
      >
        <div className="font-poppins flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="btn-primary text-white px-8 py-3 text-base md:text-lg">
            <Link href="/services">
              Explore Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="btn-secondary text-slate-300 px-8 py-3 text-base md:text-lg">
            <Link href="/events">
              Upcoming Events
              <ExternalLink className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </Hero>

      {/* Impact Stats */}
      {/* <Section className="hidden bg-slate-900/50">
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
      </Section> */}

      {/* Our Vision */}
      <Section className="pt-8 lg:pt-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Vision</h2>
          <p className="text-slate-300 text-base lg:text-lg max-w-4xl mx-auto font-poppins">
            Our mission is straightforward: to make cyber security <span className="">accessible, practical and community-driven</span>. <br/>
          </p>
        </div>
        <div className="grid grid-cols-1 items-center lg:grid-cols-5 gap-6">
          <CustomizedCard className="col-span-3">
              <CardContent className="p-0">
                <div className="aspect-video bg-slate-900">
                  <iframe 
                    src={embedUrl} 
                    className="w-full h-full"
                    title="YouTube video player" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </CustomizedCard>
          <p className="text-slate-300 col-span-2 text-sm md:text-base max-w-2xl mx-auto font-poppins">
            We at TECH-NEST recognize the urgent need for awareness surrounding cyber security and AI ethics, especially given that Canadians are deeply concerned about AI's negative consequences and have lost millions due to cyber fraud.<br/><br/>

            We actively address this need by running <span className="font-semibold">workshops</span> in various community hubs and at Concordia University, where we talk with people about important topics like <span className="font-semibold">AI ethics and cyber security</span>. We believe Canadians deserve better support for their cyber safety.<br/><br/>

            <span className="">To that end</span>, we are currently planning to build a <span className="font-semibold ">24/7 support framework</span> accessed through our <span className="font-semibold">website and call center</span>, which can help anyone instantly. Customers can avail this essential support by paying a minimum subscription fee. We are committed to providing the awareness and tools necessary to navigate this digital era.
          </p>
        </div>
      </Section>

      {/* Recent News & Events Section */}
      <Section className="">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Recent News & Events</h2>
          <p className="text-slate-300 text-base lg:text-lg max-w-2xl mx-auto font-poppins">
            Stay updated with the latest news and events in the world of cybersecurity and AI ethics.
          </p>
        </div>
        <div className="flex gap-4 md:gap-8 lg:gap-16 justify-left items-center flex-col md:flex-row">
          <div className="lg:col-span-1 space-y-6">
            <Card className=" surface">
              <CardContent className="p-6">
                <div className="space-y-4">
                    <Link
                      href="/events/outreach-program"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group hover-lift"
                    >
                      <div className="flex items-center gap-7">
                        <div 
                          className="w-24 h-16 bg-cover bg-center rounded-lg flex-shrink-0"
                          style={{ backgroundImage: `url(/images/outreach.png)` }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm md:text-base line-clamp-2 group-hover:text-cyan-400 transition-colors">
                            <span>Empowering Communities: From Campus to Market, Building Digital Confidence Together</span>
                            <ExternalLink className="inline-block ml-1 mb-1 h-4 w-4" />
                          </h3>
                        </div>
                      </div>
                    </Link>
                </div>
              </CardContent>
            </Card>
          </div> 
          <div className="lg:col-span-1 space-y-6">
            <Card className=" surface">
              <CardContent className="p-6">
                <div className="space-y-4">
                    <Link
                      href="https://thelinknewspaper.ca/article/why-i-stopped-waiting-for-tech-to-save-us"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group hover-lift"
                    >
                      <div className="flex items-center gap-7">
                        <div 
                          className="w-24 h-16 bg-cover bg-center rounded-lg flex-shrink-0"
                          style={{ backgroundImage: `url(/images/link_paper.jpeg)` }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm md:text-base line-clamp-2 group-hover:text-cyan-400 transition-colors">
                            <span>Why I stopped waiting for tech to save us: Turning personal loss into a collective fight against online scams</span>
                            <ExternalLink className="inline-block ml-1 mb-1 h-4 w-4" />
                          </h3>
                        </div>
                      </div>
                    </Link>
                </div>
              </CardContent>
            </Card>
          </div> 
        </div>
      </Section>

      <Section>
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-slate-300 text-base lg:text-lg max-w-2xl mx-auto font-poppins">
            Comprehensive cybersecurity solutions and AI ethics guidance for organizations of all sizes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
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
          <Button asChild className="btn-primary text-sm md:text-base font-poppins">
            <Link href="/services">View All Services</Link>
          </Button>
        </div>
      </Section>
      
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

      {upcomingEvents.length !== 0 ? (
        <Section>
          <div className="max-w-5xl mx-auto">
            <div className="space-y-6">
              {upcomingEvents.map((evt) => (
                <EventCallout key={evt.id} event={evt} />
              ))}
            </div>
          </div>
        </Section>
      ) : null}
    </>
  );
}
