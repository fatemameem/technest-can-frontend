import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import Container from '../components/Container';
import Section from '../components/Section';
import { Card, CardContent, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { cn, formatDate, getUpcomingEvents, getPastEvents } from '../lib/utils';
import { EventItem } from '../types';
import RegisterDialog from '../components/RegisterDialog';

type EventTab = 'upcoming' | 'past';

const EventCard: React.FC<{ event: EventItem; isUpcoming: boolean; onRegister: (event: EventItem) => void }> = ({ event, isUpcoming, onRegister }) => (
  <Card className="flex flex-col">
    <img src={event.coverImage} alt={event.title} className="w-full h-48 object-cover rounded-t-2xl" />
    <CardContent className="pt-6 flex-grow flex flex-col">
      <div className="flex flex-wrap gap-2 mb-2">
        {event.tags.map(tag => <Badge key={tag} variant="secondary" className="capitalize">{tag}</Badge>)}
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 hover:text-blue-700 dark:hover:text-blue-500">
        <Link to={`/events/${event.slug}`}>{event.title}</Link>
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{formatDate(event.start)}</p>
      <p className="text-slate-700 dark:text-slate-300 mt-3 text-sm flex-grow">{event.summary}</p>
    </CardContent>
    <CardFooter className="flex justify-between items-center">
      <Button as={Link} to={`/events/${event.slug}`} variant="outline" size="sm">
        {isUpcoming ? 'View Details' : 'View Recap'}
      </Button>
      {isUpcoming && <Button variant="primary" size="sm" onClick={() => onRegister(event)}>Register</Button>}
    </CardFooter>
  </Card>
);

const EventsPage: React.FC = () => {
  usePageTitle('Events');
  const [activeTab, setActiveTab] = useState<EventTab>('upcoming');
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/events.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Failed to load events data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const upcomingEvents = useMemo(() => getUpcomingEvents(events), [events]);
  const pastEvents = useMemo(() => getPastEvents(events), [events]);

  const handleRegisterClick = (event: EventItem) => {
    setSelectedEvent(event);
    setIsRegisterDialogOpen(true);
  };

  const eventsToShow = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <>
      <Section className="bg-slate-100 dark:bg-slate-900">
        <Container className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl md:text-6xl">Events</h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-700 dark:text-slate-300">
            Join our workshops, webinars, and community panels to learn more about cybersecurity and AI ethics.
          </p>
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="border-b border-slate-200 dark:border-slate-800 mb-8">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={cn(
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                  activeTab === 'upcoming' ? 'border-blue-700 dark:border-blue-500 text-blue-700 dark:text-blue-500' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-700'
                )}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={cn(
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                  activeTab === 'past' ? 'border-blue-700 dark:border-blue-500 text-blue-700 dark:text-blue-500' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-700'
                )}
              >
                Past
              </button>
            </nav>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {Array.from({ length: 3 }).map((_, i) => (
                 <Card key={i}>
                    <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-t-2xl animate-pulse"></div>
                    <CardContent className="pt-6 space-y-3">
                        <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                        <div className="h-6 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                        <div className="mt-3 space-y-2">
                          <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                          <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                        </div>
                    </CardContent>
                 </Card>
               ))}
             </div>
          ) : eventsToShow.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventsToShow.map((event) => (
                <EventCard key={event.id} event={event} isUpcoming={activeTab === 'upcoming'} onRegister={handleRegisterClick} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">No {activeTab} events right now.</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Please check back later for new events.</p>
            </div>
          )}
        </Container>
      </Section>
      {selectedEvent && (
        <RegisterDialog
          isOpen={isRegisterDialogOpen}
          onClose={() => setIsRegisterDialogOpen(false)}
          event={selectedEvent}
        />
      )}
    </>
  );
};

export default EventsPage;