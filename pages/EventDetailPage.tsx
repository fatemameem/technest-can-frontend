import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';

import { usePageTitle } from '../hooks/usePageTitle';
import Container from '../components/Container';
import Section from '../components/Section';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

import { EventItem } from '../types';
import { formatDate } from '../lib/utils';

const EventDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const loadEvent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/events.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const eventsData = await response.json();
        const foundEvent = (eventsData as EventItem[]).find(e => e.slug === slug);
        setEvent(foundEvent || null);
      } catch (err) {
        console.error("Failed to load event data:", err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [slug]);

  usePageTitle(event ? event.title : 'Event Details');

  if (loading) {
    return (
      <Section className="pt-8 pb-0">
        <Container>
          <div className="w-full h-60 md:h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
              </div>
            </div>
            <aside className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    );
  }

  if (!event) {
    return (
      <Section>
        <Container className="text-center">
          <h1 className="text-3xl font-bold">Event Not Found</h1>
          <p className="mt-4 text-slate-700 dark:text-slate-300">The event you are looking for does not exist.</p>
          <Button as={Link} to="/events" className="mt-8">Back to Events</Button>
        </Container>
      </Section>
    );
  }

  const isUpcoming = new Date(event.start) >= new Date();

  return (
    <>
      <Section className="pt-8 pb-0">
        <Container>
          <img src={event.coverImage} alt={event.title} className="w-full h-60 md:h-96 object-cover rounded-3xl" />
        </Container>
      </Section>
      <Section className="pt-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                {event.tags.map(tag => <Badge key={tag} variant="secondary" className="capitalize">{tag}</Badge>)}
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">{event.title}</h1>
              <div className="mt-8 prose prose-lg prose-slate dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: event.description }} />
              
              {event.agenda && event.agenda.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Agenda</h2>
                  <ul className="space-y-4">
                    {event.agenda.map((item, index) => (
                      <li key={index} className="flex items-start gap-4 p-4 bg-slate-100 dark:bg-slate-900 rounded-xl">
                        <span className="font-bold text-blue-700 dark:text-blue-500 w-20 flex-shrink-0">{item.time}</span>
                        <p className="text-slate-700 dark:text-slate-300">{item.item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
               {event.speakers && event.speakers.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Speakers</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {event.speakers.map((speaker, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <img src={speaker.avatarUrl} alt={speaker.name} className="w-20 h-20 rounded-full object-cover" />
                        <div>
                          <h3 className="font-bold text-slate-800 dark:text-slate-100">{speaker.name}</h3>
                          <p className="text-slate-700 dark:text-slate-300 text-sm">{speaker.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <aside className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {isUpcoming ? (
                  <Button size="lg" className="w-full">Register for this event</Button>
                ) : (
                  <Badge variant="outline" className="w-full justify-center text-base py-3">Event Concluded</Badge>
                )}
                <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Event Details</h3>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-slate-500 dark:text-slate-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-700 dark:text-slate-200">Date</p>
                      <p className="text-slate-700 dark:text-slate-300">{formatDate(event.start, { month: 'long', day: 'numeric', year: 'numeric'})}</p>
                    </div>
                  </div>
                   <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-slate-500 dark:text-slate-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-700 dark:text-slate-200">Time</p>
                      <p className="text-slate-700 dark:text-slate-300">{formatDate(event.start, { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-slate-500 dark:text-slate-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-700 dark:text-slate-200">Location</p>
                      <p className="text-slate-700 dark:text-slate-300">{event.location.details}</p>
                      {event.location.type === 'virtual' && event.location.link && (
                        <a href={event.location.link} className="text-sm text-blue-600 hover:underline">Access Link</a>
                      )}
                    </div>
                  </div>
                </div>
                
                 {event.resources && event.resources.length > 0 && (
                   <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 space-y-4">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Resources</h3>
                      <ul className="space-y-2">
                        {event.resources.map((resource, index) => (
                           <li key={index}>
                             <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 dark:text-blue-500 hover:underline">
                               <ExternalLink size={16} />
                               <span>{resource.label}</span>
                             </a>
                           </li>
                        ))}
                      </ul>
                   </div>
                 )}
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
};

export default EventDetailPage;