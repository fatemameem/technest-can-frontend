import configPromise from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

import BlogArticle from '@/components/blog/BlogArticle';
import { PostStatus } from '@/types';

const BLOG_COLLECTION = 'blogs';

interface BlogSlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogSlugPage({ params }: BlogSlugPageProps) {
  const { slug } = await params;
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
    notFound();
  }

  return <BlogArticle blog={doc as any} />;
}
