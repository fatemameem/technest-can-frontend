import 'server-only'
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

        // Set author from session if not provided
        if (!data.meta.author && req.user) {
          data.meta.author = req.user.id;
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
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        if (!doc || !req.payload) return;

        const currentEventId = typeof doc.linkedEvent === 'string' ? doc.linkedEvent : doc.linkedEvent?.id;
        const previousEventId = typeof previousDoc?.linkedEvent === 'string' ? previousDoc.linkedEvent : previousDoc?.linkedEvent?.id;
        const isPublished = doc.meta?.status === PostStatus.PUBLISHED;
        const wasPublished = previousDoc?.meta?.status === PostStatus.PUBLISHED;
        const recapUrl = `/blogs/blog/${doc.meta?.slug}`;

        try {
          // Clear recap link from previous event if:
          // 1. Blog was unpublished
          // 2. Event was changed to a different event
          // 3. Event was unlinked
          if (previousEventId && (
            (wasPublished && !isPublished) || // Unpublished
            (currentEventId !== previousEventId) // Event changed or unlinked
          )) {
            await req.payload.update({
              collection: 'events',
              id: previousEventId,
              data: {
                links: {
                  recapUrl: null,
                },
              },
              overrideAccess: true,
            });
          }

          // Set recap link on current event if blog is published and event is linked
          if (isPublished && currentEventId && currentEventId !== previousEventId) {
            // Get current event to preserve existing links
            const currentEvent = await req.payload.findByID({
              collection: 'events',
              id: currentEventId,
              overrideAccess: true,
            });

            await req.payload.update({
              collection: 'events',
              id: currentEventId,
              data: {
                links: {
                  ...currentEvent.links,
                  recapUrl: recapUrl,
                },
              },
              overrideAccess: true,
            });
          }
        } catch (error) {
          req.payload?.logger?.error('Error updating event recap link:', error);
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'linkedEvent',
      label: 'Linked Event',
      type: 'relationship',
      relationTo: 'events',
      hasMany: false,
      admin: {
        position: 'sidebar',
        description: 'Link this blog to an event as a recap post',
      },
    },
    // Add cover image field
    {
      name: 'coverImage',
      type: 'upload',
      label: 'Cover Image',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Optional cover image for the blog post',
      },
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
        },
        {
          name: 'authorRef',
          type: 'text',
          label: 'Author Reference (deprecated)',
          admin: {
            position: 'sidebar',
            description: 'Legacy field - use author relation instead',
          },
        },
        {
          name: 'author',
          type: 'relationship',
          relationTo: 'team-members',
          hasMany: false,
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'slug',
          type: 'text',
          unique: true,
          index: true,
          admin: {
            position: 'sidebar',
            description: 'Auto-generated from title if left empty',
          },
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
          admin: {
            position: 'sidebar',
            readOnly: true,
            description: 'Auto-calculated from content',
          },
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
          admin: {
            description: 'Auto-set when first published',
            position: 'sidebar',
          },
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
            // Change ogImageRef to use Media upload
            {
              name: 'ogImage',
              type: 'upload',
              label: 'OG Image',
              relationTo: 'media',
              required: false,
            },
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
          admin: {
            description: 'Block properties - for images, props.mediaId stores the Media ID',
          },
        },
      ],
    },
  ],
  timestamps: true,
};

export default Blogs;


