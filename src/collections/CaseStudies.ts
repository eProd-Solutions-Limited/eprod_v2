import { CollectionConfig } from 'payload'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'tag'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'client',
      type: 'text',
      admin: { description: 'e.g. "Novos Horizontes — Poultry Sector"' },
    },
    {
      name: 'tag',
      type: 'select',
      options: [
        { label: 'Financial Inclusion', value: 'Financial Inclusion' },
        { label: 'EUDR Traceability', value: 'EUDR Traceability' },
        { label: 'Operational Efficiency', value: 'Operational Efficiency' },
      ],
      admin: { description: 'Category shown in the filter bar' },
    },
    {
      name: 'headline',
      type: 'text',
      admin: { description: 'Bold card headline, e.g. "Unlocking $2M in Input Financing..."' },
    },
    {
      name: 'situation',
      type: 'textarea',
      admin: { description: 'Challenge — what problem did the client face?' },
    },
    {
      name: 'action',
      type: 'textarea',
      admin: { description: 'Solution — what did eProd implement?' },
    },
    {
      name: 'result',
      type: 'textarea',
      admin: { description: 'Impact — measurable outcome' },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      defaultValue: 'Read Full Case Study',
    },
    {
      name: 'hasVideo',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
