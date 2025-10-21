import 'server-only';
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
    depth: 2, // CRITICAL: Populate coverImage relationship
  });

  const doc = result.docs?.[0];
  if (!doc) {
    notFound();
  }

  // Normalize the blog document to match BlogPost interface
  const blogPost = {
    id: doc.id,
    title: doc.title,
    linkedEvent: doc.linkedEvent || null,
    meta: {
      title: doc.meta?.title || doc.title || 'Untitled',
      subtitle: doc.meta?.subtitle,
      authorRef: doc.meta?.authorRef || 'Unknown Author',
      author: doc.meta?.author,
      slug: doc.meta?.slug || slug,
      tags: Array.isArray(doc.meta?.tags) ? doc.meta.tags : [],
      categories: Array.isArray(doc.meta?.categories) ? doc.meta.categories : [],
      readingTime: doc.meta?.readingTime || 0,
      status: doc.meta?.status || PostStatus.PUBLISHED,
      publishedAt: doc.meta?.publishedAt,
      updatedAt: doc.meta?.updatedAt || new Date().toISOString(),
      // Handle cover image - extract from populated object or use ID
      coverImage: 
        typeof doc.coverImage === 'object' && doc.coverImage?.id 
          ? doc.coverImage.id 
          : typeof doc.coverImage === 'string' 
          ? doc.coverImage 
          : doc.meta?.coverImage || undefined,
      coverImageUrl: 
        typeof doc.coverImage === 'object' && doc.coverImage?.cloudinary?.secureUrl
          ? doc.coverImage.cloudinary.secureUrl
          : doc.meta?.coverImageUrl || undefined,
      seo: {
        title: doc.meta?.seo?.title || '',
        description: doc.meta?.seo?.description || '',
        ogImage: doc.meta?.seo?.ogImage,
      },
    },
    layout: {
      preset: doc.layout?.preset || 'default',
    },
    blocks: Array.isArray(doc.blocks) 
      ? doc.blocks.map((block: any) => ({
          id: block.id || crypto.randomUUID(),
          type: block.type,
          props: {
            ...block.props,
            // Normalize image blocks to use mediaUrl
            ...(block.type === 'HeroMedia' || block.type === 'ImageFigure'
              ? {
                  mediaUrl: block.props?.mediaUrl || block.props?.mediaRef,
                  mediaId: block.props?.mediaId,
                  alt: block.props?.alt || '',
                  caption: block.props?.caption,
                }
              : {}),
          },
        }))
      : [],
  };

  return <BlogArticle blogPost={blogPost} />;
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  
  const result = await (payload as any).find({
    collection: BLOG_COLLECTION,
    where: {
      'meta.status': { equals: PostStatus.PUBLISHED },
    },
    limit: 100,
    depth: 0, // Don't need to populate for just getting slugs
  });

  return result.docs.map((doc: any) => ({
    slug: doc.meta?.slug || doc.slug,
  }));
}
