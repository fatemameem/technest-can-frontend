import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { Linkedin, Facebook, Instagram } from 'lucide-react';
// import sampleData from '@/data/sample.json';
import { EpisodeCard } from '@/components/cards/EpisodeCard';
import Link from 'next/link';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
// import type { Metadata } from 'next'

export const dynamic = 'force-dynamic';
// export const runtime = 'nodejs';

// export const metadata: Metadata = {
//   title: 'Podcasts | TECH-NEST',
//   description: 'All podcast episodes on cybersecurity and AI ethics.',
// };

export default async function Podcasts() {
  const payload = await getPayload({ config: configPromise });
  const res = await payload.find({
    collection: 'podcasts',
    where: { published: { equals: true } },
    sort: '-createdAt',
    limit: 100,
    overrideAccess: true,
  });
  const rawPodcasts = res.docs || [];
  console.log("Fetched podcasts:", rawPodcasts);
  // Map into the shape PodcastCard expects
  const mappedPodcasts = (rawPodcasts || []).map((r: any) => ({
    id: r.id,
    title: r.title ?? 'Untitled Podcast',
    description: r.description ?? '',
    date: r.createdAt ?? '',
    url: r.driveLink ?? '',
    path: r.driveLink ?? '/podcasts',
    linkedin: r.socialLinks?.linkedin ?? '',
    instagram: r.socialLinks?.instagram ?? '',
    facebook: r.socialLinks?.facebook ?? '',
  }));

  const latestEpisode = mappedPodcasts[0] || {
    id: "placeholder",
    title: "Loading podcast...",
    description: "",
    date: "",
    url: "",
    path: "#",
    linkedin: "",
    instagram: "",
    facebook: "",
  };
  
  // const otherEpisodes = mappedPodcasts.slice(1);

  return (
    <>
      {/* Hero section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)`
          }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
        
        {/* Social Media Icons - Top Right */}
        <div className="absolute top-8 right-8 flex gap-4 z-20">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 text-cyan-400/80 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300"
            asChild
          >
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-6 w-6" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 text-cyan-400/80 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300"
            asChild
          >
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Facebook className="h-6 w-6" />
              <span className="sr-only">Facebook</span>
            </a>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 text-cyan-400/80 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300"
            asChild
          >
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </a>
          </Button>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
            Elevate Your Mind,
            <br />
            Transform Your World
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            {latestEpisode.title}
          </p>
          
          <Button 
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(34,211,238,0.25)]"
            asChild
          >
            <Link href={latestEpisode.path} rel="noopener noreferrer">
              <Play className="mr-2 h-5 w-5" />
              Latest Episode
            </Link>
          </Button>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </div>

      {/* Episodes Grid Section */}
      <section className="py-16 bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">All Episodes</h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Explore our complete collection of cybersecurity and AI ethics discussions
            </p>
          </div>
          
          {/* Episodes Grid */}
          <div className="flex flex-wrap gap-8 justify-center">
            {mappedPodcasts.length > 0 ? (
              mappedPodcasts.map((episode) => (
                <div
                  key={episode.id}
                  className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] flex justify-center"
                >
                  <EpisodeCard episode={episode} />
                </div>
              ))
            ) : (
              <p className="text-white/70">Loading episodes...</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

// export const dynamic = "force-dynamic";
