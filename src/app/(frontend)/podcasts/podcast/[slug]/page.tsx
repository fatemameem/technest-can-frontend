import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Play, ExternalLink, ArrowLeft, Clock, Calendar, Users } from 'lucide-react';
import { Linkedin, Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import PodcastDetailPage from './PodcastDetailPage';

export const dynamic = 'force-dynamic';

// Helper function to convert Google Drive link to embeddable format
function convertDriveLink(driveLink: string): string {
  const fileIdMatch = driveLink.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (fileIdMatch) {
    return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
  }
  return driveLink;
}

// Helper function to format duration
function formatDuration(seconds: string): string {
  const secs = parseInt(seconds);
  const minutes = Math.floor(secs / 60);
  const remainingSeconds = secs % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

const learnMore = [
  {
    title: 'Understanding Deepfakes: A Practical Guide',
    link: 'https://owasp.org/www-project-top-ten/',
    thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=640',
  },
  {
    title: 'How to Spot AI-Generated Media',
    link: 'https://www.ncsc.gov.uk/collection/top-tips-for-staying-secure-online',
    thumbnail: 'https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=640',
  },
  {
    title: 'Digital Footprints and Privacy Basics',
    link: 'https://www.consumer.ftc.gov/articles/how-protect-your-privacy-online',
    thumbnail: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=640',
  },
];

export default async function PodcastDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });
  
  const res = await payload.find({
    collection: 'podcasts',
    where: { 
      and: [
        { slug: { equals: slug } },
        { published: { equals: true } }
      ]
    },
    limit: 1,
    overrideAccess: true,
  });
  
  if (!res.docs || res.docs.length === 0) {
    console.log(`Podcast not found for slug: ${slug}`);
    notFound();
  }
  
  const doc = res.docs[0];
  
  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      <PodcastDetailPage podcast={doc} />
    </div>
  );
}

interface WatchNextCardProps {
  episode: any;
  compact?: boolean;
}

function WatchNextCard({ episode, compact = false }: WatchNextCardProps) {
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
// export const dynamic = "force-dynamic";
