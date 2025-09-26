'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Play, ExternalLink, ArrowLeft, Clock, Calendar, Users } from 'lucide-react';
import { Linkedin, Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';

interface PodcastDetailPageProps {
  podcast: any; // Replace with proper type
}

export default function PodcastDetailPage({ podcast }: PodcastDetailPageProps) {
  const embedUrl = convertDriveLink(podcast.driveLink || "");
  const publishedDate = new Date(podcast.createdAt);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button asChild variant="ghost" className="mb-6 text-slate-300 hover:text-white">
        <Link href="/podcasts">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Podcasts
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Video Player */}
          <Card className="surface overflow-hidden">
            <div className="relative aspect-video">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allowFullScreen
                title={podcast.title}
              />
            </div>
          </Card>

          {/* Title and metadata */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-4">
              {podcast.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-slate-400 mb-6">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {publishedDate.toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Description */}
          <Card className="surface">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">About this episode</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                {podcast.description}
              </p>
              
              <Separator className="my-6 bg-white/10" />
              
              {/* Platform Links */}
              {(podcast.socialLinks?.linkedin || podcast.socialLinks?.instagram || podcast.socialLinks?.facebook) && (
                <div>
                  <h3 className="font-semibold mb-4">Connect with us</h3>
                  <div className="flex gap-4">
                    {podcast.socialLinks?.linkedin && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={podcast.socialLinks.linkedin} target="_blank">
                          <Linkedin className="mr-2 h-4 w-4" />
                          LinkedIn
                        </Link>
                      </Button>
                    )}
                    {podcast.socialLinks?.instagram && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={podcast.socialLinks.instagram} target="_blank">
                          <Instagram className="mr-2 h-4 w-4" />
                          Instagram
                        </Link>
                      </Button>
                    )}
                    {podcast.socialLinks?.facebook && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={podcast.socialLinks.facebook} target="_blank">
                          <Facebook className="mr-2 h-4 w-4" />
                          Facebook
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper function to convert Google Drive link to embeddable format
function convertDriveLink(driveLink: string): string {
  if (!driveLink) return '';
  
  const fileIdMatch = driveLink.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (fileIdMatch) {
    return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
  }
  return driveLink;
}