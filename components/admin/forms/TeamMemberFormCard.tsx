"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, Trash2 } from 'lucide-react';

export interface TeamMemberForm {
  name: string;
  email: string;
  designation: string;
  description: string;
  linkedin: string;
  twitter: string;
  github: string;
  website: string;
  imageLink: string;
}

export default function TeamMemberFormCard({
  index,
  form,
  canRemove,
  onRemove,
  onChange,
}: {
  index: number;
  form: TeamMemberForm;
  canRemove: boolean;
  onRemove: () => void;
  onChange: (field: keyof TeamMemberForm, value: string) => void;
}) {
  return (
    <Card className="surface">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Users className="h-5 w-5 text-cyan-400" />
            <span>Team Member #{index + 1}</span>
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
            <Label htmlFor={`team-name-${index}`}>Full Name *</Label>
            <Input id={`team-name-${index}`} value={form.name} onChange={(e) => onChange('name', e.target.value)} placeholder="Enter full name" className="focus-ring" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`team-email-${index}`}>Email *</Label>
            <Input id={`team-email-${index}`} type="email" value={form.email} onChange={(e) => onChange('email', e.target.value)} placeholder="member@tech-nest.org" className="focus-ring" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`team-designation-${index}`}>Designation *</Label>
          <Input id={`team-designation-${index}`} value={form.designation} onChange={(e) => onChange('designation', e.target.value)} placeholder="e.g., Senior Security Consultant" className="focus-ring" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`team-description-${index}`}>Description</Label>
          <Textarea id={`team-description-${index}`} value={form.description} onChange={(e) => onChange('description', e.target.value)} placeholder="Brief bio and expertise..." rows={3} className="focus-ring resize-none" />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`team-image-${index}`}>Profile Image URL *</Label>
          <Input id={`team-image-${index}`} type="url" value={form.imageLink} onChange={(e) => onChange('imageLink', e.target.value)} placeholder="https://example.com/profile.jpg" className="focus-ring" required />
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h4 className="font-medium text-slate-300">Social Links</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`team-linkedin-${index}`}>LinkedIn</Label>
              <Input id={`team-linkedin-${index}`} type="url" value={form.linkedin} onChange={(e) => onChange('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." className="focus-ring" />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`team-twitter-${index}`}>Twitter</Label>
              <Input id={`team-twitter-${index}`} type="url" value={form.twitter} onChange={(e) => onChange('twitter', e.target.value)} placeholder="https://twitter.com/..." className="focus-ring" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`team-github-${index}`}>GitHub</Label>
              <Input id={`team-github-${index}`} type="url" value={form.github} onChange={(e) => onChange('github', e.target.value)} placeholder="https://github.com/..." className="focus-ring" />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`team-website-${index}`}>Website</Label>
              <Input id={`team-website-${index}`} type="url" value={form.website} onChange={(e) => onChange('website', e.target.value)} placeholder="https://example.com" className="focus-ring" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
