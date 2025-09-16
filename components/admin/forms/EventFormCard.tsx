"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Calendar, Trash2 } from 'lucide-react';

export interface EventForm {
  title: string;
  topic: string;
  description: string;
  date: string;
  time: string;
  location: string;
  lumaLink: string;
  zoomLink: string;
  sponsors: string[];
}

export default function EventFormCard({
  index,
  form,
  canRemove,
  onRemove,
  onChange,
  onAddSponsor,
  onRemoveSponsor,
  onChangeSponsor,
}: {
  index: number;
  form: EventForm;
  canRemove: boolean;
  onRemove: () => void;
  onChange: (field: keyof EventForm, value: string) => void;
  onAddSponsor: () => void;
  onRemoveSponsor: (sponsorIndex: number) => void;
  onChangeSponsor: (sponsorIndex: number, value: string) => void;
}) {
  return (
    <Card className="surface">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            <span>Event #{index + 1}</span>
          </CardTitle>
          {canRemove && (
            <Button onClick={onRemove} variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`event-title-${index}`}>Title *</Label>
            <Input id={`event-title-${index}`} value={form.title} onChange={(e) => onChange('title', e.target.value)} placeholder="Enter event title" className="focus-ring" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`event-topic-${index}`}>Topic *</Label>
            <Input id={`event-topic-${index}`} value={form.topic} onChange={(e) => onChange('topic', e.target.value)} placeholder="e.g., Cybersecurity" className="focus-ring" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`event-description-${index}`}>Description *</Label>
          <Textarea id={`event-description-${index}`} value={form.description} onChange={(e) => onChange('description', e.target.value)} placeholder="Enter event description" rows={3} className="focus-ring resize-none" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`event-date-${index}`}>Date *</Label>
            <Input id={`event-date-${index}`} type="date" value={form.date} onChange={(e) => onChange('date', e.target.value)} className="focus-ring" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`event-time-${index}`}>Time *</Label>
            <Input id={`event-time-${index}`} type="time" value={form.time} onChange={(e) => onChange('time', e.target.value)} className="focus-ring" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`event-location-${index}`}>Location *</Label>
            <Input id={`event-location-${index}`} value={form.location} onChange={(e) => onChange('location', e.target.value)} placeholder="Enter location" className="focus-ring" required />
          </div>
        </div>

        <Separator className="bg-white/10" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`event-luma-${index}`}>Lu.ma Link</Label>
            <Input id={`event-luma-${index}`} type="url" value={form.lumaLink} onChange={(e) => onChange('lumaLink', e.target.value)} placeholder="https://lu.ma/..." className="focus-ring" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`event-zoom-${index}`}>Zoom Link</Label>
            <Input id={`event-zoom-${index}`} type="url" value={form.zoomLink} onChange={(e) => onChange('zoomLink', e.target.value)} placeholder="https://zoom.us/..." className="focus-ring" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Sponsors</Label>
            <Button onClick={onAddSponsor} variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10">
              Add Sponsor
            </Button>
          </div>
          <div className="space-y-2">
            {form.sponsors.map((s, sponsorIndex) => (
              <div key={sponsorIndex} className="flex gap-2">
                <Input value={s} onChange={(e) => onChangeSponsor(sponsorIndex, e.target.value)} placeholder="Enter sponsor name" className="focus-ring flex-1" />
                {form.sponsors.length > 1 && (
                  <Button onClick={() => onRemoveSponsor(sponsorIndex)} variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
