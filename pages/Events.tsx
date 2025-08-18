
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext.js';
import { getUpcomingEvents, getPastEvents } from '../lib/utils.js';
import Container from '../components/Container.js';
import Section from '../components/Section.js';
import PageHeader from '../components/PageHeader.js';
import EventCard from '../components/EventCard.js';
import { Button } from '../components/ui/Button.js';
import { cn } from '../lib/utils.js';

type EventTab = 'upcoming' | 'past';

const Events = () => {
    const { events, loading, error } = useAppContext();
    const [activeTab, setActiveTab] = useState<EventTab>('upcoming');

    const upcomingEvents = useMemo(() => getUpcomingEvents(events), [events]);
    const pastEvents = useMemo(() => getPastEvents(events), [events]);

    const displayedEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

    return (
        <Section>
            <Container>
                <PageHeader
                    title="Events"
                    subtitle="Join our community at workshops, webinars, and panels. Learn, connect, and grow with us."
                />

                <div className="mt-8 flex justify-center border-b border-slate-800">
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab('upcoming')}
                        className={cn("rounded-none border-b-2 px-6 py-3", activeTab === 'upcoming' ? 'border-dark-accent text-dark-accent' : 'border-transparent text-dark-meta')}
                    >
                        Upcoming ({upcomingEvents.length})
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab('past')}
                        className={cn("rounded-none border-b-2 px-6 py-3", activeTab === 'past' ? 'border-dark-accent text-dark-accent' : 'border-transparent text-dark-meta')}
                    >
                        Past ({pastEvents.length})
                    </Button>
                </div>
                
                <div className="mt-12">
                    {loading && <p className="text-center">Loading events...</p>}
                    {error && <p className="text-center text-dark-danger">Error loading events: {error.message}</p>}
                    {!loading && !error && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {displayedEvents.length > 0 ? (
                                displayedEvents.map(event => <EventCard key={event.id} event={event} />)
                            ) : (
                                <p className="text-center md:col-span-2 text-dark-meta">
                                    No {activeTab} events to display right now. Check back soon!
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </Container>
        </Section>
    );
};

export default Events;