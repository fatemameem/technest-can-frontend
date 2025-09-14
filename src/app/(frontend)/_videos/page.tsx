import { Hero } from '@/components/ui/hero';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { Play, Search, Filter, ArrowRight } from 'lucide-react';

export default function Videos() {
  // Mock video data for placeholder
  const mockVideos = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: `Cybersecurity Tutorial ${i + 1}`,
    duration: '12:34',
    category: i % 2 === 0 ? 'Cybersecurity' : 'AI Ethics',
  }));

  return (
    <>
      <Hero
        title="Video Tutorials"
        subtitle="Comprehensive video content on cybersecurity best practices and AI ethics principles."
      >
        <Badge variant="outline" className="border-amber-500/50 text-amber-400 mb-8">
          Coming Soon
        </Badge>
      </Hero>

      <Section>
        <div className="max-w-6xl mx-auto">
          {/* Filters - Disabled */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search videos..." 
                  className="pl-10 bg-slate-800/50"
                  disabled
                />
              </div>
            </div>
            <Select disabled>
              <SelectTrigger className="w-48 bg-slate-800/50">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                <SelectItem value="ai-ethics">AI Ethics</SelectItem>
                <SelectItem value="training">Training</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Video Grid - Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {mockVideos.map((video) => (
              <Card key={video.id} className="surface opacity-50">
                <CardContent className="p-0">
                  <div className="aspect-video bg-slate-800 rounded-t-2xl flex items-center justify-center relative">
                    <Play className="h-16 w-16 text-slate-600" />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {video.category}
                    </Badge>
                    <h3 className="font-semibold text-slate-400">{video.title}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Coming Soon Message */}
          <Card className="surface max-w-2xl mx-auto text-center">
            <CardContent className="p-8">
              <Play className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Video Library Coming Soon</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                We're creating a comprehensive library of video tutorials covering cybersecurity fundamentals, 
                advanced threat detection, AI ethics frameworks, and hands-on training modules.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 border border-white/10 rounded-lg">
                  <h3 className="font-semibold mb-2">Beginner Friendly</h3>
                  <p className="text-slate-400 text-sm">
                    Step-by-step tutorials for cybersecurity newcomers
                  </p>
                </div>
                <div className="p-4 border border-white/10 rounded-lg">
                  <h3 className="font-semibold mb-2">Expert Level</h3>
                  <p className="text-slate-400 text-sm">
                    Advanced techniques and in-depth analysis
                  </p>
                </div>
              </div>
              <div className="border-t border-white/10 pt-6">
                <p className="text-slate-400 mb-4">
                  Get notified when we launch or explore our other content:
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="btn-primary">
                    <Link href="/contact">
                      Get Notified
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="btn-secondary">
                    <Link href="/events">View Events</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}