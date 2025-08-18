import React, { useState, useMemo, useEffect } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import Container from '../components/Container';
import Section from '../components/Section';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { cn, formatDate, getUpcomingEvents, getPastEvents } from '../lib/utils';
import { EventItem, PodcastEpisode } from '../types';
import { LogIn, Calendar, Video, Settings, Lock } from 'lucide-react';

const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => (
  <Section>
    <Container className="max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lock /> Admin Access</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 dark:text-slate-300 mb-4">This is a UI-only demonstration of the admin panel.</p>
          <div className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="text-slate-700 dark:text-slate-300">Email</label>
              <Input id="admin-email" type="email" defaultValue="admin@technest.dev" disabled />
            </div>
            <div>
              <label htmlFor="admin-password" className="text-slate-700 dark:text-slate-300">Password</label>
              <Input id="admin-password" type="password" defaultValue="************" disabled />
            </div>
            <Button onClick={onLogin} className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Mock Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </Container>
  </Section>
);

const AdminDashboard: React.FC = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState('events');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [eventsResponse, podcastsResponse] = await Promise.all([
                    fetch('/data/events.json'),
                    fetch('/data/podcasts.json')
                ]);
                if (!eventsResponse.ok || !podcastsResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const eventsData = await eventsResponse.json();
                const podcastsData = await podcastsResponse.json();
                setEvents(eventsData);
                setPodcasts(podcastsData);
            } catch (error) {
                console.error("Failed to load admin data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const upcomingEvents = useMemo(() => getUpcomingEvents(events), [events]);
    const pastEvents = useMemo(() => getPastEvents(events), [events]);
    
    if(loading) {
        return (
            <div className="flex">
                <aside className="w-64 bg-slate-800 text-white p-4 min-h-screen">
                    <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
                    <div className="space-y-2">
                        <div className="h-10 bg-slate-700 rounded-lg animate-pulse"></div>
                        <div className="h-10 bg-slate-700 rounded-lg animate-pulse"></div>
                        <div className="h-10 bg-slate-700 rounded-lg animate-pulse"></div>
                    </div>
                </aside>
                <main className="flex-1 p-8 bg-slate-100 dark:bg-slate-950">
                    <div className="h-10 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-6"></div>
                    <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
                </main>
            </div>
        );
    }
    
    return (
        <div className="flex">
            <aside className="w-64 bg-slate-800 text-white p-4 min-h-screen">
                <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
                <nav className="space-y-2">
                    <button onClick={() => setActiveView('events')} className={cn('w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg', activeView === 'events' ? 'bg-blue-600' : 'hover:bg-slate-700')}>
                        <Calendar size={18} /> Events
                    </button>
                     <button onClick={() => setActiveView('podcasts')} className={cn('w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg', activeView === 'podcasts' ? 'bg-blue-600' : 'hover:bg-slate-700')}>
                        <Video size={18} /> Podcasts
                    </button>
                    <button onClick={() => {}} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700 text-slate-400 cursor-not-allowed">
                        <Settings size={18} /> Settings
                    </button>
                </nav>
            </aside>
            <main className="flex-1 p-8 bg-slate-100 dark:bg-slate-950">
                {activeView === 'events' && (
                    <div>
                        <h1 className="text-3xl font-bold mb-6">Manage Events</h1>
                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming Events</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <EventsTable events={upcomingEvents} />
                            </CardContent>
                        </Card>
                         <Card className="mt-8">
                            <CardHeader>
                                <CardTitle>Past Events</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <EventsTable events={pastEvents} />
                            </CardContent>
                        </Card>
                    </div>
                )}
                 {activeView === 'podcasts' && (
                    <div>
                        <h1 className="text-3xl font-bold mb-6">Podcasts</h1>
                        <Card>
                            <CardHeader><CardTitle>Podcast List (Read-only)</CardTitle></CardHeader>
                            <CardContent>
                                <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {podcasts.map(p => (
                                        <li key={p.id} className="py-3">
                                            <p className="font-semibold">{p.title}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(p.date, { year: 'numeric', month: 'short', day: 'numeric'})}</p>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}

const EventsTable: React.FC<{ events: EventItem[] }> = ({ events }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                {events.map(event => (
                    <tr key={event.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{event.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{formatDate(event.start, { month: 'short', day: 'numeric', year: 'numeric'})}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{event.location.details}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-400">Edit</button>
                            <button className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">Copy Link</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const AdminPage: React.FC = () => {
  usePageTitle('Admin Dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <div className="bg-slate-900 text-white p-2 text-center text-sm">
        Admin Panel Demonstration
        <Button onClick={() => setIsLoggedIn(!isLoggedIn)} size="sm" variant="secondary" className="ml-4">
          {isLoggedIn ? 'Mock Logout' : 'Toggle Login State'}
        </Button>
      </div>
      {isLoggedIn ? <AdminDashboard /> : <AdminLogin onLogin={() => setIsLoggedIn(true)} />}
    </>
  );
};

export default AdminPage;