import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ExternalLink, MapPin } from 'lucide-react';

interface EventCalloutProps {
  event: {
    id: string;
    title: string;
    date: string;
    rawDate: string;
    // time: string;
    timeStart: string;
    timeEnd: string;
    timeZone: string;
    location: string;
    description: string;
    tags: string[];
    links?: {
      luma?: string;
      zoom?: string;
    };
  }
}

export function EventCallout({ event }: EventCalloutProps) {
  const eventDate = new Date(`${event.rawDate}`);
  // console.log(event.rawDate, event.timeStart, eventDate);

  return (
    <Card className="surface glow-cyan max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl mb-2">Next Event</CardTitle>
            <h3 className="text-xl text-cyan-400">{event.title}</h3>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-cyan-400">
              {eventDate.getDate()}
            </div>
            <div className="text-sm text-slate-400">
              {eventDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-slate-300 mb-6">{event.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center text-slate-300">
            <Calendar className="mr-2 h-4 w-4 text-cyan-400" />
            {eventDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div className="flex items-center text-slate-300">
            <Clock className="mr-2 h-4 w-4 text-cyan-400" />
            {/* {eventDate.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })} */}
            {event.timeStart} - {event.timeEnd} {event.timeZone}
          </div>
          <div className="flex items-center text-slate-300">
            <MapPin className="mr-2 h-4 w-4 text-cyan-400" />
            {event.location}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {event.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="btn-primary flex-1"> 
            <a href={`${event.links?.luma}`} target='_blank'>Register</a> <ExternalLink className="ml-2 h-5 w-5"/></Button>
          <Button asChild variant="outline" className="btn-secondary flex-1">
            <a href="/events">View All Events</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}