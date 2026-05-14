import { GlobalConfig } from 'payload'

export const CaseStudiesCta: GlobalConfig = {
  slug: 'case-studies-cta',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Case Studies Page',
  },
  fields: [
    { name: 'heading', type: 'text', label: 'Heading' },
    { name: 'description', type: 'textarea', label: 'Description' },
    {
      name: 'primaryButtonLabel',
      type: 'text',
      label: 'Primary Button Label',
    },
    {
      name: 'primaryButtonLink',
      type: 'text',
      label: 'Primary Button Link',
      admin: { description: 'e.g. /#contact or https://...' },
    },
    {
      name: 'secondaryButtonLabel',
      type: 'text',
      label: 'Secondary Button Label',
    },
    {
      name: 'secondaryButtonLink',
      type: 'text',
      label: 'Secondary Button Link',
      admin: { description: 'e.g. /solutions or https://...' },
    },
  ],
}
