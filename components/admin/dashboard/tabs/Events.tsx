import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ChevronLeft, ChevronRight, Plus, Save, Loader2 } from 'lucide-react';
import { EventForm } from '@/types';
import EventFormCard from '@/components/admin/forms/EventFormCard';

// Add deletingItemId to props
interface EventsTabProps {
  eventForms: EventForm[];
  showEventForm: boolean;
  editMode: {
    events?: boolean;
    [key: string]: boolean | undefined;
  };
  isSubmittingEvents: boolean;
  events: any[]; // Add this for real data
  loadingEvents: boolean; // Add this for loading state
  deletingItemId: string | null;
  actions: {
    addEventForm: () => void;
    removeEventForm: (index: number) => void;
    updateEventForm: (index: number, field: keyof EventForm, value: string | string[]) => void;
    handleEditEvent: (eventId: string, eventData: EventForm) => void;
    cancelEventEdit: () => void;
    handleEventSubmit: () => Promise<void>;
    addSponsor: (eventIndex: number) => void;
    removeSponsor: (eventIndex: number, sponsorIndex: number) => void;
    updateSponsor: (eventIndex: number, sponsorIndex: number, value: string) => void;
    deleteEvent: (id: string) => Promise<void>; // Add this
  };
}

export default function EventsTab({
  eventForms,
  showEventForm,
  editMode,
  isSubmittingEvents,
  events, // Add this
  loadingEvents, // Add this
  deletingItemId,
  actions
}: EventsTabProps) {
  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Event submission form */}
      {showEventForm && (
        <div id="event-form-section">
          <Card className="bg-slate-900 border-slate-800 mb-6">
            <CardHeader>
              <div className="text-lg font-semibold text-white">
                {editMode.events ? 'Edit Event' : 'Add New Event'}
              </div>
            </CardHeader>
            <CardContent>
              {eventForms.map((form, index) => (
                <EventFormCard
                  key={index}
                  form={form}
                  index={index}
                  canRemove={eventForms.length > 1}
                  onRemove={() => actions.removeEventForm(index)}
                  onChange={(field, value) => actions.updateEventForm(index, field, value)}
                  onAddSponsor={() => actions.addSponsor(index)}
                  onRemoveSponsor={(sponsorIndex) => actions.removeSponsor(index, sponsorIndex)}
                  onChangeSponsor={(sponsorIndex, value) => actions.updateSponsor(index, sponsorIndex, value)}
                />
              ))}
              
              <div className="flex justify-between mt-4">
                {!editMode.events && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={actions.addEventForm}
                    className="text-slate-300 border-slate-600"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Another Event
                  </Button>
                )}
                
                <div className="space-x-2">
                  {editMode.events && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={actions.cancelEventEdit}
                      className="text-slate-300 border-slate-600"
                    >
                      Cancel
                    </Button>
                  )}
                  
                  <Button
                    type="button"
                    onClick={actions.handleEventSubmit}
                    disabled={isSubmittingEvents}
                    className="bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmittingEvents ? 'Saving...' : 'Save Event'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Event listing table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-800">
                <tr>
                  <th className="text-left p-4 text-slate-400 font-medium">Title</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Date & Location</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Links</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingEvents ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-400">
                      Loading events...
                    </td>
                  </tr>
                ) : !events || events.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-400">
                      No events found. Add your first event above.
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <p className="text-white font-medium">{event.title}</p>
                          <p className="text-slate-400 text-sm line-clamp-2">{event.description}</p>
                          {event.topic && (
                            <Badge 
                              variant="secondary" 
                              className="bg-blue-600/20 text-blue-400 border-blue-600/30 mt-2 w-fit"
                            >
                              {event.topic}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">
                        <div className="flex flex-col">
                          {event.eventDetails?.date && (
                            <span>{formatDate(event.eventDetails.date)}</span>
                          )}
                          {event.eventDetails?.timeStart && (
                            <span className="text-slate-400 text-sm">
                              {event.eventDetails.timeStart}
                              {event.eventDetails.timeEnd ? ` - ${event.eventDetails.timeEnd}` : ''}
                            </span>
                          )}
                          {event.eventDetails?.location && (
                            <span className="text-slate-400 text-sm mt-1">
                              {event.eventDetails.location}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {event.links?.lumaLink && (
                            <a 
                              href={event.links.lumaLink} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center rounded-full bg-blue-600/20 px-2.5 py-0.5 text-xs font-medium text-blue-400"
                            >
                              Lu.ma
                            </a>
                          )}
                          {event.links?.zoomLink && (
                            <a 
                              href={event.links.zoomLink} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center rounded-full bg-blue-600/20 px-2.5 py-0.5 text-xs font-medium text-blue-400"
                            >
                              Zoom
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-600/20"
                            onClick={() => actions.handleEditEvent(event.id, {
                              title: event.title || '',
                              topic: event.topic || '',
                              description: event.description || '',
                              date: event.eventDetails?.date || '',
                              time: event.eventDetails?.timeStart || '',
                              location: event.eventDetails?.location || '',
                              lumaLink: event.links?.lumaLink || '',
                              zoomLink: event.links?.zoomLink || '',
                              sponsors: event.sponsors ? 
                                event.sponsors.split(',').map((s: string) => s.trim()) : 
                                ['']
                            })}
                            disabled={isSubmittingEvents || deletingItemId !== null}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
                            onClick={() => actions.deleteEvent(event.id)}
                            disabled={isSubmittingEvents || deletingItemId === event.id}
                          >
                            {deletingItemId === event.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* Pagination */}
      {events && events.length > 0 && (
        <div className="flex items-center justify-center space-x-2">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="bg-blue-600 text-white">1</Button>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}