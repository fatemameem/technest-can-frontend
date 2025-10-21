import configPromise from '@payload-config';
import { getPayload } from 'payload';

import { calculateReadingTime } from '@/helpers/calculateReadingTime';
import { requireRole } from '@/lib/auth/requireRole';
import { buildAuthOptions } from '@/lib/auth/options';
import { PostStatus, LayoutPreset, BlockType } from '@/types';
import { getServerSession } from 'next-auth';

const BLOG_COLLECTION = 'blogs';

type BlogEntry = {
  meta?: any;
  layout?: any;
  blocks?: any[];
  linkedEvent?: string | null; // Add linkedEvent to the type
  [key: string]: any;
};

function toArray<T>(input: T | T[] | { items?: T[] }): T[] {
  if (Array.isArray(input)) return input;
  if (Array.isArray((input as any)?.items)) return (input as any).items;
  return [input as T];
}

function ensureMeta(input: any, fallbackAuthor: { name?: string | null; id?: string | null }, rootTitle?: string) {
  const meta = { ...(input?.meta ?? {}) };
  
  // Ensure meta.title is set - priority: meta.title > rootTitle > fallback
  meta.title = meta.title || rootTitle || 'Untitled Blog Post';
  
  meta.tags = Array.isArray(meta.tags) ? meta.tags : [];
  meta.categories = Array.isArray(meta.categories) ? meta.categories : [];
  meta.status = meta.status ?? PostStatus.DRAFT;
  meta.authorRef = meta.authorRef ?? fallbackAuthor.name ?? 'Unknown Author';
  meta.author = meta.author ?? fallbackAuthor.id ?? undefined;
  meta.updatedAt = new Date().toISOString();
  if (meta.status === PostStatus.PUBLISHED && !meta.publishedAt) {
    meta.publishedAt = new Date().toISOString();
  }
  return meta;
}

function ensureLayout(input: any) {
  const layout = { ...(input?.layout ?? {}) };
  layout.preset = layout.preset ?? LayoutPreset.DEFAULT;
  return layout;
}

export async function POST(req: Request) {
  try {
    const auth = await requireRole(['admin', 'moderator']);
    if (!auth.ok) {
      return new Response(JSON.stringify(auth.json), { status: auth.status });
    }

    const payload = await getPayload({ config: configPromise });
    const session = await getServerSession(buildAuthOptions());
    const user = (session as any)?.user;
    const fallbackAuthor = { name: user?.name ?? null, id: user?._id ?? user?.id ?? null };

    const body = await req.json();
    const entries = toArray<BlogEntry>(body);
    const results = [];

    for (const entry of entries) {
      // Validate cover image if provided
      if (entry.coverImage && typeof entry.coverImage === 'string') {
        try {
          await payload.findByID({
            collection: 'media',
            id: entry.coverImage,
          });
        } catch (e) {
          return Response.json(
            { error: `Cover image media not found with ID: ${entry.coverImage}` },
            { status: 404 }
          );
        }
      }

      // Validate image blocks
      if (entry.blocks && Array.isArray(entry.blocks)) {
        for (const block of entry.blocks) {
          if (block.type === BlockType.IMAGE_FIGURE && block.props?.mediaId) {
            try {
              await payload.findByID({
                collection: 'media',
                id: block.props.mediaId,
              });
            } catch (e) {
              return Response.json(
                { error: `Image block media not found with ID: ${block.props.mediaId}` },
                { status: 404 }
              );
            }
          }
        }
      }

      // ENSURE ROOT TITLE IS SET FROM META IF MISSING
      const rootTitle = entry.title || entry.meta?.title || 'Untitled Blog Post';

      // Validate that we have a title
      if (!rootTitle || rootTitle.trim() === '') {
        return Response.json(
          { error: 'Title is required' },
          { status: 400 }
        );
      }

      // Pass rootTitle to ensureMeta to ensure meta.title is set
      const meta = ensureMeta(entry, fallbackAuthor, rootTitle);
      const layout = ensureLayout(entry.layout || {});

      const doc = await payload.create({
        collection: BLOG_COLLECTION,
        data: {
          title: rootTitle, // Use fallback logic
          linkedEvent: entry.linkedEvent || null,
          coverImage: entry.coverImage || meta.coverImage || null,
          meta, // meta.title is now guaranteed to be set
          layout,
          blocks: entry.blocks || [],
        } as any,
        overrideAccess: true,
        depth: 2,
      });

      results.push(doc);
    }

    return Response.json({ ok: true, count: results.length, docs: results });
  } catch (e: any) {
    console.error('[admin/blogs] POST error', e);
    return Response.json({ error: e?.message || 'Failed to create blogs' }, { status: 500 });
  }
}

export async function GET() {
  const auth = await requireRole(['admin', 'moderator']);
  if (!auth.ok) {
    return new Response(JSON.stringify(auth.json), { status: auth.status });
  }

  try {
    const payload = await getPayload({ config: configPromise });
    const res = await (payload as any).find({ collection: BLOG_COLLECTION, limit: 200, sort: '-meta.updatedAt', overrideAccess: true });
    return Response.json(res);
  } catch (error: any) {
    console.error('[admin/blogs] GET error', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to load blogs' }), { status: 500 });
  }
}
