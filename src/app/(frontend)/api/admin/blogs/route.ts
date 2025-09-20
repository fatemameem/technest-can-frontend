import configPromise from '@payload-config';
import { getPayload } from 'payload';

import { calculateReadingTime } from '@/helpers/calculateReadingTime';
import { requireRole } from '@/lib/auth/requireRole';
import { buildAuthOptions } from '@/lib/auth/options';
import { PostStatus, LayoutPreset } from '@/types';
import { getServerSession } from 'next-auth';

const BLOG_COLLECTION = 'blogs';

type BlogEntry = {
  meta?: any;
  layout?: any;
  blocks?: any[];
  [key: string]: any;
};

function toArray<T>(input: T | T[] | { items?: T[] }): T[] {
  if (Array.isArray(input)) return input;
  if (Array.isArray((input as any)?.items)) return (input as any).items;
  return [input as T];
}

function ensureMeta(input: any, fallbackAuthor: { name?: string | null; id?: string | null }) {
  const meta = { ...(input?.meta ?? {}) };
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
  const auth = await requireRole(['admin', 'moderator']);
  if (!auth.ok) {
    return new Response(JSON.stringify(auth.json), { status: auth.status });
  }

  const session = await getServerSession(buildAuthOptions());
  const fallbackAuthor = {
    name: session?.user?.name ?? session?.user?.email ?? 'Unknown Author',
    id: (session?.user as any)?.id ?? null,
  };

  try {
    const body = await req.json();
    const items = toArray<BlogEntry>(body);

    const payload = await getPayload({ config: configPromise });
    const docs = [] as any[];

    for (const entry of items) {
      const blocks = Array.isArray(entry?.blocks) ? entry.blocks : [];
      const meta = ensureMeta(entry, fallbackAuthor);
      meta.readingTime = calculateReadingTime(blocks);

      const doc = await (payload as any).create({
        collection: BLOG_COLLECTION,
        data: {
          ...entry,
          meta,
          layout: ensureLayout(entry),
          blocks,
        },
        overrideAccess: true,
      });

      docs.push(doc);
    }

    return Response.json({ ok: true, count: docs.length, docs });
  } catch (error: any) {
    console.error('[admin/blogs] POST error', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to create blogs' }), { status: 500 });
  }
}

export async function GET() {
  const auth = await requireRole(['admin', 'moderator']);
  if (!auth.ok) {
    return new Response(JSON.stringify(auth.json), { status: auth.status });
  }

  try {
    const payload = await getPayload({ config: configPromise });
    const result = await (payload as any).find({
      collection: BLOG_COLLECTION,
      limit: 100,
      depth: 1,
      overrideAccess: true,
      sort: '-updatedAt',
    });
    return Response.json(result);
  } catch (error: any) {
    console.error('[admin/blogs] GET error', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to load blogs' }), { status: 500 });
  }
}
