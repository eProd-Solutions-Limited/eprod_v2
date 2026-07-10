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
      name: 'contactName',
      type: 'text',
      label: 'Name of Person',
    },
    {
      name: 'position',
      type: 'text',
      label: 'Position in the Company',
    },
    {
      name: 'numberOfFarmers',
      type: 'text',
      label: 'Number of Farmers',
    },
    {
      name: 'valueChain',
      type: 'select',
      label: 'Value Chain',
      options: [
        { label: 'Coffee, Cocoa & Tea', value: 'coffee_cocoa_tea' },
        { label: 'Horticulture', value: 'horticulture' },
        { label: 'Dairy', value: 'dairy' },
        { label: 'Seeds', value: 'seeds' },
        { label: 'Grains & Pulses', value: 'grains_pulses' },
        { label: 'Spices', value: 'spices' },
        { label: 'Nuts', value: 'nuts' },
        { label: 'Oil & Tree Crops', value: 'oil_tree_crops' },
        { label: 'Apiculture', value: 'apiculture' },
        { label: 'Pisciculture', value: 'pisciculture' },
        { label: 'Poultry', value: 'poultry' },
        { label: 'Rubber & Gum', value: 'rubber_gum' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'requestFor',
      type: 'text',
      label: 'Request For',
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
