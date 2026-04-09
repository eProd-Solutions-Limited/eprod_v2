import { CollectionConfig } from 'payload'

export const TeamPages: CollectionConfig = {
  slug: 'team-pages',
  fields: [
    {
      name: 'sections',
      type: 'blocks',
      blocks: [
        {
          slug: 'section',
          fields: [
            {
              name: 'text',
              type: 'richText',
              required: true,
            },
            {
              name: 'media',
              type: 'blocks',
              blocks: [
                {
                  slug: 'imageMedia',
                  fields: [
                    { name: 'image', type: 'upload', relationTo: 'media' },
                    { name: 'position', type: 'select', options: ['left', 'right'] },
                  ],
                },
                {
                  slug: 'videoMedia',
                  fields: [
                    { name: 'url', type: 'text' },
                    { name: 'position', type: 'select', options: ['left', 'right'] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
