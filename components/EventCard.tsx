
import React from 'react';
import { EventItem } from '../types.js';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/Card.js';
import { Badge } from './ui/Badge.js';
import { Link } from 'react-router-dom';
import { Button, ButtonLink } from './ui/Button.js';
import { formatDate, formatDateRange } from '../lib/utils.js';
import { Calendar, MapPin, CheckCircle } from './icons.js';
import RegisterDialog from './RegisterDialog.js';
import { useAppContext } from '../context/AppContext.js';

interface EventCardProps {
    event: EventItem;
}

const EventCard = ({ event }: EventCardProps) => {
    const isPast = new Date(event.start) < new Date();
    const { isRegistered } = useAppContext();
    const hasRegistered = isRegistered(event.id);

    return (
        <Card className="flex flex-col h-full overflow-hidden">
            <div className="relative">
                <Link to={`/events/${event.slug}`}>
                    <img 
                        src={event.coverImage || 'https://picsum.photos/seed/tech-nest-event/800/400'} 
                        alt={event.title}
                        className="w-full h-48 object-cover"
                    />
                </Link>
                <div className="absolute top-4 right-4 flex gap-2">
                    {event.tags.slice(0, 2).map(tag => <Badge key={tag}>{tag}</Badge>)}
                </div>
            </div>
            <CardHeader>
                <Link to={`/events/${event.slug}`} className="hover:text-dark-accent transition-colors">
                  <CardTitle>{event.title}</CardTitle>
                </Link>
                <div className="text-sm text-dark-meta pt-2 space-y-2">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(event.start)}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location.details} ({event.location.type})</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-dark-text-secondary text-sm line-clamp-3">{event.summary}</p>
            </CardContent>
            <CardFooter className="flex-wrap gap-2 justify-between">
                {isPast ? (
                    <ButtonLink to={`/events/${event.slug}`} variant="secondary">View Recap</ButtonLink>
                ) : hasRegistered ? (
                     <div className="flex items-center gap-2 text-dark-success font-semibold">
                        <CheckCircle className="w-5 h-5" />
                        <span>Registered</span>
                    </div>
                ) : (
                    <RegisterDialog event={event}>
                        <Button>Register</Button>
                    </RegisterDialog>
                )}
                 <ButtonLink to={`/events/${event.slug}`} variant="ghost">Details</ButtonLink>
            </CardFooter>
        </Card>
    );
};

export default EventCard;