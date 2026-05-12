import type { CollectionConfig } from 'payload'

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  labels: { singular: 'Enquiry', plural: 'Enquiries' },
  admin: {
    useAsTitle: 'company',
    defaultColumns: ['company', 'email', 'challenge', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'company',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'challenge',
      type: 'text',
      required: true,
    },
    {
      name: 'sourceSection',
      type: 'text',
      label: 'Source Section',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Won', value: 'won' },
        { label: 'Lost', value: 'lost' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal Notes',
    },
  ],
}
