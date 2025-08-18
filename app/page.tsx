import { Hero } from '@/components/ui/hero';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/cards/StatCard';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { PodcastCard } from '@/components/cards/PodcastCard';
import { EventCallout } from '@/components/events/EventCallout';
import Link from 'next/link';
import sampleData from '@/data/sample.json';
import { ArrowRight, Play, ExternalLink } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        title="Securing Digital Futures"
        subtitle="Leading cybersecurity consultancy and AI ethics organization dedicated to building safer, more ethical technology for everyone."
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
      <Section className="bg-slate-900/50">
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
      <Section className="bg-slate-900/50">
        <div className="text-center mb-12">
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
        </div>
      </Section>

      {/* Upcoming Event Callout */}
      <Section>
        <EventCallout event={sampleData.events.upcoming[0]} />
      </Section>
    </>
  );
}