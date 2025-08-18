
import React from 'react';
import { useAppContext } from '../../context/AppContext.js';
import { getUpcomingEvents, getPastEvents } from '../../lib/utils.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.js';

const AdminDashboard = () => {
    const { events, podcasts, team, registrations } = useAppContext();

    const upcomingEvents = getUpcomingEvents(events);
    const pastEvents = getPastEvents(events);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{upcomingEvents.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Past Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{pastEvents.length}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Total Registrations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{registrations.length}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Podcast Episodes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{podcasts.length}</p>
                    </CardContent>
                </Card>
            </div>
             <div className="mt-10 bg-dark-surface p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Welcome, Admin!</h3>
                <p className="text-dark-text-secondary">
                    This is your control panel for TECH-NEST. You can manage events, view content, and monitor registrations.
                    Remember, any changes made here are for this session only and will not be saved permanently.
                </p>
            </div>
        </div>
    );
};

export default AdminDashboard;