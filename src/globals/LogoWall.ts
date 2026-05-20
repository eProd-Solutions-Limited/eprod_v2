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
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'link', type: 'text', label: 'Link URL', admin: { description: 'Optional URL — clicking the logo will open this link in a new tab.' } },
        { name: 'active', type: 'checkbox', defaultValue: true, admin: { description: 'Uncheck to hide this logo from the site.' } },
      ],
    },
    {
      name: 'bankLogos',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'link', type: 'text', label: 'Link URL', admin: { description: 'Optional URL — clicking the logo will open this link in a new tab.' } },
        { name: 'active', type: 'checkbox', defaultValue: true, admin: { description: 'Uncheck to hide this logo from the site.' } },
      ],
    },
  ],
}
