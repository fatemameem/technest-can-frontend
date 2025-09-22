import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
import Link from 'next/link';
// import { RegisterDialog } from '@/components/events/RegisterDialog';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    thumbnailUrl?: string; // Change from cover to thumbnailUrl
    description: string;
    date?: string;
    time?: string;
    location?: string;
    topic?: string;
    tags?: string[];
    links?: {
      luma?: string;
      zoom?: string;
      url?: string; // For past events, link to recap page
    };
    sponsors?: string[];
  };
  type: 'upcoming' | 'past';
}

export function EventCard({ event, type }: EventCardProps) {
  // const eventDate = new Date(`${event.date}T${event.time}`);
  const eventDate = new Date(`${event.date}`);

  
  return (
    <Card className="surface hover-lift overflow-hidden">
      <div 
        className="h-48 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${event.thumbnailUrl || '/images/events.jpg'})` }} // Use thumbnailUrl with fallback
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <div className="text-2xl font-bold text-white">
            {/* {eventDate.getDate()} */}
            {/* {event.date} */}
          </div>
          <div className="text-sm text-slate-200">
            {/* {eventDate.toLocaleDateString('en-US', { month: 'short' })} */}
            {/* {event.date} */}
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
            {/* {eventDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })} */}
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
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-cyan-400" />
            {event.location}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags?.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2">
          {type === 'upcoming' ? (
            <Button asChild className="btn-primary flex-1">
              <a href={`${event.links?.luma}`} target="_blank" rel="noopener noreferrer">
                Register
                <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </Button>
          ) : (
            <Button asChild variant="outline" className="btn-secondary flex-1">
              <Link href={`/events/${event.links?.url || event.id}`}>
                View Recap
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}