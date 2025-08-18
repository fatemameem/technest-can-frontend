import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Clock } from 'lucide-react';

interface PodcastCardProps {
  podcast: {
    id: string;
    title: string;
    description: string;
    platform: string;
    embedId: string;
    duration: string;
    date: string;
  };
}

export function PodcastCard({ podcast }: PodcastCardProps) {
  const embedUrl = podcast.platform === 'youtube' 
    ? `https://www.youtube.com/embed/${podcast.embedId}`
    : `https://open.spotify.com/embed/episode/${podcast.embedId}`;

  return (
    <Card className="surface hover-lift">
      <CardContent className="p-0">
        <div className="aspect-video rounded-t-2xl overflow-hidden bg-slate-800 relative">
          <iframe
            src={embedUrl}
            title={podcast.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="capitalize border-cyan-400/50 text-cyan-400">
              {podcast.platform}
            </Badge>
            <div className="flex items-center text-slate-400 text-sm">
              <Clock className="mr-1 h-3 w-3" />
              {podcast.duration}
            </div>
          </div>
          <h3 className="font-semibold mb-2 line-clamp-2">{podcast.title}</h3>
          <p className="text-slate-400 text-sm line-clamp-3">{podcast.description}</p>
          <div className="mt-4 text-xs text-slate-500">
            {new Date(podcast.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}