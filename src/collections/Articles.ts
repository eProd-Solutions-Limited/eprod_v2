import { Block, CollectionConfig } from 'payload'

const richTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Rich Text', plural: 'Rich Text Blocks' },
  fields: [
    {
      name: 'content',
      type: 'richText', // Built-in Slate editor or custom
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
      validate: (val: string | null | undefined) => {
        if (!val || (!val.includes('youtube') && !val.includes('vimeo'))) {
          return 'Only YouTube or Vimeo URLs'
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
  ],
}

const profileQuoteBlock: Block = {
  slug: 'profileQuote',
  labels: { singular: 'Profile Quote', plural: 'Profile Quotes' },
  fields: [
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'jobTitle',
      type: 'text',
    },
    {
      name: 'company',
      type: 'text',
    },
    {
      name: 'question',
      type: 'text',
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
    },
  ],
}

export const Articles: CollectionConfig = {
  slug: 'articles',
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
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'content',
      type: 'blocks',
      blocks: [richTextBlock, imageBlock, videoBlock, gifBlock, quoteBlock, profileQuoteBlock],
      required: true,
      localized: true,
    },
  ],
}
