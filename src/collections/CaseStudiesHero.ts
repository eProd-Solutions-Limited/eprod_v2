import type { CollectionConfig } from 'payload'

export const CaseStudiesHeroCollection: CollectionConfig = {
  slug: 'case-studies-hero',
  labels: {
    singular: 'Case Studies Hero Image',
    plural: 'Case Studies Hero Images',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
