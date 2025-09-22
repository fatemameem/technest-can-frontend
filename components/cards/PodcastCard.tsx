import React from 'react';
import Link from 'next/link';
import { Play, LinkedinIcon, FacebookIcon, InstagramIcon, Mic } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface PodcastEpisode {
    id: string;
    title: string;
    date: string; // ISO
    platforms: { name: "LinkedIn" | "Facebook" | "Instagram" | "SoundCloud"; url: string }[];
    embedUrl?: string; // use for iframe on supported platforms
    summary?: string;
    thumbnailUrl: string;
    bgColor: string;
    href?: string;
}
export const platformIcons: { [key: string]: React.ReactNode } = {
    LinkedIn: <LinkedinIcon className="h-5 w-5" />,
    Facebook: <FacebookIcon className="h-5 w-5" />,
    Instagram: <InstagramIcon className="h-5 w-5" />,
    SoundCloud: <Mic className="h-5 w-5" />,
};

const PodcastCard: React.FC<{ podcast: PodcastEpisode }> = ({ podcast }) => {
    const latestPlatformUrl = podcast.platforms.length > 0 ? podcast.platforms[0].url : '#';
    
    return (
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl snap-start">
        <div className={cn("absolute inset-0", podcast.bgColor)}>
            <img
                src={podcast.thumbnailUrl}
                alt={`Cover art for ${podcast.title}`}
                className="h-full w-full object-cover"
                loading="lazy"
            />
        </div>
        <Link
          href={podcast.href || latestPlatformUrl}
          className="absolute text-slate-900 top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-slate-900/20 backdrop-blur-sm transition-colors hover:bg-white/30"
          aria-label={`View ${podcast.title}`}
        >
          <Play className="h-5 w-5 text-slate-900" />
        </Link>
        <div className="absolute inset-x-0 bottom-0 p-6">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent backdrop-blur-sm"></div>
            <div className="relative text-slate-900">
                <h3 className="text-lg text-slate-900 font-bold">{podcast.title}</h3>
                {/* <p className="text-sm text-slate-200 mt-1">{formatDate(podcast.date, { month: 'long', day: 'numeric', year: 'numeric'})}</p> */}
                <div className="flex gap-3 mt-3">
                {podcast.platforms.map((platform) => (
                    <a key={platform.name} href={platform.url} target="_blank" rel="noopener noreferrer" aria-label={`Listen on ${platform.name}`} className="transition-opacity hover:opacity-80">
                    {platformIcons[platform.name] || <Mic className="h-5 w-5" />}
                    </a>
                ))}
                </div>
            </div>
        </div>
        </div>
    );
};

export default PodcastCard;

// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Play, Clock } from 'lucide-react';

// interface PodcastCardProps {
//   podcast: {
//     id: string;
//     title: string;
//     description: string;
//     platform: string;
//     embedId: string;
//     duration: string;
//     date: string;
//   };
// }

// export function PodcastCard({ podcast }: PodcastCardProps) {
//   const embedUrl = podcast.platform === 'youtube' 
//     ? `https://www.youtube.com/embed/${podcast.embedId}`
//     : `https://open.spotify.com/embed/episode/${podcast.embedId}`;

//   return (
//     <Card className="surface hover-lift">
//       <CardContent className="p-0">
//         <div className="aspect-video rounded-t-2xl overflow-hidden bg-slate-800 relative">
//           <iframe
//             src={embedUrl}
//             title={podcast.title}
//             className="w-full h-full"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
//         </div>
//         <div className="p-6">
//           <div className="flex items-center gap-2 mb-3">
//             <Badge variant="outline" className="capitalize border-cyan-400/50 text-cyan-400">
//               {podcast.platform}
//             </Badge>
//             <div className="flex items-center text-slate-400 text-sm">
//               <Clock className="mr-1 h-3 w-3" />
//               {podcast.duration}
//             </div>
//           </div>
//           <h3 className="font-semibold mb-2 line-clamp-2">{podcast.title}</h3>
//           <p className="text-slate-400 text-sm line-clamp-3">{podcast.description}</p>
//           <div className="mt-4 text-xs text-slate-500">
//             {new Date(podcast.date).toLocaleDateString('en-US', { 
//               year: 'numeric', 
//               month: 'long', 
//               day: 'numeric' 
//             })}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }