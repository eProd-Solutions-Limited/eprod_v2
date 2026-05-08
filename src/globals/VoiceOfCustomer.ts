import { GlobalConfig } from 'payload'

export const VoiceOfCustomer: GlobalConfig = {
  slug: 'voice-of-customer',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Case Studies Page',
  },
  fields: [
    {
      name: 'quotes',
      type: 'array',
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
        { name: 'tag', type: 'text', required: true, admin: { description: 'e.g. "Bank Partner", "Agribusiness CEO"' } },
      ],
    },
  ],
}
