'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import type { BlogPost } from '@/types';
import BlogEditor from '@/components/admin/blogs/BlogEditor';

interface EditBlogPageClientProps {
  blogId: string;
}

const EditBlogPageClient = ({ blogId }: EditBlogPageClientProps) => {
  const router = useRouter();
  const [initialPost, setInitialPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch(`/api/admin/blogs/${blogId}`, { cache: 'no-store' });
        if (response.status === 404) {
          toast.error('Blog not found');
          router.push('/admin');
          return;
        }
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const data = await response.json();
        if (active) {
          setInitialPost(data.doc ?? data);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load blog');
        router.push('/admin');
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [blogId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <p className="text-sm text-slate-400">Loading blog...</p>
      </div>
    );
  }

  if (!initialPost) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <p className="text-sm text-slate-400">Blog not found.</p>
      </div>
    );
  }

  return <BlogEditor mode="edit" initialPost={initialPost} />;
};

export default EditBlogPageClient;
