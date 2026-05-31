import { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'venue', 'startDate', 'endDate'],
    description: 'Manage events — conferences, expos, and field visits.',
    group: 'Content',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Event Name',
    },
    {
      name: 'venue',
      type: 'text',
      required: true,
      label: 'Venue / Location',
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      label: 'Start Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMM d, yyyy',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'End Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMM d, yyyy',
        },
        description: 'Leave blank if the event is a single day.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
      admin: {
        description: 'Full event description. Supports bold, italic, underline, colour, links, lists, and more.',
      },
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Event Photos',
      admin: {
        description:
          'Select or upload all event photos at once. They are automatically named "[Event Name] 1", "[Event Name] 2", etc.',
      },
    },
    {
      name: 'imageLabels',
      type: 'array',
      label: 'Custom Photo Labels (Optional)',
      admin: {
        description:
          'Override the auto-name for specific photos. Enter the photo number (1 = first photo) and your custom label. Check the box to activate it.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enable this custom label',
          defaultValue: true,
        },
        {
          name: 'photoNumber',
          type: 'number',
          label: 'Photo # (1 = first)',
          required: true,
          min: 1,
          admin: {
            condition: (_data: any, siblingData: any) => !!siblingData?.enabled,
          },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Custom Label',
          required: true,
          admin: {
            condition: (_data: any, siblingData: any) => !!siblingData?.enabled,
          },
        },
      ],
    },
  ],
}
