import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: () => true, // allow public read
    create: ({ req: { user } }) => Boolean(user),
    // create: () => true, // allow public create
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    // Email added by default
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Moderator', value: 'moderator' },
      ],
      required: true,
      admin: { position: 'sidebar' },
    },
  ],
}
