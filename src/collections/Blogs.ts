import type { CollectionConfig } from 'payload';

import { generateUniqueSlug } from '@/helpers/generateUniqueSlug';
import { calculateReadingTime } from '@/helpers/calculateReadingTime';
import { BlockType, LayoutPreset, PostStatus } from '@/types';

const statusOptions = Object.values(PostStatus).map((value) => ({ label: value, value }));
const layoutOptions = Object.values(LayoutPreset).map((value) => ({ label: value, value }));

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'meta.status', 'meta.updatedAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeValidate: [
      async ({ data, req, originalDoc }) => {
        if (!data) return data;

        data.meta = data.meta ?? {};
        data.blocks = Array.isArray(data.blocks) ? data.blocks : originalDoc?.blocks ?? [];
        data.layout = data.layout ?? originalDoc?.layout ?? { preset: LayoutPreset.DEFAULT };

        data.meta.slug = await generateUniqueSlug({
          collection: 'blogs',
          data: {
            slug: data.meta.slug,
            title: data.meta.title,
          },
          req,
          originalDoc: originalDoc
            ? {
                id: originalDoc.id,
                title: originalDoc.meta?.title ?? originalDoc.title,
                slug: originalDoc.meta?.slug ?? originalDoc.slug,
              }
            : undefined,
          slugFieldPath: 'meta.slug',
        });

        const metaTitle = data.meta.title ?? originalDoc?.meta?.title ?? originalDoc?.title ?? data.title;
        data.title = metaTitle ?? '';

        data.meta.status = data.meta.status ?? PostStatus.DRAFT;
        data.meta.categories = Array.isArray(data.meta.categories) ? data.meta.categories : [];
        data.meta.tags = Array.isArray(data.meta.tags) ? data.meta.tags : [];

        if (!data.layout?.preset) {
          data.layout = {
            ...(data.layout ?? {}),
            preset: LayoutPreset.DEFAULT,
          };
        }

        return data;
      },
    ],
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        if (!data) return data;

        const user = (req as any)?.user ?? {};
        data.meta = data.meta ?? {};
        data.blocks = Array.isArray(data.blocks) ? data.blocks : originalDoc?.blocks ?? [];

        if (originalDoc?.meta?.authorRef) {
          data.meta.authorRef = originalDoc.meta.authorRef;
        } else if (!data.meta.authorRef) {
          data.meta.authorRef = user.name || user.email || 'Unknown Author';
        }

        if (originalDoc?.meta?.author) {
          data.meta.author = originalDoc.meta.author;
        } else if (!data.meta.author && user.id) {
          data.meta.author = user.id;
        }

        data.meta.readingTime = calculateReadingTime(data.blocks);
        data.meta.updatedAt = new Date().toISOString();

        if (data.meta.status === PostStatus.PUBLISHED && !data.meta.publishedAt) {
          data.meta.publishedAt = new Date().toISOString();
        }

        data.title = data.meta.title ?? data.title ?? originalDoc?.title ?? '';

        if (!data.layout?.preset) {
          data.layout = {
            ...(data.layout ?? {}),
            preset: LayoutPreset.DEFAULT,
          };
        }

        return data;
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        hidden: true,
        readOnly: true,
      },
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'subtitle', type: 'text' },
        {
          name: 'authorRef',
          type: 'text',
          admin: { position: 'sidebar' },
        },
        {
          name: 'author',
          type: 'relationship',
          relationTo: 'users',
          admin: { position: 'sidebar' },
        },
        {
          name: 'slug',
          type: 'text',
          unique: true,
          index: true,
          admin: { position: 'sidebar' },
        },
        {
          name: 'tags',
          type: 'json',
          defaultValue: [],
        },
        {
          name: 'categories',
          type: 'json',
          defaultValue: [],
        },
        {
          name: 'readingTime',
          type: 'number',
          admin: { position: 'sidebar', readOnly: true },
        },
        {
          name: 'status',
          type: 'select',
          options: statusOptions,
          defaultValue: PostStatus.DRAFT,
        },
        {
          name: 'publishedAt',
          type: 'date',
          admin: { position: 'sidebar' },
        },
        {
          name: 'updatedAt',
          type: 'date',
          admin: { position: 'sidebar' },
        },
        {
          name: 'seo',
          type: 'group',
          fields: [
            { name: 'title', type: 'text' },
            { name: 'description', type: 'textarea' },
            { name: 'ogImageRef', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'layout',
      type: 'group',
      fields: [
        {
          name: 'preset',
          type: 'select',
          options: layoutOptions,
          defaultValue: LayoutPreset.DEFAULT,
        },
      ],
    },
    {
      name: 'blocks',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: Object.values(BlockType).map((value) => ({ label: value, value })),
          required: true,
        },
        {
          name: 'props',
          type: 'json',
        },
      ],
    },
  ],
  timestamps: true,
};

export default Blogs;


