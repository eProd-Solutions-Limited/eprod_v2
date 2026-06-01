import type { CollectionConfig } from 'payload'

export const PopupRegistrations: CollectionConfig = {
  slug: 'popup-registrations',
  access: {
    read: () => false,
    create: () => true,
    update: () => false,
    delete: () => false,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'popup', 'createdAt'],
    description: 'All registrations submitted via popup forms on the site.',
  },
  fields: [
    {
      name: 'popup',
      type: 'relationship',
      relationTo: 'popups',
      required: true,
      admin: { description: 'The popup this registration came from.' },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'organization',
      type: 'text',
    },
  ],
  timestamps: true,
}
