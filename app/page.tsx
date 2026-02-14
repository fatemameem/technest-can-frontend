'use client';
import { Hero } from '@/components/ui/hero';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CustomizedCard } from '@/components/ui/card';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { EventCallout } from '@/components/events/EventCallout';
import Link from 'next/link';
import Image from 'next/image';
import sampleData from '@/data/sample.json';
import { ArrowRight, ExternalLink, } from 'lucide-react';
import PodcastsSection from '@/components/sections/PodcastSection';
import { useEffect, useState } from 'react';
import { TechNestCarePopup } from '@/components/promotionals/TechNestCarePopup';

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
  console.log('Raw Podcasts:', rawPodcasts);

  // Map into the shape PodcastCard expects
  const mappedPodcasts = (rawPodcasts || []).map((r: any) => ({
    id: r.id,
    title: r.title ?? "Untitled Podcast",
    date: r.timestamp ?? "",
    linkedin: r.linkedin ?? "",
    instagram: r.instagram ?? "",
    facebook: r.facebook ?? "",
    path: r.path ?? "",
    thumbnailUrl: r.thumbnailUrl ?? "",
  }));
  console.log('Mapped Podcasts:', mappedPodcasts);

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

    const embedUrl = "https://www.youtube.com/embed/S1e1oRZXRIA?si=pSXxiWWhQIpC3fck"; // Replace with your podcast embed URL

  return (
    <>
      {/* Hero Section */}
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
        <div className="flex flex-col gap-8">
        <div className="flex gap-4 md:gap-8 lg:gap-16 justify-left items-center flex-col md:flex-row">
          <div className="lg:col-span-1 space-y-6 w-full">
            <Card className=" surface">
              <CardContent className="p-6">
                <div className="space-y-4">
                    <Link
                      href="/events/findac-x-technest"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group hover-lift"
                    >
                      <div className="flex items-center gap-7">
                        <div 
                          className="w-24 h-16 bg-cover bg-center rounded-lg flex-shrink-0"
                          style={{ backgroundImage: `url(/images/technest-findac-2025-10-31.jpeg)` }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm md:text-base line-clamp-2 group-hover:text-cyan-400 transition-colors">
                            <span>TECH-NEST at FINDAC (Concordia) - Online Safety and AI Awareness</span>
                            <ExternalLink className="inline-block ml-1 mb-1 h-4 w-4" />
                          </h3>
                        </div>
                      </div>
                    </Link>
                </div>
              </CardContent>
            </Card>
          </div> 
          <div className="lg:col-span-1 space-y-6 w-full">
            <Card className=" surface">
              <CardContent className="p-6">
                <div className="space-y-4">
                    <Link
                      href="/events/technest-at-forces-avenir"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group hover-lift"
                    >
                      <div className="flex items-center gap-7">
                        <div 
                          className="w-24 h-16 bg-cover bg-center rounded-lg flex-shrink-0"
                          style={{ backgroundImage: `url(/images/forces-avenir-1.jpeg)` }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm md:text-base line-clamp-2 group-hover:text-cyan-400 transition-colors">
                            <span>Proud to Be Part of Forces AVENIR 2025: Celebrating Student Leadership and Community Impact</span>
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
        <div className="flex gap-4 md:gap-8 lg:gap-16 justify-left items-center flex-col md:flex-row">
          <div className="lg:col-span-1 space-y-6 w-full">
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
          <div className="lg:col-span-1 space-y-6 w-full">
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
        </div>
      </Section>

      {/* Upcoming Event Callout */}
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

      {/* Featured Services */}
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

      {/* Podcasts Section */}
      <Section className="">
        <PodcastsSection
          podcasts={podcasts}
          title="Latest Podcast Episodes"
          badge="Listen Now"
          description="Tune in for discussions on the latest in cybersecurity and AI ethics."
          showAllBtn={true}
        />
      </Section>
      {/* Tech-Nest Care Promotional Section */}
      <section className="py-16 px-6 lg:px-12 bg-gradient-to-br from-slate-900 via-cyan-950/20 to-slate-900 border-t border-b border-cyan-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6 my-24">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                <svg
                  className="w-5 h-5 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="text-cyan-400 text-sm font-medium">
                  Free Trial Until March 31, 2026
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Protect Your Organization with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  Tech-Nest Care
                </span>
              </h2>

              <p className="text-lg text-slate-300 leading-relaxed">
                Our AI-assisted cybersecurity monitoring platform helps your organization 
                detect and respond to threats quickly with real-time alerts and intelligent analysis.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <svg
                      className="w-6 h-6 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-slate-300">Threat Detection</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <svg
                      className="w-6 h-6 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-slate-300">Real-Time Alerts</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <svg
                      className="w-6 h-6 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-slate-300">AI-Powered Security</span>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/contact?subject=Request a demo of Tech-Nest Care">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-8 py-6 text-lg shadow-lg shadow-cyan-500/20"
                  >
                    Request Your Free Trial
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image Preview - Hidden on mobile */}
            <div className="hidden lg:block h-full">
              <div className="relative h-full rounded-xl overflow-hidden border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
                <Image
                  src="/images/technest-care.jpeg"
                  alt="Tech-Nest Care Platform Preview"
                  fill
                  className=""
                  sizes="(max-width: 1024px) 0vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Tech-Nest Care Promotional Popup */}
      {/* <TechNestCarePopup /> */}
    </>
  );
}
