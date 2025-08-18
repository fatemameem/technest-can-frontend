
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { EventItem, PodcastEpisode, TeamMember, Registration } from '../types.js';
import { slugify } from '../lib/utils.js';

interface AppContextType {
  events: EventItem[];
  podcasts: PodcastEpisode[];
  team: TeamMember[];
  registrations: Registration[];
  loading: boolean;
  error: Error | null;
  addRegistration: (registration: Omit<Registration, 'id' | 'registeredAt'>) => void;
  getRegistrationsByEventId: (eventId: string) => Registration[];
  isRegistered: (eventId: string) => boolean;
  addEvent: (event: Omit<EventItem, 'id' | 'slug'>) => void;
  updateEvent: (event: EventItem) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // A simple client-side session storage to persist registrations for the session
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(() => {
    const stored = sessionStorage.getItem('registeredEventIds');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsRes, podcastsRes, teamRes] = await Promise.all([
          fetch('/data/events.json'),
          fetch('/data/podcasts.json'),
          fetch('/data/team.json'),
        ]);

        if (!eventsRes.ok || !podcastsRes.ok || !teamRes.ok) {
            throw new Error('Failed to fetch data');
        }
        
        const eventsData = await eventsRes.json();
        const podcastsData = await podcastsRes.json();
        const teamData = await teamRes.json();

        setEvents(eventsData);
        setPodcasts(podcastsData);
        setTeam(teamData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addRegistration = useCallback((registration: Omit<Registration, 'id' | 'registeredAt'>) => {
    const newRegistration: Registration = {
      ...registration,
      id: crypto.randomUUID(),
      registeredAt: new Date().toISOString(),
    };
    setRegistrations(prev => [...prev, newRegistration]);
    setRegisteredEventIds(prev => {
        const newSet = new Set(prev);
        newSet.add(registration.eventId);
        sessionStorage.setItem('registeredEventIds', JSON.stringify(Array.from(newSet)));
        return newSet;
    });
  }, []);
  
  const getRegistrationsByEventId = useCallback((eventId: string) => {
    return registrations.filter(r => r.eventId === eventId);
  }, [registrations]);
  
  const isRegistered = useCallback((eventId: string) => {
    return registeredEventIds.has(eventId);
  }, [registeredEventIds]);

  const addEvent = useCallback((event: Omit<EventItem, 'id' | 'slug'>) => {
      const newEvent: EventItem = {
          ...event,
          id: crypto.randomUUID(),
          slug: slugify(event.title)
      };
      setEvents(prev => [newEvent, ...prev]);
  }, []);

  const updateEvent = useCallback((updatedEvent: EventItem) => {
      setEvents(prev => prev.map(event => event.id === updatedEvent.id ? updatedEvent : event));
  }, []);

  return (
    <AppContext.Provider value={{ events, podcasts, team, registrations, loading, error, addRegistration, getRegistrationsByEventId, isRegistered, addEvent, updateEvent }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};