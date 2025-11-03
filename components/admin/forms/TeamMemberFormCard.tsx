"use client";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, UploadCloud, Loader2, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { TeamMemberForm } from '@/types';

export default function TeamMemberFormCard({
  index,
  form,
  onChange,
  onRemove,
  canRemove,
}: {
  index: number;
  form: TeamMemberForm;
  onChange: (field: keyof TeamMemberForm, value: string | File | null) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    onChange('imageFile', file);
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
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
            <Label htmlFor={`team-name-${index}`}>Name *</Label>
            <Input 
              id={`team-name-${index}`} 
              value={form.name} 
              onChange={(e) => onChange('name', e.target.value)} 
              placeholder="Enter name" 
              className="focus-ring" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`team-email-${index}`}>Email *</Label>
            <Input 
              id={`team-email-${index}`} 
              type="email" 
              value={form.email} 
              onChange={(e) => onChange('email', e.target.value)} 
              placeholder="email@example.com" 
              className="focus-ring" 
              required 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`team-designation-${index}`}>Designation *</Label>
          <Input 
            id={`team-designation-${index}`} 
            value={form.designation} 
            onChange={(e) => onChange('designation', e.target.value)} 
            placeholder="e.g., Lead Developer" 
            className="focus-ring" 
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`team-description-${index}`}>Description</Label>
          <Textarea 
            id={`team-description-${index}`} 
            value={form.description} 
            onChange={(e) => onChange('description', e.target.value)} 
            placeholder="Brief bio and expertise..." 
            rows={3} 
            className="focus-ring resize-none" 
          />
        </div>

        {/* Image Upload Section */}
        <div className="space-y-2">
          <Label htmlFor={`team-image-${index}`}>Profile Image *</Label>
          <div className="grid grid-cols-1 gap-3">
            {form.imageUrl && (
              <div className="relative w-32 h-32 mb-2 mx-auto">
                {/* Replace Next.js Image with regular img */}
                <img 
                  src={form.imageUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-full border-2 border-slate-600"
                />
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Input
                id={`team-image-${index}`}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full border-slate-600 hover:bg-slate-700"
                onClick={() => document.getElementById(`team-image-${index}`)?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    {form.imageUrl ? 'Replace Image' : 'Upload Image'}
                  </>
                )}
              </Button>
            </div>
            {form.imageFile && (
              <p className="text-xs text-slate-400">
                Selected: {form.imageFile.name}
              </p>
            )}
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-300">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`team-linkedin-${index}`}>LinkedIn</Label>
              <Input 
                id={`team-linkedin-${index}`} 
                type="url" 
                value={form.linkedin} 
                onChange={(e) => onChange('linkedin', e.target.value)} 
                placeholder="https://linkedin.com/in/..." 
                className="focus-ring" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`team-twitter-${index}`}>Twitter</Label>
              <Input 
                id={`team-twitter-${index}`} 
                type="url" 
                value={form.twitter} 
                onChange={(e) => onChange('twitter', e.target.value)} 
                placeholder="https://twitter.com/..." 
                className="focus-ring" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`team-github-${index}`}>GitHub</Label>
              <Input 
                id={`team-github-${index}`} 
                type="url" 
                value={form.github} 
                onChange={(e) => onChange('github', e.target.value)} 
                placeholder="https://github.com/..." 
                className="focus-ring" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`team-website-${index}`}>Website</Label>
              <Input 
                id={`team-website-${index}`} 
                type="url" 
                value={form.website} 
                onChange={(e) => onChange('website', e.target.value)} 
                placeholder="https://example.com" 
                className="focus-ring" 
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
