import { GlobalConfig } from 'payload'

export const LogoWall: GlobalConfig = {
  slug: 'logo-wall',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Case Studies Page',
  },
  fields: [
    {
      name: 'agribusinessLogos',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'bankLogos',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
  ],
}
