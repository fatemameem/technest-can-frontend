import configPromise from '@payload-config';
import { getPayload } from 'payload';

import { PostStatus } from '@/types';

const BLOG_COLLECTION = 'blogs';

export async function GET(_: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const payload = await getPayload({ config: configPromise });
    const result = await (payload as any).find({
      collection: BLOG_COLLECTION,
      where: {
        and: [
          { 'meta.slug': { equals: slug } },
          { 'meta.status': { equals: PostStatus.PUBLISHED } },
        ],
      },
      limit: 1,
      depth: 1,
    });

    const doc = result.docs?.[0];
    if (!doc) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    }

    return Response.json({ doc });
  } catch (error: any) {
    console.error('[public/blogs/:slug] GET error', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to load blog' }), { status: 500 });
  }
}
