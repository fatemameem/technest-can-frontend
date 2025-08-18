
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.js';
import Container from '../components/Container.js';
import Section from '../components/Section.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';
import { formatDate } from '../lib/utils.js';
import RegisterDialog from '../components/RegisterDialog.js';
import TeamCard from '../components/TeamCard.js';

const EventDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const { events, loading, error } = useAppContext();

    const event = useMemo(() => events.find(e => e.slug === slug), [events, slug]);

    if (loading) return <div className="text-center py-20">Loading event details...</div>;
    if (error) return <div className="text-center py-20 text-dark-danger">Error: {error.message}</div>;
    if (!event) return <div className="text-center py-20">Event not found.</div>;

    const isPast = new Date(event.start) < new Date();

    return (
        <Section>
            <Container>
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {event.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-dark-text-primary sm:text-5xl">{event.title}</h1>
                        <p className="mt-4 text-lg text-dark-meta">{formatDate(event.start)}</p>
                        {isPast ? (
                           <Badge className="mt-4 bg-dark-warning/20 text-dark-warning border-dark-warning/50">Event Concluded</Badge>
                        ) : (
                           <div className="mt-6">
                             <RegisterDialog event={event}>
                                <Button size="lg">Register Now</Button>
                             </RegisterDialog>
                           </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="prose prose-invert prose-lg text-dark-text-secondary max-w-none space-y-8">
                        <section>
                            <h2 className="text-dark-text-primary">Overview</h2>
                            <p>{event.description}</p>
                        </section>
                        
                        {event.agenda && event.agenda.length > 0 && (
                            <section>
                                <h2 className="text-dark-text-primary">Agenda</h2>
                                <ul className="list-none p-0">
                                    {event.agenda.map((item, index) => (
                                        <li key={index} className="flex items-start mb-4">
                                            <span className="font-bold text-dark-accent w-24">{item.time}</span>
                                            <span className="flex-1">{item.item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                        
                        {event.speakers && event.speakers.length > 0 && (
                            <section>
                                <h2 className="text-dark-text-primary">Speakers</h2>
                                <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
                                     {event.speakers.map((speaker, index) => (
                                         <div key={index} className="flex items-center space-x-4 p-4 bg-dark-surface rounded-lg">
                                             <img 
                                                 className="h-16 w-16 rounded-full object-cover" 
                                                 src={speaker.avatarUrl || `https://ui-avatars.com/api/?name=${speaker.name.replace(' ', '+')}`} 
                                                 alt={speaker.name} 
                                             />
                                             <div>
                                                 <p className="font-bold text-dark-text-primary">{speaker.name}</p>
                                                 <p className="text-sm text-dark-meta">{speaker.title}</p>
                                                 {speaker.org && <p className="text-sm text-dark-meta">{speaker.org}</p>}
                                             </div>
                                         </div>
                                     ))}
                                </div>
                            </section>
                        )}

                        {event.resources && event.resources.length > 0 && (
                             <section>
                                <h2 className="text-dark-text-primary">Resources</h2>
                                <ul className="list-disc pl-5">
                                    {event.resources.map((resource, index) => (
                                        <li key={index}>
                                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-dark-accent hover:underline">
                                                {resource.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                </div>
            </Container>
        </Section>
    );
};

export default EventDetail;