"use client";
import React, { useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadBlockProps {
  mediaId?: string;
  mediaUrl?: string;
  mediaRef?: string; // Legacy URL field
  alt?: string;
  caption?: string;
  // Change onChange signature to accept complete props object
  onChange: (props: Record<string, any>) => void;
}

export default function ImageUploadBlock({
  mediaId,
  mediaUrl,
  mediaRef,
  alt,
  caption,
  onChange,
}: ImageUploadBlockProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast?.error('Please upload an image file');
      return;
    }

    // Show preview immediately using object URL
    const objectUrl = URL.createObjectURL(file);
    
    // BATCH UPDATE: Update mediaUrl immediately for preview
    onChange({
      mediaId,
      mediaUrl: objectUrl,
      mediaRef: '', // Clear legacy ref
      alt: alt || '',
      caption: caption || '',
    });
    
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
        // BATCH UPDATE: Update with Cloudinary URL and Media ID together
        onChange({
          mediaId: data.doc.id,
          mediaUrl: data.doc.cloudinary.secureUrl,
          mediaRef: '', // Clear legacy ref
          alt: alt || '',
          caption: caption || '',
        });

        toast?.success('Image uploaded successfully');
        console.log('Upload successful - Media ID:', data.doc.id, 'URL:', data.doc.cloudinary.secureUrl);
      } else {
        console.error('Upload response issue:', data);
        toast?.error('Upload completed but returned unexpected format');
        
        // Revert to previous state
        onChange({
          mediaId,
          mediaUrl: mediaUrl || '',
          mediaRef: mediaRef || '',
          alt: alt || '',
          caption: caption || '',
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast?.error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Revert to previous state
      onChange({
        mediaId,
        mediaUrl: mediaUrl || '',
        mediaRef: mediaRef || '',
        alt: alt || '',
        caption: caption || '',
      });
    } finally {
      setUploading(false);
      // Reset the file input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFieldChange = (field: string, value: string) => {
    // BATCH UPDATE: Update single field while preserving others
    onChange({
      mediaId: mediaId || '',
      mediaUrl: mediaUrl || '',
      mediaRef: mediaRef || '',
      alt: alt || '',
      caption: caption || '',
      [field]: value,
    });
  };

  // Determine which URL to display (priority: mediaUrl > mediaRef)
  const displayUrl = mediaUrl || mediaRef;

  return (
    <div className="space-y-4">
      {/* Image Preview */}
      {displayUrl && (
        <div className="relative w-full max-w-md mx-auto">
          <img 
            src={displayUrl} 
            alt={alt || 'Blog image preview'} 
            className="w-full h-auto rounded-lg border border-slate-700"
          />
        </div>
      )}

      {/* Upload Button */}
      <div>
        <Label>Upload Image</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button 
          type="button" 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 mt-2"
          onClick={handleUploadClick}
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
              {displayUrl ? 'Change Image' : 'Upload Image'}
            </>
          )}
        </Button>
      </div>

      {/* Legacy URL Input (backward compatibility) */}
      {!mediaId && (
        <div>
          <Label htmlFor="mediaRef" className="text-sm text-slate-400">
            Or paste image URL (legacy)
          </Label>
          <Input
            id="mediaRef"
            value={mediaRef || ''}
            onChange={(e) => handleFieldChange('mediaRef', e.target.value)}
            placeholder="https://example.com/image.png"
            className="mt-2"
          />
          <p className="text-xs text-slate-500 mt-1">
            Use the upload button above for better performance
          </p>
        </div>
      )}

      {/* Alt Text */}
      <div>
        <Label htmlFor="alt">Alt Text *</Label>
        <Input
          id="alt"
          value={alt || ''}
          onChange={(e) => handleFieldChange('alt', e.target.value)}
          placeholder="Descriptive text for the image"
        />
      </div>

      {/* Caption */}
      <div>
        <Label htmlFor="caption">Caption (Optional)</Label>
        <Input
          id="caption"
          value={caption || ''}
          onChange={(e) => handleFieldChange('caption', e.target.value)}
          placeholder="Optional image caption"
        />
      </div>

      {/* Debug Info (development only) */}
      {process.env.NODE_ENV === 'development' && mediaId && (
        <div className="text-xs text-slate-500 space-y-1 p-2 bg-slate-900 rounded">
          <p><strong>Media ID:</strong> {mediaId}</p>
          <p className="truncate"><strong>URL:</strong> {mediaUrl}</p>
        </div>
      )}
    </div>
  );
}