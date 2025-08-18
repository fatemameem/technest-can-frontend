import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Users, ShieldCheck, Loader } from 'lucide-react';

import { usePageTitle } from '../hooks/usePageTitle';
import Container from '../components/Container';
import Section from '../components/Section';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

import { EventItem, PodcastEpisode, ServiceType } from '../types';
import { getUpcomingEvents, formatDate } from '../lib/utils';

const services = [
  {
    type: 'consultancy' as ServiceType,
    title: 'Consultancy',
    description: 'Expert guidance to help your organization build a resilient cybersecurity posture.',
  },
  {
    type: 'content' as ServiceType,
    title: 'Content',
    description: 'Engaging articles, videos, and materials to educate your audience on digital safety.',
  },
  {
    type: 'newsletter' as ServiceType,
    title: 'Newsletter',
    description: 'A curated source of cybersecurity news and insights, tailored for your community.',
  },
  {
    type: 'training' as ServiceType,
    title: 'Training',
    description: 'Interactive workshops and training sessions for teams of all sizes and skill levels.',
  },
];

const Hero: React.FC = () => (
  <div className="relative bg-slate-900">
    <div aria-hidden="true" className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
        alt="Cybersecurity background"
        className="h-full w-full object-cover object-center"
      />
    </div>
    <div aria-hidden="true" className="absolute inset-0 bg-slate-900 bg-opacity-60 dark:bg-opacity-75" />
    <div className="relative">
      <Container className="py-20 text-center lg:py-32">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          A Safer, Fairer, More Inclusive Digital Future
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-200">
          We are dedicated to empowering people everywhere to respond confidently to digital change. Our mission is to make cyber safety and AI ethics accessible, practical, and actionable for all.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button as={Link} to="/services" size="lg" variant="primary">
            Explore Services
          </Button>
          <Button as={Link} to="/events" size="lg" variant="outline" className="border-slate-300 text-white hover:bg-white hover:text-slate-900 dark:border-slate-300 dark:text-white dark:hover:bg-white dark:hover:text-slate-900">
            Upcoming Events
          </Button>
        </div>
      </Container>
    </div>
  </div>
);

const ImpactSection: React.FC = () => (
  <Section className="bg-white dark:bg-slate-900">
    <Container>
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">Our Impact</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-700 dark:text-slate-300">
          Reaching hundreds of participants from all walks of life through interactive programs and public awareness campaigns.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="space-y-3">
          <BarChart className="mx-auto h-12 w-12 text-blue-700 dark:text-blue-600" />
          <h3 className="text-2xl font-bold">50+ Workshops</h3>
          <p className="text-slate-700 dark:text-slate-300">Delivered on topics from phishing prevention to AI ethics.</p>
        </div>
        <div className="space-y-3">
          <Users className="mx-auto h-12 w-12 text-blue-700 dark:text-blue-600" />
          <h3 className="text-2xl font-bold">1,200+ Participants</h3>
          <p className="text-slate-700 dark:text-slate-300">Engaged from schools, community centers, and workplaces.</p>
        </div>
        <div className="space-y-3">
          <ShieldCheck className="mx-auto h-12 w-12 text-blue-700 dark:text-blue-600" />
          <h3 className="text-2xl font-bold">98% Positive Feedback</h3>
          <p className="text-slate-700 dark:text-slate-300">Rated our sessions as valuable and highly relevant.</p>
        </div>
      </div>
    </Container>
  </Section>
);

const ServiceCard: React.FC<{ service: typeof services[0] }> = ({ service }) => {
  const navigate = useNavigate();
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{service.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-slate-700 dark:text-slate-300">{service.description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          onClick={() => navigate(`/contact?service=${service.type}`)}>
          Request Service
        </Button>
      </CardFooter>
    </Card>
  );
};


const HomePage: React.FC = () => {
  usePageTitle('Home');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [eventsResponse, podcastsResponse] = await Promise.all([
          fetch('/data/events.json'),
          fetch('/data/podcasts.json'),
        ]);
        if (!eventsResponse.ok || !podcastsResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const eventsData = await eventsResponse.json();
        const podcastsData = await podcastsResponse.json();
        setEvents(eventsData);
        setPodcasts(podcastsData);
      } catch (error) {
        console.error("Failed to load homepage data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const upcomingEvents = getUpcomingEvents(events);
  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  const latestPodcasts = podcasts.slice(0, 3);

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: 'calc(100vh - 20rem)' }}>
        <Loader className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <Hero />
      <ImpactSection />

      <Section id="services" className="bg-slate-50 dark:bg-slate-950">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">Featured Services</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-700 dark:text-slate-300">
              We offer a range of services to help individuals and organizations navigate the digital world safely.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.type} service={service} />
            ))}
          </div>
        </Container>
      </Section>
      
      <Section id="podcasts" className="bg-slate-100 dark:bg-slate-900">
        <Container>
           <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">Latest Podcasts</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-700 dark:text-slate-300">
             Tune in for discussions on the latest in cybersecurity and AI ethics.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestPodcasts.map((podcast) => (
              <Card key={podcast.id}>
                <CardHeader>
                  <CardTitle>{podcast.title}</CardTitle>
                  <CardDescription>{formatDate(podcast.date, { month: 'long', day: 'numeric', year: 'numeric'})}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-slate-300">{podcast.summary}</p>
                   {podcast.embedUrl && (
                     <div className="mt-4 aspect-video">
                        <iframe
                          className="w-full h-full rounded-lg"
                          src={podcast.embedUrl}
                          title={`Podcast Player for ${podcast.title}`}
                          allow="encrypted-media"
                        ></iframe>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {nextEvent && (
        <Section id="next-event" className="bg-white dark:bg-slate-950">
          <Container>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">Upcoming Event</h2>
            </div>
            <div className="mt-12 max-w-4xl mx-auto">
              <Card>
                <div className="grid md:grid-cols-2">
                  <img src={nextEvent.coverImage} alt={nextEvent.title} className="w-full h-64 md:h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"/>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {nextEvent.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{nextEvent.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">{formatDate(nextEvent.start)}</p>
                    <p className="text-slate-700 dark:text-slate-300 mt-4">{nextEvent.summary}</p>
                    <div className="mt-6 flex gap-4">
                      <Button as={Link} to={`/events/${nextEvent.slug}`} variant="primary">Register Now</Button>
                      <Button as={Link} to="/events" variant="outline">View All Events</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Container>
        </Section>
      )}
    </>
  );
};

export default HomePage;