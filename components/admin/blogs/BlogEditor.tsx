﻿'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  Save,
  Globe,
  Monitor,
  Tablet,
  Smartphone,
  ArrowLeft,
  Settings,
  GripVertical,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

import type { BlogPost, Block, MetaData, Layout } from '@/types';
import { PostStatus, LayoutPreset, BlockType } from '@/types';
import PreviewPanel from '@/components/admin/blogs/BlogPreview';
import { slugify } from '@/helpers/generateUniqueSlug';
import { calculateReadingTime } from '@/helpers/calculateReadingTime';
import { createInitialBlogPost, CATEGORIES, LAYOUT_PRESETS } from '@/data/constants';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';

const DEFAULT_BACK_URL = '/admin';

const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      active ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'
    }`}
  >
    {children}
  </button>
);

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-slate-800/50 border border-slate-700 rounded-lg ${className ?? ''}`}>{children}</div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 border-b border-slate-700">
    <h3 className="text-lg font-semibold text-white">{children}</h3>
  </div>
);

const CardContent = ({ children }: { children: React.ReactNode }) => <div className="p-4 space-y-4">{children}</div>;

const Label = ({ children, ...props }: React.ComponentPropsWithoutRef<'label'>) => (
  <label className="text-sm font-medium text-slate-300 block mb-2" {...props}>
    {children}
  </label>
);

const Input = (props: React.ComponentPropsWithoutRef<'input'>) => (
  <input
    className="w-full bg-slate-900 border border-slate-600 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    {...props}
  />
);

const Textarea = (props: React.ComponentPropsWithoutRef<'textarea'>) => (
  <textarea
    className="w-full bg-slate-900 border border-slate-600 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    {...props}
  />
);

const Select = ({ children, ...props }: React.ComponentPropsWithoutRef<'select'>) => (
  <select
    className="w-full bg-slate-900 border border-slate-600 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
    {...props}
  >
    {children}
  </select>
);

