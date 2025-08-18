'use client';

import { useState } from 'react';
import { Hero } from '@/components/ui/hero';
import { Section } from '@/components/ui/section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCard } from '@/components/cards/EventCard';
import sampleData from '@/data/sample.json';

export default function Events() {
  return (
    <>
      <Hero
        title="Events"
        subtitle="Join us for workshops, conferences, and training sessions focused on cybersecurity and AI ethics."
      />

      <Section>
        <Tabs defaultValue="upcoming" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 surface">
            <TabsTrigger value="upcoming" className="focus-ring">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past" className="focus-ring">Past Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sampleData.events.upcoming.map((event) => (
                <EventCard key={event.id} event={event} type="upcoming" />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="past" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sampleData.events.past.map((event) => (
                <EventCard key={event.id} event={event} type="past" />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Section>
    </>
  );
}