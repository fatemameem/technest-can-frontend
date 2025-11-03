import 'server-only';
import { Card, CardContent } from '@/components/ui/card';
import { Play} from 'lucide-react';
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


// export const dynamic = "force-dynamic";
