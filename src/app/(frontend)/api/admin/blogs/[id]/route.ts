import configPromise from '@payload-config';
import { getPayload } from 'payload';

import { calculateReadingTime } from '@/helpers/calculateReadingTime';
import { requireRole } from '@/lib/auth/requireRole';
import { buildAuthOptions } from '@/lib/auth/options';
import { PostStatus, LayoutPreset } from '@/types';
import { getServerSession } from 'next-auth';

const BLOG_COLLECTION = 'blogs';

function ensureMeta(input: any, fallback: { name?: string | null; id?: string | null }, previous?: any) {
  const meta = { ...(input?.meta ?? {}) };
  meta.tags = Array.isArray(meta.tags) ? meta.tags : previous?.tags ?? [];
  meta.categories = Array.isArray(meta.categories) ? meta.categories : previous?.categories ?? [];
  meta.status = meta.status ?? previous?.status ?? PostStatus.DRAFT;
  meta.authorRef = previous?.authorRef ?? meta.authorRef ?? fallback.name ?? 'Unknown Author';
  meta.author = previous?.author ?? meta.author ?? fallback.id ?? undefined;
  meta.updatedAt = new Date().toISOString();
  if (meta.status === PostStatus.PUBLISHED && !meta.publishedAt) {
    meta.publishedAt = new Date().toISOString();
  }
  return meta;
}

function ensureLayout(input: any, previous?: any) {
  const layout = { ...(input?.layout ?? previous ?? {}) };
  layout.preset = layout.preset ?? LayoutPreset.DEFAULT;
  return layout;
}

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(['admin', 'moderator']);
  if (!auth.ok) {
    return new Response(JSON.stringify(auth.json), { status: auth.status });
  }

  try {
    const { id } = await context.params;
    const payload = await getPayload({ config: configPromise });
    const doc = await (payload as any).findByID({ collection: BLOG_COLLECTION, id, overrideAccess: true, depth: 1 });
    return Response.json({ doc });
  } catch (error: any) {
    if (error?.status === 404) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    }
    console.error('[admin/blogs/:id] GET error', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to load blog' }), { status: 500 });
  }
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(['admin', 'moderator']);
  if (!auth.ok) {
    return new Response(JSON.stringify(auth.json), { status: auth.status });
  }

  const session = await getServerSession(buildAuthOptions());
  const fallback = {
    name: session?.user?.name ?? session?.user?.email ?? 'Unknown Author',
    id: (session?.user as any)?.id ?? null,
  };

  try {
    const { id } = await context.params;
    const body = await req.json();
    const payload = await getPayload({ config: configPromise });

    const existing = await (payload as any).findByID({ collection: BLOG_COLLECTION, id, overrideAccess: true, depth: 0 });
    const blocks = Array.isArray(body?.blocks) ? body.blocks : existing.blocks ?? [];
    const meta = ensureMeta(body, fallback, existing.meta);
    meta.readingTime = calculateReadingTime(blocks);

    const doc = await (payload as any).update({
      collection: BLOG_COLLECTION,
      id,
      data: {
        ...body,
        meta,
        layout: ensureLayout(body, existing.layout),
        blocks,
      },
      overrideAccess: true,
    });

    return Response.json({ ok: true, doc });
  } catch (error: any) {
    console.error('[admin/blogs/:id] PATCH error', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to update blog' }), { status: 500 });
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(['admin', 'moderator']);
  if (!auth.ok) {
    return new Response(JSON.stringify(auth.json), { status: auth.status });
  }

  try {
    const { id } = await context.params;
    const payload = await getPayload({ config: configPromise });
    await (payload as any).delete({ collection: BLOG_COLLECTION, id, overrideAccess: true });
    return Response.json({ ok: true });
  } catch (error: any) {
    console.error('[admin/blogs/:id] DELETE error', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to delete blog' }), { status: 500 });
  }
}
