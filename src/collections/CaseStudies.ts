import { Block, CollectionBeforeValidateHook, CollectionConfig } from 'payload'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const autoSlug: CollectionBeforeValidateHook = ({ data, operation }) => {
  if (operation === 'create' && data?.title && !data.slug) {
    return { ...data, slug: slugify(data.title) }
  }
  return data
}

const richTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Rich Text', plural: 'Rich Text Blocks' },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
}

const imageBlock: Block = {
  slug: 'image',
  labels: { singular: 'Image', plural: 'Images' },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'width',
      type: 'select',
      options: [
        { label: 'Full Width', value: 'full' },
        { label: 'Half Width', value: 'half' },
        { label: 'Inline', value: 'inline' },
      ],
    },
  ],
}

const videoBlock: Block = {
  slug: 'video',
  labels: { singular: 'Video', plural: 'Videos' },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      validate: (val: string) => {
        if (!val.includes('youtube') && !val.includes('vimeo')) {
          return 'Only YouTube or Vimeo URLs are supported'
        }
        return true
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'autoplay',
      type: 'checkbox',
    },
  ],
}

const gifBlock: Block = {
  slug: 'gif',
  labels: { singular: 'GIF', plural: 'GIFs' },
  fields: [
    {
      name: 'gif',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}

const quoteBlock: Block = {
  slug: 'quote',
  labels: { singular: 'Quote', plural: 'Quotes' },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
    },
    {
      name: 'author',
      type: 'text',
    },
    {
      name: 'role',
      type: 'text',
    },
  ],
}

const statsBlock: Block = {
  slug: 'stats',
  labels: { singular: 'Stats Row', plural: 'Stats Rows' },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'industry', 'publishedAt'],
  },
  hooks: {
    beforeValidate: [autoSlug],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        description: 'Auto-generated from the title. Only edit if you need a custom URL.',
        condition: (_, siblingData) => Boolean(siblingData?.title),
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Hero image displayed on the card and at the top of the case study',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short summary shown on the listing card (1-2 sentences)',
      },
    },
    {
      name: 'client',
      type: 'text',
      admin: {
        description: 'Name of the client or company featured',
      },
    },
    {
      name: 'industry',
      type: 'text',
      admin: {
        description: 'e.g. Agribusiness, Microfinance, Digital Banking',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
    {
      name: 'content',
      type: 'blocks',
      blocks: [richTextBlock, imageBlock, videoBlock, gifBlock, quoteBlock, statsBlock],
      required: true,
    },
  ],
}
