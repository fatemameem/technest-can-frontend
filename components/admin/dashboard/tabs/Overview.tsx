import React from 'react';
import OverviewSection from '@/components/admin/OverviewSection';

// Update the props interface to include blog stats
interface OverviewTabProps {
  podcastCount: number | null;
  eventCount: number | null;
  blogCount: number | null;  // Add this
  subscriberCount: number | null;
  lastPodcast: { title: string; when: string } | null;
  lastEvent: { title: string; when: string } | null;
  lastBlog: { title: string; when: string } | null;  // Add this
  statsLoading: boolean;
}

export default function OverviewTab({
  podcastCount,
  eventCount,
  blogCount,
  lastPodcast,
  lastEvent,
  lastBlog,
  statsLoading,
  subscriberCount
}: OverviewTabProps) {
  return (
    <OverviewSection
      podcastCount={podcastCount}
      eventCount={eventCount}
      blogCount={blogCount} // Add this
      lastPodcast={lastPodcast}
      lastEvent={lastEvent}
      lastBlog={lastBlog}
      statsLoading={statsLoading}
      subscriberCount={subscriberCount}
    />
  );
}