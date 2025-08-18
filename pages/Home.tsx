
import React from 'react';
import { Link } from 'react-router-dom';
import { ButtonLink } from '../components/ui/Button.js';
import Container from '../components/Container.js';
import Section from '../components/Section.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card.js';
import { useAppContext } from '../context/AppContext.js';
import { getUpcomingEvents } from '../lib/utils.js';
import EventCard from '../components/EventCard.js';
import PodcastCard from '../components/PodcastCard.js';

const services = [
  { title: 'Consultancy', description: 'Expert guidance on cybersecurity strategy and AI ethics implementation.', link: '/contact?service=consultancy' },
  { title: 'Content', description: 'Engaging articles, videos, and materials to educate your audience.', link: '/contact?service=content' },
  { title: 'Newsletter', description: 'Curated insights and updates delivered directly to your inbox.', link: '/contact?service=newsletter' },
  { title: 'Training', description: 'Hands-on workshops and training sessions for teams of all sizes.', link: '/contact?service=training' },
];

const impactMetrics = [
    { value: '500+', label: 'Participants Educated' },
    { value: '20+', label: 'Workshops Delivered' },
    { value: '100%', label: 'Positive Feedback' },
    { value: '5+', label: 'Community Partners' },
];

const Home = () => {
    const { events, podcasts, loading } = useAppContext();
    const upcomingEvents = getUpcomingEvents(events);
    const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
    const latestPodcasts = podcasts.slice(0, 3);

    return (
        <>
            {/* Hero Section */}
            <Section className="pt-24 sm:pt-32 text-center bg-grid-slate-800/[0.2]">
                <Container>
                    <h1 className="text-4xl font-extrabold tracking-tight text-dark-text-primary sm:text-5xl md:text-6xl lg:text-7xl">
                        A Safer, Fairer, and More Inclusive Digital Future
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg text-dark-text-secondary">
                        In a world where digital risks grow every day, our mission is to make cyber safety and AI ethics accessible, practical, and actionable for everyone.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <ButtonLink to="/services" size="lg">Explore Services</ButtonLink>
                        <ButtonLink to="/events" size="lg" variant="secondary">Upcoming Events</ButtonLink>
                    </div>
                </Container>
            </Section>

            {/* Impact Section */}
            <Section>
                <Container>
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-dark-text-primary sm:text-4xl">Our Impact</h2>
                        <p className="mt-4 text-lg text-dark-text-secondary">
                            Delivering programs that reach hundreds of participants from all walks of life.
                        </p>
                    </div>
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {impactMetrics.map((metric) => (
                            <div key={metric.label} className="p-4 bg-dark-surface rounded-2xl">
                                <p className="text-4xl font-bold text-dark-accent">{metric.value}</p>
                                <p className="mt-1 text-dark-meta">{metric.label}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </Section>
            
            {/* Featured Services Section */}
            <Section className="bg-dark-surface">
                <Container>
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-dark-text-primary sm:text-4xl">How We Help</h2>
                        <p className="mt-4 text-lg text-dark-text-secondary">We offer a range of services to empower individuals and organizations.</p>
                    </div>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map((service) => (
                            <Card key={service.title} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle>{service.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-dark-text-secondary">{service.description}</p>
                                </CardContent>
                                <CardFooter>
                                    <ButtonLink to={service.link} variant="secondary">Request Service</ButtonLink>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* Latest Podcasts Section */}
            <Section>
                <Container>
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-dark-text-primary sm:text-4xl">Latest Podcasts</h2>
                        <p className="mt-4 text-lg text-dark-text-secondary">Listen to our latest conversations on cyber safety and AI ethics.</p>
                    </div>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            <p>Loading podcasts...</p>
                        ) : latestPodcasts.length > 0 ? (
                            latestPodcasts.map(podcast => <PodcastCard key={podcast.id} podcast={podcast} />)
                        ) : (
                            <p>No podcasts available yet.</p>
                        )}
                    </div>
                </Container>
            </Section>

            {/* Upcoming Event Section */}
            {nextEvent && (
                <Section className="bg-dark-surface">
                    <Container>
                         <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-dark-text-primary sm:text-4xl">Join Our Next Event</h2>
                            <p className="mt-4 text-lg text-dark-text-secondary">Don't miss out on our upcoming session.</p>
                        </div>
                        <div className="mt-12 max-w-4xl mx-auto">
                           <EventCard event={nextEvent} />
                        </div>
                    </Container>
                </Section>
            )}
        </>
    );
};

export default Home;