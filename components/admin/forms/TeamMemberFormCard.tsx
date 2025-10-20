"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Users, Trash2, UploadCloud, Loader2 } from 'lucide-react';
import type { TeamMemberForm } from '@/types';
import { toast } from 'sonner';
import Image from 'next/image';

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
  onChange: (field: keyof TeamMemberForm, value: string | File | null) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast?.error('Please upload an image file');
      return;
    }

    onChange('imageFile', file);

    // Show preview immediately using object URL
    const objectUrl = URL.createObjectURL(file);
    onChange('imageUrl', objectUrl); // Store in imageUrl for preview
    
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.doc) {
        // Update imageUrl with Cloudinary URL (replaces object URL)
        onChange('imageUrl', data.doc.cloudinary.secureUrl); // For display
        onChange('image', data.doc.id); // For database relation

        toast?.success('Image uploaded successfully');

      } else {
        console.error('Upload response issue:', data);
        toast?.error('Upload completed but returned unexpected format');
        // Revert preview on error
        onChange('imageUrl', '');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast?.error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Revert preview on error
      onChange('imageUrl', '');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="surface">
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

        {/* Image Upload Section - Match EventFormCard exactly */}
        <div className="space-y-2">
          <Label htmlFor={`team-image-${index}`}>Profile Image *</Label>
          <div className="grid grid-cols-1 gap-3">
            {/* Show preview if imageUrl exists */}
            {form.imageUrl && (
              <div className="relative w-32 h-32 mb-2 mx-auto">
                <Image 
                  src={form.imageUrl} 
                  alt="Thumbnail" 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded" 
                />
              </div>
            )}
            <div className="relative">
              <Input 
                id={`team-image-file-${index}`}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="focus-ring hidden"
              />
              <Button 
                type="button" 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => document.getElementById(`team-image-file-${index}`)?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-4 w-4" />
                    {form.image ? 'Change Image' : 'Upload Image'}
                  </>
                )}
              </Button>
              {form.imageUrl && (
                <Input
                  id={`team-image-${index}`}
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => onChange('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="focus-ring mt-2"
                />
              )}
            </div>
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
