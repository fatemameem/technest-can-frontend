"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Mic, Trash2 } from 'lucide-react';

export interface PodcastForm {
  title: string;
  description: string;
  linkedin: string;
  instagram: string;
  drive: string;
  facebook: string;
  thumbnail: string;
}

export default function PodcastFormCard({
  index,
  form,
  onChange,
  onRemove,
  canRemove,
}: {
  index: number;
  form: PodcastForm;
  canRemove: boolean;
  onChange: (field: keyof PodcastForm, value: string) => void;
  onRemove: () => void;
}) {
  return (
    <Card className="surface">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Mic className="h-5 w-5 text-cyan-400" />
            <span>Podcast #{index + 1}</span>
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
            <Label htmlFor={`podcast-title-${index}`}>Title *</Label>
            <Input id={`podcast-title-${index}`} value={form.title} onChange={(e) => onChange('title', e.target.value)} placeholder="Enter podcast title" className="focus-ring" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`podcast-thumbnail-${index}`}>Thumbnail URL *</Label>
            <Input id={`podcast-thumbnail-${index}`} type="url" value={form.thumbnail} onChange={(e) => onChange('thumbnail', e.target.value)} placeholder="https://example.com/thumbnail.jpg" className="focus-ring" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`podcast-description-${index}`}>Description *</Label>
          <Textarea id={`podcast-description-${index}`} value={form.description} onChange={(e) => onChange('description', e.target.value)} placeholder="Enter podcast description" rows={3} className="focus-ring resize-none" required />
        </div>

        <Separator className="bg-white/10" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`podcast-drive-${index}`}>Google Drive Link *</Label>
            <Input id={`podcast-drive-${index}`} type="url" value={form.drive} onChange={(e) => onChange('drive', e.target.value)} placeholder="https://drive.google.com/..." className="focus-ring" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`podcast-linkedin-${index}`}>LinkedIn URL</Label>
            <Input id={`podcast-linkedin-${index}`} type="url" value={form.linkedin} onChange={(e) => onChange('linkedin', e.target.value)} placeholder="https://linkedin.com/..." className="focus-ring" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`podcast-instagram-${index}`}>Instagram URL</Label>
            <Input id={`podcast-instagram-${index}`} type="url" value={form.instagram} onChange={(e) => onChange('instagram', e.target.value)} placeholder="https://instagram.com/..." className="focus-ring" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`podcast-facebook-${index}`}>Facebook URL</Label>
            <Input id={`podcast-facebook-${index}`} type="url" value={form.facebook} onChange={(e) => onChange('facebook', e.target.value)} placeholder="https://facebook.com/..." className="focus-ring" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