function deepClone<T>(value: T): T {
  const clone = (globalThis as any).structuredClone;
  if (typeof clone === 'function') {
    return clone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

function applyTimestamp(post: BlogPost): BlogPost {
  return {
    ...post,
    meta: {
      ...post.meta,
      updatedAt: new Date().toISOString(),
    },
  };
}

type BlogPostPatch = Partial<Omit<BlogPost, 'meta' | 'layout' | 'blocks'>> & {
  meta?: Partial<MetaData>;
  layout?: Partial<Layout>;
  blocks?: Block[];
};

function mergeBlogPost(base: BlogPost, patch?: BlogPostPatch): BlogPost {
  const cloned = deepClone(base);
  if (!patch) return cloned;

  return {
    ...cloned,
    ...patch,
    meta: {
      ...cloned.meta,
      ...(patch.meta ?? {}),
    },
    layout: {
      ...cloned.layout,
      ...(patch.layout ?? {}),
    },
    blocks: patch.blocks
      ? patch.blocks.map((block) => ({ ...block, props: { ...(block.props ?? {}) } }))
      : cloned.blocks,
  };
}

function normalizeStatus(value: any): PostStatus {
  const input = String(value ?? '').toLowerCase();
  const match = (Object.values(PostStatus) as string[]).find((option) => option.toLowerCase() === input);
  if (match) return match as PostStatus;
  if (input === 'draft') return PostStatus.DRAFT;
  if (input === 'scheduled') return PostStatus.SCHEDULED;
  if (input === 'published') return PostStatus.PUBLISHED;
  return PostStatus.DRAFT;
}

function normalizePreset(value: any): LayoutPreset {
  const input = String(value ?? '').toLowerCase();
  const match = (Object.values(LayoutPreset) as string[]).find((option) => option.toLowerCase() === input);
  return (match as LayoutPreset) ?? LayoutPreset.DEFAULT;
}

function normalizeBlogDoc(input: any): BlogPost {
  const meta = input?.meta ?? {};
  const layout = input?.layout ?? {};
  const blocks = Array.isArray(input?.blocks) ? input.blocks : [];

  const normalized: BlogPost = {
    id: input?.id ?? 'new',
    meta: {
      title: meta.title ?? '',
      subtitle: meta.subtitle ?? undefined,
      authorRef: meta.authorRef ?? meta.author ?? '',
      slug: meta.slug ?? slugify(meta.title ?? ''),
      coverImageRef: meta.coverImageRef ?? undefined,
      tags: Array.isArray(meta.tags) ? meta.tags : [],
      categories: Array.isArray(meta.categories) ? meta.categories : [],
      readingTime: typeof meta.readingTime === 'number' ? meta.readingTime : 0,
      status: normalizeStatus(meta.status),
      publishedAt: meta.publishedAt ?? meta.published_at ?? undefined,
      updatedAt: meta.updatedAt ?? meta.updated_at ?? new Date().toISOString(),
      seo: {
        title: meta.seo?.title ?? '',
        description: meta.seo?.description ?? '',
        ogImageRef: meta.seo?.ogImageRef ?? meta.seo?.ogImage ?? undefined,
      },
    },
    layout: {
      preset: normalizePreset(layout.preset),
    },
    blocks: blocks.map((block: any) => ({
      id: block.id ?? crypto.randomUUID(),
      type: block.type ?? BlockType.RICH_TEXT,
      props: { ...(block.props ?? {}) },
    })),
  };

  return {
    ...normalized,
    meta: {
      ...normalized.meta,
      readingTime: calculateReadingTime(normalized.blocks),
    },
  };
}

const derivePost = (post: BlogPost): BlogPost => ({
  ...post,
  meta: {
    ...post.meta,
    readingTime: calculateReadingTime(post.blocks),
  },
});
const BlockEditor = ({ block, onUpdate }: { block: Block; onUpdate: (props: Record<string, any>) => void }) => {
  if (!block) {
    return (
      <div className="text-center py-8 text-slate-400">
        <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Select a block to edit its properties</p>
      </div>
    );
  }

  const updateProp = (key: string, value: any) => {
    onUpdate({ ...block.props, [key]: value });
  };

  const renderProps = () => {
    switch (block.type) {
      case BlockType.HERO_MEDIA:
      case BlockType.IMAGE_FIGURE:
        return (
          <>
            <div>
              <Label htmlFor="mediaRef">Image URL</Label>
              <Input
                id="mediaRef"
                value={block.props.mediaRef}
                onChange={(e) => updateProp('mediaRef', e.target.value)}
                placeholder="https://example.com/image.png"
              />
            </div>
            <div>
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={block.props.alt}
                onChange={(e) => updateProp('alt', e.target.value)}
                placeholder="Descriptive text for the image"
              />
            </div>
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                value={block.props.caption}
                onChange={(e) => updateProp('caption', e.target.value)}
                placeholder="Optional image caption"
              />
            </div>
          </>
        );
      case BlockType.LEAD_PARAGRAPH:
        return (
          <div>
            <Label htmlFor="text">Paragraph Text</Label>
            <Textarea id="text" value={block.props.text} onChange={(e) => updateProp('text', e.target.value)} rows={5} />
          </div>
        );
      case BlockType.RICH_TEXT:
        return (
          <div>
            <Label htmlFor="content">Markdown Content</Label>
            <Textarea id="content" value={block.props.content} onChange={(e) => updateProp('content', e.target.value)} rows={10} />
          </div>
        );
      case BlockType.CODE_BLOCK:
        return (
          <>
            <div>
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                value={block.props.language}
                onChange={(e) => updateProp('language', e.target.value)}
                placeholder="e.g., typescript, python"
              />
            </div>
            <div>
              <Label htmlFor="filename">Filename (optional)</Label>
              <Input
                id="filename"
                value={block.props.filename}
                onChange={(e) => updateProp('filename', e.target.value)}
                placeholder="e.g., example.ts"
              />
            </div>
            <div>
              <Label htmlFor="code">Code</Label>
              <Textarea id="code" value={block.props.code} onChange={(e) => updateProp('code', e.target.value)} rows={10} />
            </div>
          </>
        );
      case BlockType.VIDEO_EMBED:
        return (
          <>
            <div>
              <Label htmlFor="url">Video URL</Label>
              <Input
                id="url"
                value={block.props.url}
                onChange={(e) => updateProp('url', e.target.value)}
                placeholder="YouTube or Google Drive link"
              />
            </div>
            <div>
              <Label htmlFor="caption">Caption (optional)</Label>
              <Input
                id="caption"
                value={block.props.caption}
                onChange={(e) => updateProp('caption', e.target.value)}
                placeholder="Optional video caption"
              />
            </div>
          </>
        );
      default:
        return <p className="text-slate-400">This block type has no editable properties.</p>;
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Editing: {block.type}</h3>
      <div className="space-y-4">{renderProps()}</div>
    </div>
  );
};

interface BlogEditorProps {
  mode: 'create' | 'edit';
  initialPost?: BlogPost;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ initialPost, mode }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const initialValue = useMemo(() => derivePost(deepClone(initialPost ?? createInitialBlogPost())), [initialPost]);

  const [blogPost, setBlogPost] = useState<BlogPost>(initialValue);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'page' | 'blocks' | 'inspector'>('page');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);

  const baseDraftKey = useMemo(() => `blog-editor:${initialPost?.id ?? 'new'}`, [initialPost?.id]);
  const draftKey = useMemo(() => {
    const currentId = blogPost.id && blogPost.id !== 'new' ? blogPost.id : initialPost?.id ?? 'new';
    return `blog-editor:${currentId}`;
  }, [blogPost.id, initialPost?.id]);

  const hydrationRef = useRef(false);
  const autosaveRef = useRef(false);

  const setPostFromServer = useCallback(
    (doc: BlogPost) => {
      const normalized = derivePost(doc);
      setBlogPost(normalized);
      setHasUnsavedChanges(false);
      setLastSaved(normalized.meta.updatedAt ? new Date(normalized.meta.updatedAt) : new Date());
      setSlugManuallyEdited(normalized.meta.slug !== slugify(normalized.meta.title ?? ''));
    },
    []
  );

  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') return;
    const keys = new Set([baseDraftKey, draftKey, 'blog-editor:new']);
    keys.forEach((key) => {
      if (key) {
        try {
          window.localStorage.removeItem(key);
        } catch (error) {
          console.warn('Failed to clear draft key', key, error);
        }
      }
    });
  }, [baseDraftKey, draftKey]);

  const updateLocalPost = useCallback((updater: (prev: BlogPost) => BlogPost) => {
    setBlogPost((prev) => {
      const next = derivePost(applyTimestamp(updater(prev)));
      return next;
    });
    setHasUnsavedChanges(true);
  }, []);

  const buildPayload = useCallback(
    (patch?: BlogPostPatch) => {
      const merged = mergeBlogPost(blogPost, patch);
      return derivePost(merged);
    },
    [blogPost]
  );

  const persistBlog = useCallback(
    async (patch?: BlogPostPatch) => {
      setIsSaving(true);
      try {
        const payload = buildPayload(patch);
        const isCreate = !blogPost.id || blogPost.id === 'new';
        const endpoint = isCreate ? '/api/admin/blogs' : `/api/admin/blogs/${blogPost.id}`;
        const method = isCreate ? 'POST' : 'PATCH';

        const response = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || 'Failed to persist blog');
        }

        const data = await response.json();
        const doc = normalizeBlogDoc(data.doc ?? data);
        setPostFromServer(doc);
        clearDraft();
        return doc;
      } finally {
        setIsSaving(false);
      }
    },
    [blogPost.id, buildPayload, clearDraft, setPostFromServer]
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (hydrationRef.current) return;
    hydrationRef.current = true;

    const stored = window.localStorage.getItem(baseDraftKey) ?? (mode === 'create' ? window.localStorage.getItem('blog-editor:new') : null);
    if (!stored) return;

    try {
      const parsed = normalizeBlogDoc(JSON.parse(stored));
      setBlogPost(parsed);
      setHasUnsavedChanges(true);
      setSlugManuallyEdited(parsed.meta.slug !== slugify(parsed.meta.title ?? ''));
    } catch (error) {
      console.error('Failed to load autosaved draft', error);
      window.localStorage.removeItem(baseDraftKey);
    }
  }, [baseDraftKey, mode]);

  useEffect(() => {
    if (!initialPost) return;
    setPostFromServer(normalizeBlogDoc(initialPost));
  }, [initialPost, setPostFromServer]);

  useEffect(() => {
    if (!session?.user?.name) return;
    if (blogPost.meta.authorRef && blogPost.meta.authorRef !== 'Admin User') return;

    updateLocalPost((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        authorRef: session.user?.name ?? prev.meta.authorRef,
      },
    }));
  }, [session?.user?.name, blogPost.meta.authorRef, updateLocalPost]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!autosaveRef.current) {
      autosaveRef.current = true;
      return;
    }
    if (!hasUnsavedChanges) return;

    const handle = window.setTimeout(() => {
      try {
        window.localStorage.setItem(draftKey, JSON.stringify(blogPost));
      } catch (error) {
        console.error('Failed to persist draft locally', error);
      }
    }, 1000);

    return () => window.clearTimeout(handle);
  }, [blogPost, draftKey, hasUnsavedChanges]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!hasUnsavedChanges) return;

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

  const handleSave = useCallback(async () => {
    try {
      const doc = await persistBlog();
      toast.success('Draft saved');
      setSlugManuallyEdited(doc.meta.slug !== slugify(doc.meta.title ?? ''));
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'Failed to save blog');
    }
  }, [persistBlog]);

  const handlePublish = useCallback(async () => {
    if (!blogPost.meta.title?.trim()) {
      toast.error('Please add a title before publishing.');
      return;
    }

    try {
      const doc = await persistBlog({
        meta: {
          status: PostStatus.PUBLISHED,
          publishedAt: new Date().toISOString(),
        },
      });
      toast.success('Blog published');
      router.push(`/blogs/blog/${doc.meta.slug}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'Failed to publish blog');
    }
  }, [blogPost.meta.title, persistBlog, router]);

  const updateMeta = useCallback(
    (field: keyof MetaData, value: any) => {
      updateLocalPost((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          [field]: value,
        },
      }));
    },
    [updateLocalPost]
  );

  const updateLayout = useCallback(
    (field: keyof Layout, value: any) => {
      updateLocalPost((prev) => ({
        ...prev,
        layout: {
          ...prev.layout,
          [field]: value,
        },
      }));
    },
    [updateLocalPost]
  );

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: crypto.randomUUID(),
      type,
      props: {},
    };

    switch (type) {
      case BlockType.LEAD_PARAGRAPH:
        newBlock.props = { text: 'New lead paragraph...' };
        break;
      case BlockType.RICH_TEXT:
        newBlock.props = { content: '## New Section\n\nStart writing...' };
        break;
      case BlockType.VIDEO_EMBED:
        newBlock.props = { url: '', caption: '' };
        break;
      default:
        break;
    }

    updateLocalPost((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));
    setSelectedBlockId(newBlock.id);
    setActiveTab('inspector');
  };

  const updateBlock = (blockId: string, props: Record<string, any>) => {
    updateLocalPost((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) => (block.id === blockId ? { ...block, props } : block)),
    }));
  };

  const duplicateBlock = (blockId: string) => {
    updateLocalPost((prev) => {
      const blockToDuplicate = prev.blocks.find((block) => block.id === blockId);
      if (!blockToDuplicate) return prev;

      const duplicated: Block = {
        ...blockToDuplicate,
        id: crypto.randomUUID(),
        props: { ...blockToDuplicate.props },
      };

      const index = prev.blocks.findIndex((block) => block.id === blockId);
      const blocks = [...prev.blocks];
      blocks.splice(index + 1, 0, duplicated);
      return {
        ...prev,
        blocks,
      };
    });
  };

  const deleteBlock = (blockId: string) => {
    updateLocalPost((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((block) => block.id !== blockId),
    }));
    if (selectedBlockId === blockId) setSelectedBlockId(null);
  };

  const moveBlockByDrag = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;

    updateLocalPost((prev) => {
      const sourceIndex = prev.blocks.findIndex((block) => block.id === sourceId);
      const targetIndex = prev.blocks.findIndex((block) => block.id === targetId);
      if (sourceIndex === -1 || targetIndex === -1) return prev;

      const blocks = [...prev.blocks];
      const [moved] = blocks.splice(sourceIndex, 1);
      blocks.splice(targetIndex, 0, moved);

      return {
        ...prev,
        blocks,
      };
    });
  };

  const reorderBlock = (index: number, direction: 'up' | 'down') => {
    updateLocalPost((prev) => {
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.blocks.length) return prev;

      const blocks = [...prev.blocks];
      const [moved] = blocks.splice(index, 1);
      blocks.splice(newIndex, 0, moved);
      return {
        ...prev,
        blocks,
      };
    });
  };

  const getBlockPreviewText = (block: Block): string => {
    switch (block.type) {
      case BlockType.LEAD_PARAGRAPH:
        return `${block.props.text || ''}`.substring(0, 50) + '...';
      case BlockType.RICH_TEXT:
        return `${block.props.content || ''}`.substring(0, 50) + '...';
      case BlockType.CODE_BLOCK:
        return `Code: ${block.props.language || 'plaintext'}`;
      case BlockType.HERO_MEDIA:
      case BlockType.IMAGE_FIGURE:
        return block.props.alt || 'Image';
      case BlockType.VIDEO_EMBED:
        return block.props.url || 'Video Embed';
      default:
        return block.type;
    }
  };

  const selectedBlock = blogPost.blocks.find((block) => block.id === selectedBlockId) ?? null;
  const isPublished = blogPost.meta.status === PostStatus.PUBLISHED;

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setShowLeaveDialog(true);
    } else {
      router.push(DEFAULT_BACK_URL);
    }
  };

  const confirmLeave = () => {
    clearDraft();
    setHasUnsavedChanges(false);
    setShowLeaveDialog(false);
    router.push(DEFAULT_BACK_URL);
  };

  const cancelLeave = () => setShowLeaveDialog(false);

  const handleTitleChange = (value: string) => {
    updateLocalPost((prev) => {
      const nextSlug = slugify(value || '');
      return {
        ...prev,
        meta: {
          ...prev.meta,
          title: value,
          slug: slugManuallyEdited ? prev.meta.slug : nextSlug,
        },
      };
    });
  };

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);
    updateMeta('slug', slugify(value));
  };
  return (
    <>
      <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
        <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="flex items-center justify-between p-4 h-16">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> <Link href="/admin" className="text-sm font-medium">Back to Admin</Link>
              </button>
            </div>
            <div className="flex-1 px-4">
              <Input
                value={blogPost.meta.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Blog title..."
                className="text-lg font-semibold bg-transparent border-none p-0 h-auto focus-visible:ring-0 text-white placeholder:text-slate-500 w-full"
              />
            </div>
            <div className="flex items-center gap-3">
              {lastSaved && <span className="text-sm text-slate-400">Saved: {lastSaved.toLocaleTimeString()}</span>}
              <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
                {(['desktop', 'tablet', 'mobile'] as const).map((device) => (
                  <button
                    key={device}
                    onClick={() => setPreviewDevice(device)}
                    className={`h-8 w-8 p-0 flex items-center justify-center rounded-md ${
                      previewDevice === device ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {device === 'desktop' && <Monitor className="h-4 w-4" />}
                    {device === 'tablet' && <Tablet className="h-4 w-4" />}
                    {device === 'mobile' && <Smartphone className="h-4 w-4" />}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-3 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 flex items-center gap-2 disabled:opacity-60"
              >
                <Save className="h-4 w-4" /> {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handlePublish}
                disabled={isSaving}
                className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 rounded-md flex items-center gap-2 disabled:opacity-60"
              >
                <Globe className="h-4 w-4" /> {isPublished ? 'Update' : 'Publish'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-96 border-r border-slate-800 bg-slate-900/30 overflow-y-auto flex flex-col">
            <div className="p-4 border-b border-slate-800">
              <div className="grid grid-cols-3 gap-2 bg-slate-800/50 rounded-lg p-1">
                <TabButton active={activeTab === 'page'} onClick={() => setActiveTab('page')}>
                  Page
                </TabButton>
                <TabButton active={activeTab === 'blocks'} onClick={() => setActiveTab('blocks')}>
                  Blocks
                </TabButton>
                <TabButton active={activeTab === 'inspector'} onClick={() => setActiveTab('inspector')}>
                  Inspector
                </TabButton>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {activeTab === 'page' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>Page Settings</CardHeader>
                    <CardContent>
                      <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" value={blogPost.meta.slug} onChange={(e) => handleSlugChange(e.target.value)} />
                      </div>
                      <div>
                        <Label>Categories</Label>
                        <div className="p-2 border border-slate-600 rounded-md bg-slate-900 min-h-[40px]">
                          <div className="flex flex-wrap gap-2">
                            {blogPost.meta.categories.map((category) => (
                              <span
                                key={category}
                                className="flex items-center gap-1 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full"
                              >
                                {category}
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateMeta(
                                      'categories',
                                      blogPost.meta.categories.filter((item) => item !== category)
                                    )
                                  }
                                >
                                  &times;
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                        <Select
                          className="mt-2"
                          value=""
                          onChange={(e) => {
                            const category = e.target.value;
                            if (category && !blogPost.meta.categories.includes(category)) {
                              updateMeta('categories', [...blogPost.meta.categories, category]);
                            }
                          }}
                        >
                          <option value="" disabled>
                            Add a category...
                          </option>
                          {CATEGORIES.filter((category) => !blogPost.meta.categories.includes(category)).map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <Label>Layout Preset</Label>
                        <Select
                          value={blogPost.layout.preset}
                          onChange={(e) => updateLayout('preset', e.target.value as LayoutPreset)}
                        >
                          {LAYOUT_PRESETS.map((preset) => (
                            <option key={preset.value} value={preset.value}>
                              {preset.name}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              {activeTab === 'blocks' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Content Blocks</h3>
                    <Select onChange={(e) => addBlock(e.target.value as BlockType)} value="">
                      <option value="" disabled>
                        Add a new block...
                      </option>
                      {Object.values(BlockType).map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    {blogPost.blocks.map((block, index) => (
                      <div
                        key={block.id}
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData('blockId', block.id);
                          setDraggedBlockId(block.id);
                        }}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                          event.preventDefault();
                          const sourceId = event.dataTransfer.getData('blockId');
                          moveBlockByDrag(sourceId, block.id);
                        }}
                        onDragEnd={() => setDraggedBlockId(null)}
                        onClick={() => {
                          setSelectedBlockId(block.id);
                          setActiveTab('inspector');
                        }}
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.ctrlKey) {
                            if (event.key === 'ArrowUp') {
                              event.preventDefault();
                              reorderBlock(index, 'up');
                            } else if (event.key === 'ArrowDown') {
                              event.preventDefault();
                              reorderBlock(index, 'down');
                            }
                          }
                        }}
                        className={`p-3 rounded-lg border group transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          selectedBlockId === block.id ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'
                        } ${draggedBlockId === block.id ? 'opacity-30' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 cursor-move">
                            <GripVertical className="h-4 w-4 text-slate-400" />
                            <span className="text-white font-medium">{block.type}</span>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                reorderBlock(index, 'up');
                              }}
                              disabled={index === 0}
                              className="h-6 w-6 p-0 flex items-center justify-center text-slate-400 hover:text-white disabled:text-slate-600 disabled:cursor-not-allowed"
                              aria-label="Move block up"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                reorderBlock(index, 'down');
                              }}
                              disabled={index === blogPost.blocks.length - 1}
                              className="h-6 w-6 p-0 flex items-center justify-center text-slate-400 hover:text-white disabled:text-slate-600 disabled:cursor-not-allowed"
                              aria-label="Move block down"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                duplicateBlock(block.id);
                              }}
                              className="h-6 w-6 p-0 flex items-center justify-center text-slate-400 hover:text-white"
                              aria-label="Duplicate block"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                deleteBlock(block.id);
                              }}
                              className="h-6 w-6 p-0 flex items-center justify-center text-slate-400 hover:text-red-400"
                              aria-label="Delete block"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-slate-400 mt-1 ml-6 truncate">{getBlockPreviewText(block)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'inspector' && selectedBlock && (
                <BlockEditor block={selectedBlock} onUpdate={(props) => updateBlock(selectedBlock.id, props)} />
              )}
              {activeTab === 'inspector' && !selectedBlock && (
                <div className="text-sm text-slate-400">Select a block to configure its properties.</div>
              )}
            </div>
            <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
              Reading time: {blogPost.meta.readingTime} min · Status: {blogPost.meta.status}
            </div>
          </div>

          <div className="flex-1 bg-gray-950 overflow-y-auto">
            <PreviewPanel
              blogPost={blogPost}
              selectedBlockId={selectedBlockId}
              setSelectedBlockId={setSelectedBlockId}
              device={previewDevice}
            />
          </div>
        </div>
      </div>

      <AlertDialog open={showLeaveDialog} onOpenChange={(open) => (!open ? cancelLeave() : setShowLeaveDialog(open))}>
        <AlertDialogContent className="bg-slate-900 border border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Unsaved changes</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              You have unsaved changes. Leaving this page will discard them. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelLeave}>Stay</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLeave}>Leave without saving</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BlogEditor;




