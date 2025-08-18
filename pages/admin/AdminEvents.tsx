
import React from 'react';
import { useAppContext } from '../../context/AppContext.js';
import { EventItem } from '../../types.js';
import { formatDate } from '../../lib/utils.js';
import { Button } from '../../components/ui/Button.js';
import { downloadCSV } from '../../lib/utils.js';

const AdminEvents = () => {
    const { events, getRegistrationsByEventId, addEvent } = useAppContext();

    const handleExport = (event: EventItem) => {
        const registrationData = getRegistrationsByEventId(event.id);
        if (registrationData.length > 0) {
            downloadCSV(registrationData, `registrations-${event.slug}`);
        } else {
            alert('No registrations for this event.');
        }
    };
    
    // NOTE: In a real app, creating/editing would open a form/dialog.
    // For this mock, we'll just have a placeholder button. A full form is out of scope for this UI-only example.
    const handleCreateEvent = () => {
        const newEvent: Omit<EventItem, 'id' | 'slug'> = {
            title: "New Sample Event",
            summary: "This is a new event created from the admin panel.",
            description: "Full description of the new sample event.",
            start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            location: { type: "virtual", details: "Online" },
            tags: ["workshop"],
        };
        addEvent(newEvent);
        alert('A new sample event has been added to the list for this session.');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Events</h2>
                <Button onClick={handleCreateEvent}>Create New Event</Button>
            </div>
            <div className="bg-dark-surface rounded-lg overflow-hidden border border-slate-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-900 text-xs text-dark-meta uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-3">Title</th>
                                <th scope="col" className="px-6 py-3">Start Date</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Registrations</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(event => {
                                const isPast = new Date(event.start) < new Date();
                                const registrationCount = getRegistrationsByEventId(event.id).length;
                                return (
                                    <tr key={event.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-medium text-dark-text-primary whitespace-nowrap">{event.title}</td>
                                        <td className="px-6 py-4 text-dark-text-secondary">{formatDate(event.start)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${isPast ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                                {isPast ? 'Past' : 'Upcoming'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-dark-text-secondary">{registrationCount}</td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <Button variant="secondary" size="sm" onClick={() => alert('Edit functionality is a mock.')}>Edit</Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleExport(event)}>Export CSV</Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminEvents;