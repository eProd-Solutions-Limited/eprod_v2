import type { CollectionConfig } from 'payload'

export const CTAConfig: CollectionConfig = {
  slug: 'cta-config',
  admin: {
    useAsTitle: 'title',
    description: 'Configure where enquiry form submissions are delivered.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Internal label for this config (e.g. "Main Enquiries")' },
    },
    {
      name: 'to',
      type: 'text',
      required: true,
      admin: { description: 'Email address that receives enquiry notifications (e.g. enquiries@eprod.com)' },
    },
  ],
}
