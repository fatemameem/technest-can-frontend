import 'server-only'
// collections/Podcasts.ts
import { generateUniqueSlug } from '@/helpers/generateUniqueSlug';
import { CollectionConfig } from 'payload'

export const Podcasts: CollectionConfig = {
  slug: 'podcasts',
  admin: {
    defaultColumns: ['title', 'published', 'updatedAt'],
    useAsTitle: 'title',
  },
  access: {
    // Only authenticated users can read raw REST data; prevents public JSON endpoint exposure
    read: ({ req: { user } }) => Boolean(user),
    // create: () => true, // Anyone can create
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    beforeValidate: [
      async ({ data, req, originalDoc }) => {
          if (!data) return data;
          data.slug = await generateUniqueSlug({
            collection: 'podcasts',
            data,
            req,
            originalDoc
          });
          return data;
        },
      ],
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Title of the Podcast',
        required: true,
      },
      {
        name: 'slug',
        type: 'text',
        label: 'Slug',
        unique: true,
        index: true,
        admin: { position: 'sidebar' },
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Description',
      },
      {
        name: 'thumbnail',
        type: 'upload',
        label: 'Thumbnail',
        relationTo: 'media',
      },
      {
        name: 'socialLinks',
        type: 'group',
        label: 'Social Links',
        fields: [
          {
            name: 'linkedin',
            type: 'text',
            label: 'LinkedIn URL',
          },
          {
            name: 'instagram',
            type: 'text',
            label: 'Instagram URL',
          },
          {
            name: 'facebook',
            type: 'text',
            label: 'Facebook URL',
          },
        ],
      
      },
      {
        name: 'driveLink',
        type: 'text',
        label: 'Drive Link',
      },
      {
        name: 'learnMoreLinks',
        type: 'array',
        label: 'Learn More Links',
        fields: [
          {
            name: 'label',
            type: 'text',
            label: 'Link Label',
            required: true,
          },
          {
            name: 'url',
            type: 'text',
            label: 'URL',
            required: true,
          }
        ]
      },
      {
        name: 'published',
        type: 'checkbox',
        label: 'Published',
        defaultValue: false,
      },
    ],
    timestamps: true, // This gives us createdAt and updatedAt (covers your Timestamp field)
}
