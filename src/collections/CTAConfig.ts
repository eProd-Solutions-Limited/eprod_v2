import type { CollectionConfig } from 'payload'

export const CTAConfig: CollectionConfig = {
  slug: 'cta-config',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'group',
      fields: [
        {
          name: 'to',
          type: 'text',
          required: true,
          admin: {
            description: 'Recipient email address',
          },
        },
        {
          name: 'from',
          type: 'text',
          required: true,
          admin: {
            description: 'Sender email address',
          },
        },
        {
          name: 'subject',
          type: 'text',
          required: true,
          admin: {
            description: 'Email subject line',
          },
        },
        {
          name: 'htmlContent',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Use HTML content type',
          },
        },
        {
          name: 'body',
          type: 'richText',
          required: true,
          admin: {
            description: 'Email body. Use {company}, {email}, {challenge} for dynamic fields',
          },
        },
        {
          name: 'headers',
          type: 'array',
          fields: [
            {
              name: 'key',
              type: 'text',
              required: true,
            },
            {
              name: 'value',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            description: 'Additional email headers',
          },
        },
        {
          name: 'attachments',
          type: 'upload',
          relationTo: 'media',
          hasMany: true,
          admin: {
            description: 'File attachments',
          },
        },
      ],
    },
  ],
}
