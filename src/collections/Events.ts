// collections/Events.ts
import 'server-only'
import { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    defaultColumns: ['title', 'date', 'published', 'updatedAt'],
    useAsTitle: 'title',
  },
  access: {
    // Only authenticated users can read raw REST data; prevents public JSON endpoint exposure
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    // create: () => true, // Anyone can create
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterDelete: [
      async ({ doc, req }) => {
        // Clean up thumbnail when event is deleted
        if (doc.thumbnail) {
          const thumbnailId = typeof doc.thumbnail === 'string' ? doc.thumbnail : doc.thumbnail.id;
          if (thumbnailId) {
            try {
              await req.payload.delete({
                collection: 'media',
                id: thumbnailId,
                overrideAccess: true,
              });
              console.log(`✅ Deleted thumbnail ${thumbnailId} from event deletion`);
            } catch (error) {
              console.error(`❌ Error deleting thumbnail ${thumbnailId}:`, error);
            }
          }
        }
      },
    ],
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        if (!data || !originalDoc) return data;

        // Check if thumbnail was replaced
        if (originalDoc.thumbnail && data.thumbnail) {
          const oldThumbId = typeof originalDoc.thumbnail === 'string' ? originalDoc.thumbnail : originalDoc.thumbnail.id;
          const newThumbId = typeof data.thumbnail === 'string' ? data.thumbnail : data.thumbnail?.id;
          
          if (oldThumbId && newThumbId && oldThumbId !== newThumbId) {
            try {
              await req.payload.delete({
                collection: 'media',
                id: oldThumbId,
                overrideAccess: true,
              });
              console.log(`✅ Deleted replaced thumbnail ${oldThumbId}`);
            } catch (error) {
              console.error(`❌ Error deleting replaced thumbnail ${oldThumbId}:`, error);
            }
          }
        }

        return data;
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Event Title',
      required: true,
    },
    {
      name: 'topic',
      type: 'text',
      label: 'Topic',
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
      name: 'eventDetails',
      type: 'group',
      label: 'Event Details',
      fields: [
        {
          name: 'date',
          type: 'date',
          label: 'Event Date',
          required: true,
        },
        {
          name: 'timeStart',
          type: 'text',
          label: 'Event Start Time',
        },
        {
          name: 'timeEnd',
          type: 'text',
          label: 'Event End Time',
        },
        {
          name: 'timeZone',
          type: 'text',
          label: 'Time Zone',
        },
        {
          name: 'location',
          type: 'text',
          label: 'Location',
        },
      ],
    },
    {
      name: 'links',
      type: 'group',
      label: 'Event Links',
      fields: [
        {
          name: 'lumaLink',
          type: 'text',
          label: 'Lu.ma Link',
        },
        {
          name: 'zoomLink',
          type: 'text',
          label: 'Zoom Link',
        },
        {
          name: 'recapUrl',
          type: 'text',
          label: 'Recap Blog URL',
          admin: {
            readOnly: true,
            description: 'Auto-generated link to the event recap blog post',
          },
        },
      ],
    },
    {
      name: 'sponsors',
      type: 'textarea',
      label: 'Sponsors',
    },
    {
      name: 'published',
      type: 'checkbox',
      label: 'Published',
      defaultValue: false,
    },
  ],
  timestamps: true,
}

// Collections only - no Media collection needed since we're using URL links
