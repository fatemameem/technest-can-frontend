import { Hero } from '@/components/ui/hero';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ArrowLeft, ExternalLink } from 'lucide-react';
import { notFound } from 'next/navigation';

// This would typically come from a database or API
const getEventDetails = (slug: string) => {
  const eventDetails = {
    'security-training-2023': {
      title: 'Advanced Security Training',
      date: '2023-12-08',
      time: '10:00',
      location: 'Boston Convention Center',
      description: 'Comprehensive training on advanced threat detection and incident response.',
      cover: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop',
      tags: ['Training', 'Incident Response', 'Threat Detection'],
      overview: 'This intensive training session covered the latest techniques in cybersecurity threat detection and incident response. Over 150 security professionals attended to enhance their skills in identifying and mitigating advanced persistent threats.',
      agenda: [
        { time: '09:00', title: 'Registration & Welcome Coffee' },
        { time: '10:00', title: 'Keynote: The Evolving Threat Landscape' },
        { time: '11:30', title: 'Workshop: Advanced Threat Hunting Techniques' },
        { time: '13:00', title: 'Lunch Break' },
        { time: '14:00', title: 'Incident Response Simulation' },
        { time: '15:30', title: 'Panel: Lessons from Real-World Breaches' },
        { time: '16:30', title: 'Q&A and Networking' },
      ],
      speakers: [
        { name: 'Dr. Sarah Chen', role: 'CEO, TECH-NEST' },
        { name: 'Mike Rodriguez', role: 'Lead Security Consultant' },
        { name: 'Alex Thompson', role: 'Former FBI Cyber Division' },
      ],
      resources: [
        { title: 'Threat Hunting Playbook', type: 'PDF', link: '#' },
        { title: 'Incident Response Checklist', type: 'PDF', link: '#' },
        { title: 'Training Slides', type: 'PowerPoint', link: '#' },
        { title: 'Video Recording', type: 'Video', link: '#' },
      ]
    },
    'tech-ethics-panel': {
      title: 'Technology Ethics Panel',
      date: '2023-11-20',
      time: '18:00',
      location: 'University Auditorium',
      description: 'Panel discussion with experts on emerging technology ethics challenges.',
      cover: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop',
      tags: ['Panel', 'Ethics', 'Technology'],
      overview: 'A thought-provoking panel discussion bringing together leading experts in AI ethics, technology policy, and digital rights to explore the challenges and opportunities in emerging technology ethics.',
      agenda: [
        { time: '17:30', title: 'Registration & Networking' },
        { time: '18:00', title: 'Welcome & Introduction' },
        { time: '18:15', title: 'Panel Discussion: AI Ethics in Practice' },
        { time: '19:00', title: 'Audience Q&A' },
        { time: '19:30', title: 'Closing Remarks & Reception' },
      ],
      speakers: [
        { name: 'Dr. Aisha Patel', role: 'AI Ethics Researcher, TECH-NEST' },
        { name: 'Prof. John Davis', role: 'Technology Policy Institute' },
        { name: 'Maria Santos', role: 'Director of Digital Rights, TechForGood' },
      ],
      resources: [
        { title: 'AI Ethics Framework', type: 'PDF', link: '#' },
        { title: 'Panel Discussion Recording', type: 'Video', link: '#' },
        { title: 'Recommended Reading List', type: 'PDF', link: '#' },
      ]
    }
  };
  
  return eventDetails[slug as keyof typeof eventDetails];
};

export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEventDetails(slug);
  
  if (!event) {
    return notFound();
  }
  
  const eventDate = new Date(`${event.date}T${event.time}`);
  
  return (
    <>
      {/* Hero with event cover */}
      <div 
        className="relative h-64 lg:h-80 bg-cover bg-center"
        style={{ backgroundImage: `url(${event.cover})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
          <div>
            <Button asChild variant="ghost" className="mb-4 text-slate-300 hover:text-white">
              <Link href="/events">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Events
              </Link>
            </Button>
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Event Details */}
      <Section>
        <div className="max-w-4xl mx-auto">
          {/* Event Info */}
          <Card className="surface mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-slate-300">
                  <Calendar className="mr-2 h-4 w-4 text-cyan-400" />
                  {eventDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                <div className="flex items-center text-slate-300">
                  <Clock className="mr-2 h-4 w-4 text-cyan-400" />
                  {eventDate.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
                <div className="flex items-center text-slate-300">
                  <MapPin className="mr-2 h-4 w-4 text-cyan-400" />
                  {event.location}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Content Sections */}
          <div className="space-y-8">
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <Card className="surface">
                <CardContent className="p-6">
                  <p className="text-slate-300 leading-relaxed">{event.overview}</p>
                </CardContent>
              </Card>
            </section>
            
            {/* Agenda */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Agenda</h2>
              <Card className="surface">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {event.agenda.map((item, index) => (
                      <div key={index} className="flex gap-4 pb-4 border-b border-white/5 last:border-b-0 last:pb-0">
                        <div className="text-cyan-400 font-mono text-sm min-w-16">
                          {item.time}
                        </div>
                        <div className="text-slate-300">
                          {item.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
            
            {/* Speakers */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Speakers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {event.speakers.map((speaker, index) => (
                  <Card key={index} className="surface">
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold mb-1">{speaker.name}</h3>
                      <p className="text-slate-400 text-sm">{speaker.role}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
            
            {/* Resources */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Resources</h2>
              <Card className="surface">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.resources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                        <div>
                          <div className="font-medium">{resource.title}</div>
                          <div className="text-slate-400 text-sm">{resource.type}</div>
                        </div>
                        <Button variant="ghost" size="icon" className="focus-ring" asChild>
                          <a href={resource.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">Open {resource.title}</span>
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </Section>
    </>
  );
}

// export const dynamic = "force-dynamic";