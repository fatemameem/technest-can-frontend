import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    thumbnailUrl?: string;
    description: string;
    date?: string;
    time?: string;
    location?: string;
    topic?: string;
    tags?: string[];
    links?: {
      luma?: string;
      zoom?: string;
      recapUrl?: string; // Add recapUrl to EventCard interface
    };
    sponsors?: string[];
  };
  type: 'upcoming' | 'past';
}

export function EventCard({ event, type }: EventCardProps) {
  const eventDate = new Date(`${event.date}`);

  return (
    <Card className="surface hover-lift overflow-hidden">
      <div 
        className="h-48 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${event.thumbnailUrl || '/images/events.jpg'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <div className="text-2xl font-bold text-white">
            {/* Event date display */}
          </div>
          <div className="text-sm text-slate-200">
            {/* Event month display */}
          </div>
        </div>
      </div>
      
      <CardHeader>
        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
        <p className="text-slate-300 text-sm line-clamp-2">{event.description}</p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2 mb-4 text-sm text-slate-400">
          {event.date && (
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-cyan-400" />
              {event.date}
            </div>
          )}
          {event.time && (
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-cyan-400" />
              {eventDate.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          )}
          {event.location && (
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-cyan-400" />
              {event.location}
            </div>
          )}
        </div>

        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {event.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          {type === 'upcoming' && (
            <>
              {event.links?.luma && (
                <Button asChild variant="outline" className="btn-secondary flex-1">
                  <a href={event.links.luma} target="_blank" rel="noopener noreferrer">
                    Register
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
              {event.links?.zoom && (
                <Button asChild variant="outline" className="btn-secondary flex-1">
                  <a href={event.links.zoom} target="_blank" rel="noopener noreferrer">
                    Join
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </>
          )}
          
          {type === 'past' && (
            <>
              {event.links?.recapUrl ? (
                <Button asChild variant="outline" className="btn-secondary flex-1">
                  <a href={event.links.recapUrl} target="_blank" rel="noopener noreferrer">
                    View Recap
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <Button asChild variant="outline" className="btn-secondary flex-1">
                  <Link href={`/events/${event.id}`}>
                    View Details
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}