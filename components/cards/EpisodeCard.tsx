import { ExternalLink, Linkedin, Play } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface EpisodeCardProps {
  episode: {
    id: string;
    title: string;
    description: string;
    platform: string;
    embedId: string;
    duration: string;
    date: string;
  };
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <Card className="relative group overflow-hidden rounded-2xl aspect-square w-full max-w-sm hover-lift bg-[rgb(20,24,31)] border border-white/10">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ 
          backgroundImage: `url(https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop)`
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      
      {/* Content */}
      <CardContent className="relative h-full flex flex-col justify-end p-6 text-white">
        {/* Episode Info */}
        <div className="mb-4">
          <Badge variant="outline" className="mb-2 border-cyan-400/50 text-cyan-400 capitalize">
            {episode.platform}
          </Badge>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">
            {episode.title}
          </h3>
          <p className="text-white/80 text-sm">
            {episode.duration} • {new Date(episode.date).toLocaleDateString()}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button 
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 shadow-[0_0_30px_rgba(34,211,238,0.25)]"
            asChild
          >
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Play className="mr-2 h-4 w-4" />
              Watch Now
            </a>
          </Button>
          
          {/* Platform Icons */}
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-cyan-400/80 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300"
              asChild
            >
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-cyan-400/80 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300"
              asChild
            >
              <a href="#" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">External Link</span>
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}