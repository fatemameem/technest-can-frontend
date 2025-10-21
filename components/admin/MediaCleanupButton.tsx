'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface CleanupResult {
  found: number;
  deleted: number;
  errors: number;
}

export function MediaCleanupButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CleanupResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCleanup = async () => {
    if (!confirm('Are you sure you want to delete all orphaned media? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/admin/cleanup-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cleanup media');
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <Button
          onClick={handleCleanup}
          disabled={loading}
          variant="destructive"
          className="flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Cleaning up...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Cleanup Orphaned Media
            </>
          )}
        </Button>
        <div className="flex-1 text-sm text-muted-foreground">
          <p>Remove media files that are no longer referenced by any content.</p>
          <p className="text-xs mt-1">This will permanently delete orphaned images from Cloudinary and Google Drive.</p>
        </div>
      </div>

      {result && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            <strong>Cleanup Complete</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Found: {result.found} orphaned files</li>
              <li>• Deleted: {result.deleted} files</li>
              {result.errors > 0 && <li className="text-red-600">• Errors: {result.errors}</li>}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error:</strong> {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
