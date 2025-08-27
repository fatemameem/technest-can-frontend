import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Play, ExternalLink, ArrowLeft, Clock, Calendar, Users } from 'lucide-react';
import { Linkedin, Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPodcasts } from '@/lib/data';
import PodcastsSection from '@/components/sections/PodcastSection';


// export async function generateStaticParams() {
//   const podcasts = await getPodcasts();
//   return podcasts.map((podcast) => ({
//     slug: podcast.slug
//   }));
// }

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
  const rawPodcasts: any[] = await getPodcasts();
    // Map into the shape PodcastCard expects
  const podcasts = (rawPodcasts || []).map((r: any) => ({
    id: r.id ?? crypto.randomUUID?.() ?? String(Math.random()),
    title: r.title ?? "Untitled Podcast",
    description: r.description ?? "Description coming soon.",
    // Prefer timestamp if present, else fall back to 'today' so Date() is valid in the UI
    date: r.timestamp || new Date().toISOString(),
    url: r.driveLink ?? "",
    path: r.path ?? "",
    slug: r.slug ?? "",
    linkedin: r.linkedin ?? "",
    instagram: r.instagram ?? "",
    facebook: r.facebook ?? "",
    thumbnailUrl: r.thumbnailUrl ?? "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
  }));
  const podcast = podcasts.find(p => p.slug === slug);
  
  if (!podcast) {
    notFound();
  }

  const otherPodcasts = podcasts.filter(p => p.slug !== slug);
  const embedUrl = convertDriveLink(podcast.url || "");
  const publishedDate = new Date(podcast.date);

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6 text-slate-300 hover:text-white">
          <Link href="/podcasts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Podcasts
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Video Player and Description */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video Player */}
            <Card className="surface overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video bg-slate-900">
                  <iframe
                    src={embedUrl}
                    title={podcast.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>

            {/* Video Title and Meta */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-4">{podcast.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm mb-4">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {publishedDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                {/* <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {formatDuration(podcast.durationSec)}
                </div>
                {podcast.guests && (
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    {podcast.guests}
                  </div>
                )} */}
              </div>
              
              {/* Tags
              <div className="flex flex-wrap gap-2 mb-6">
                {podcast.tags.split(', ').map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div> */}
            </div>

            {/* Description */}
            <Card className="surface">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">About this episode</h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  {podcast.description}
                </p>
                
                {/* {podcast.takeaways && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Key Takeaways</h3>
                    <p className="text-slate-300 text-sm">{podcast.takeaways}</p>
                  </div>
                )} */}

                <Separator className="my-6 bg-white/10" />
                
                {/* Platform Links */}
                <div>
                  <h3 className="font-semibold mb-4">Watch on other platforms</h3>
                  <div className="flex gap-4">
                    {podcast.linkedin && (
                      <Button variant="outline" size="sm" className="btn-secondary" asChild>
                        <a href={podcast.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="mr-2 h-4 w-4" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {podcast.facebook && (
                      <Button variant="outline" size="sm" className="btn-secondary" asChild>
                        <a href={podcast.facebook} target="_blank" rel="noopener noreferrer">
                          <Facebook className="mr-2 h-4 w-4" />
                          Facebook
                        </a>
                      </Button>
                    )}
                    {podcast.instagram && (
                      <Button variant="outline" size="sm" className="btn-secondary" asChild>
                        <a href={podcast.instagram} target="_blank" rel="noopener noreferrer">
                          <Instagram className="mr-2 h-4 w-4" />
                          Instagram
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Watch Next Section (Mobile) */}
            <div className="lg:hidden">
              <h2 className="text-xl font-semibold mb-4">Watch Next</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherPodcasts.slice(0, 4).map((episode) => (
                  <WatchNextCard key={episode.id} episode={episode} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Learn More */}
          <div className="lg:col-span-1 space-y-6">
            {/* Learn More Section */}
            <Card className="surface">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Learn More</h2>
                <div className="space-y-4">
                  {learnMore?.map((item, index) => (
                    <a
                      key={index}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group hover-lift"
                    >
                      <div className="flex gap-3">
                        <div 
                          className="w-20 h-14 bg-cover bg-center rounded-lg flex-shrink-0"
                          style={{ backgroundImage: `url(${item.thumbnail})` }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-cyan-400 transition-colors">
                            <span>{item.title}</span>
                          </h3>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Watch Next Section (Desktop) */}
            <div className="hidden lg:block">
              <h2 className="text-lg font-semibold mb-4">Watch Next</h2>
              <div className="space-y-4">
                {otherPodcasts.slice(0, 3).map((episode) => (
                  <WatchNextCard key={episode.id} episode={episode} compact />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Watch Next Section (Desktop Full Width) */}
        <div className="hidden lg:block mt-12">
          {/* <h2 className="text-2xl font-semibold mb-6">More Episodes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPodcasts.map((episode) => (
              <WatchNextCard key={episode.id} episode={episode} />
            ))}
          </div> */}
          <PodcastsSection podcasts={podcasts} title="More Episodes" badge="Watch Next" showAllBtn={false} />
        </div>
      </div>
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