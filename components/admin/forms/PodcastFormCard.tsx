"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, UploadCloud, Loader2, Mic } from 'lucide-react';
import { toast } from 'sonner';

export interface PodcastForm {
  title: string;
  description: string;
  linkedin: string;
  instagram: string;
  drive: string;
  facebook: string;
  thumbnail: string;
  thumbnailUrl?: string;
  // //cloudinary- added file field
  thumbnailFile?: File | null;
  thumbnailId?: string;
  learnMoreLinks: { label: string; url: string }[];
  resourcesLinks: { label: string; url: string }[];
}

export default function PodcastFormCard({
  index,
  form,
  onChange,
  onRemove,
  canRemove,
  // Add these new props
  onAddLearnMoreLink,
  onRemoveLearnMoreLink,
  onUpdateLearnMoreLink,
  onAddResourceLink,
  onRemoveResourceLink,
  onUpdateResourceLink,
}: {
  index: number;
  form: PodcastForm;
  canRemove: boolean;
  onChange: (field: keyof PodcastForm, value: any) => void;
  onRemove: () => void;
  // New prop types
  onAddLearnMoreLink: () => void;
  onRemoveLearnMoreLink: (linkIndex: number) => void;
  onUpdateLearnMoreLink: (linkIndex: number, field: 'label' | 'url', value: string) => void;
  onAddResourceLink: () => void;
  onRemoveResourceLink: (linkIndex: number) => void;
  onUpdateResourceLink: (linkIndex: number, field: 'label' | 'url', value: string) => void;
}) {
  // //cloudinary- added loading state
  const [uploading, setUploading] = useState(false);
  
  // //cloudinary- added file upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    onChange('thumbnailFile', file);
    
    // Show preview immediately
    const objectUrl = URL.createObjectURL(file);
    onChange('thumbnail', objectUrl);
    
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
        // Store both the URL and ID
        onChange('thumbnailUrl', data.doc.cloudinary.secureUrl); // For display
        onChange('thumbnail', data.doc.id); // For database relation
        
        // console.log('Upload successful - Media ID:', data.doc.id, 'URL:', data.doc.cloudinary.secureUrl);
        
        // For debugging
        // console.log('Current form data after upload:', form);
      } else {
        console.error('Upload response issue:', data);
        toast?.error('Upload completed but returned unexpected format');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast?.error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 mb-6">
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
      <CardContent className="pt-6 space-y-4">
        {canRemove && (
          <div className="flex justify-end">
            <Button onClick={onRemove} variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`podcast-title-${index}`}>Title *</Label>
            <Input id={`podcast-title-${index}`} value={form.title} onChange={(e) => onChange('title', e.target.value)} placeholder="Enter podcast title" className="focus-ring" required />
          </div>

          <div className="space-y-2">
            {/* //cloudinary- replaced URL input with file upload */}
            <Label htmlFor={`podcast-thumbnail-${index}`}>Thumbnail Image *</Label>
            <div className="grid grid-cols-1 gap-3">
              {form.thumbnailUrl && (
                <div className="relative w-24 h-24 mb-2">
                  {/* Use regular img instead of Next.js Image */}
                  <img 
                    src={form.thumbnailUrl} 
                    alt="Thumbnail" 
                    className="w-full h-full object-cover rounded" 
                  />
                </div>
              )}
              <div className="relative">
                <Input 
                  id={`podcast-thumbnail-file-${index}`}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="focus-ring hidden"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => document.getElementById(`podcast-thumbnail-file-${index}`)?.click()}
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
                      {form.thumbnail ? 'Change Image' : 'Upload Image'}
                    </>
                  )}
                </Button>
                {form.thumbnail && (
                  <Input
                    id={`podcast-thumbnail-${index}`}
                    type="url"
                    value={form.thumbnail}
                    onChange={(e) => onChange('thumbnail', e.target.value)}
                    placeholder="https://example.com/thumbnail.jpg"
                    className="focus-ring mt-2"
                  />
                )}
              </div>
            </div>
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

        {/* Learn More Links Section */}
        <Separator className="bg-white/10 my-4" />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Learn More Links</Label>
            <Button
              type="button"
              onClick={onAddLearnMoreLink}
              variant="ghost"
              size="sm"
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
            >
              <Plus className="mr-1 h-3 w-3" />
              Add Link
            </Button>
          </div>

          {form.learnMoreLinks.map((link, linkIndex) => (
            <div key={linkIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor={`podcast-${index}-learn-label-${linkIndex}`}>
                  Label
                </Label>
                <Input
                  id={`podcast-${index}-learn-label-${linkIndex}`}
                  value={link.label}
                  onChange={(e) => onUpdateLearnMoreLink(linkIndex, 'label', e.target.value)}
                  placeholder="e.g., Read the full article"
                  className="focus-ring"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`podcast-${index}-learn-url-${linkIndex}`}>
                  URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={`podcast-${index}-learn-url-${linkIndex}`}
                    type="url"
                    value={link.url}
                    onChange={(e) => onUpdateLearnMoreLink(linkIndex, 'url', e.target.value)}
                    placeholder="https://example.com"
                    className="focus-ring flex-1"
                  />
                  {form.learnMoreLinks.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => onRemoveLearnMoreLink(linkIndex)}
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resources Links Section */}
        <Separator className="bg-white/10 my-4" />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Resources Links</Label>
            <Button
              type="button"
              onClick={onAddResourceLink}
              variant="ghost"
              size="sm"
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
            >
              <Plus className="mr-1 h-3 w-3" />
              Add Resource
            </Button>
          </div>

          {form.resourcesLinks.map((link, linkIndex) => (
            <div key={linkIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor={`podcast-${index}-resource-label-${linkIndex}`}>
                  Label
                </Label>
                <Input
                  id={`podcast-${index}-resource-label-${linkIndex}`}
                  value={link.label}
                  onChange={(e) => onUpdateResourceLink(linkIndex, 'label', e.target.value)}
                  placeholder="e.g., Download slides"
                  className="focus-ring"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`podcast-${index}-resource-url-${linkIndex}`}>
                  URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={`podcast-${index}-resource-url-${linkIndex}`}
                    type="url"
                    value={link.url}
                    onChange={(e) => onUpdateResourceLink(linkIndex, 'url', e.target.value)}
                    placeholder="https://example.com"
                    className="focus-ring flex-1"
                  />
                  {form.resourcesLinks.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => onRemoveResourceLink(linkIndex)}
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
