import configPromise from '@payload-config';
import { getPayload } from 'payload';

import { PostStatus } from '@/types';

const BLOG_COLLECTION = 'blogs';

export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config: configPromise });
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit')) || 12, 100);
    const page = Math.max(Number(searchParams.get('page')) || 1, 1);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');

    const where: any = {
      'meta.status': {
        equals: PostStatus.PUBLISHED,
      },
    };

    if (category) {
      where['meta.categories'] = { contains: category };
    }

    if (tag) {
      where['meta.tags'] = { contains: tag };
    }

    const docs = await (payload as any).find({
      collection: BLOG_COLLECTION,
      where,
      sort: '-meta.publishedAt',
      limit,
      page,
      depth: 1,
    });

    return Response.json(docs);
  } catch (error: any) {
    console.error('[public/blogs] GET error', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to load blogs' }), { status: 500 });
  }
}
