import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { Play } from "lucide-react";

interface WatchNextCardProps {
  episode: any;
  compact?: boolean;
}

export default function WatchNextCard({ episode, compact = false }: WatchNextCardProps) {
  const publishedDate = new Date(episode.date);
  
  return (
    <Link href={`/podcasts/podcast/${episode.slug}`} className="block group">
      <Card className="surface hover-lift overflow-hidden">
        <CardContent className="p-0">
          <div className={`${compact ? 'aspect-video' : 'aspect-video'} bg-cover bg-center relative`}
                style={{ backgroundImage: `url(${episode.thumbnailUrl})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-blue-600 rounded-full p-3">
                <Play className="h-6 w-6 text-white fill-current" />
              </div>
            </div>
            {/* <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {formatDuration(episode.durationSec)}
            </div> */}
          </div>
          <div className="p-4">
            <h3 className="font-semibold line-clamp-2 group-hover:text-cyan-400 transition-colors mb-2">
              {episode.title}
            </h3>
            <div className="text-slate-400 text-xs">
              {publishedDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}