"use client";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Calendar, Users } from 'lucide-react';

export default function OverviewSection({
  podcastCount,
  eventCount,
  subscriberCount,
  lastPodcast,
  lastEvent,
  statsLoading,
}: {
  podcastCount: number | null;
  eventCount: number | null;
  subscriberCount: number | null;
  lastPodcast: { title: string; when: string } | null;
  lastEvent: { title: string; when: string } | null;
  statsLoading: boolean;
}) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="surface">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Podcasts</p>
                <p className="text-2xl font-bold text-cyan-400">{podcastCount ?? (statsLoading ? '…' : 0)}</p>
              </div>
              <Mic className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="surface">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Events</p>
                <p className="text-2xl font-bold text-blue-400">{eventCount ?? (statsLoading ? '…' : 0)}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="surface">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Newsletter Subscribers</p>
                <p className="text-2xl font-bold text-green-400">{subscriberCount ?? (statsLoading ? '…' : 0)}</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="surface mt-6">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 border border-white/10 rounded-lg">
              <Mic className="h-5 w-5 text-cyan-400" />
              <div className="flex-1">
                <p className="font-medium">New podcast published</p>
                <p className="text-slate-400 text-sm">{lastPodcast ? lastPodcast.title : (statsLoading ? 'Loading…' : 'No podcasts yet')}</p>
              </div>
              <Badge variant="secondary">{lastPodcast ? lastPodcast.when : (statsLoading ? '…' : '—')}</Badge>
            </div>
            <div className="flex items-center space-x-3 p-3 border border-white/10 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-400" />
              <div className="flex-1">
                <p className="font-medium">Event scheduled</p>
                <p className="text-slate-400 text-sm">{lastEvent ? lastEvent.title : (statsLoading ? 'Loading…' : 'No events yet')}</p>
              </div>
              <Badge variant="secondary">{lastEvent ? lastEvent.when : (statsLoading ? '…' : '—')}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

