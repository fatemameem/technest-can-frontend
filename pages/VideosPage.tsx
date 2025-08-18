import React from 'react';
import { Video, Search, SlidersHorizontal } from 'lucide-react';

import { usePageTitle } from '../hooks/usePageTitle';
import Container from '../components/Container';
import Section from '../components/Section';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const VideoPlaceholderCard: React.FC = () => (
  <Card className="overflow-hidden">
    <div className="aspect-video bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
      <Video className="h-12 w-12 text-slate-400 dark:text-slate-600" />
    </div>
    <div className="p-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4"></div>
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2 mt-2"></div>
      <div className="mt-4">
        <Badge variant="secondary">Coming Soon</Badge>
      </div>
    </div>
  </Card>
);

const VideosPage: React.FC = () => {
  usePageTitle('Video Tutorials');

  return (
    <>
      <Section className="bg-slate-100 dark:bg-slate-900">
        <Container className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl md:text-6xl">Video Tutorials</h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-700 dark:text-slate-300">
            Our library of video tutorials is currently under construction. Check back soon for practical guides on digital safety.
          </p>
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input placeholder="Search videos..." className="pl-10" disabled />
            </div>
            <Button variant="outline" disabled>
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <VideoPlaceholderCard key={index} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
};

export default VideosPage;