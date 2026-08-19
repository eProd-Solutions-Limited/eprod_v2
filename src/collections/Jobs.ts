import type { CollectionConfig } from 'payload'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    description: 'Open job listings shown on the About page.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Job Title',
    },
    {
      name: 'department',
      type: 'text',
      required: true,
      label: 'Department',
      admin: {
        description: 'e.g. Engineering, Product, Sales',
      },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      label: 'Location',
      admin: {
        description: 'e.g. Nairobi, Remote',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Job Description',
      admin: {
        description: 'Optional brief description shown on the About page and in Google job search results.',
      },
    },
    {
      name: 'jdFile',
      type: 'upload',
      relationTo: 'media',
      label: 'Job Description File',
      filterOptions: {
        or: [
          { mimeType: { equals: 'application/pdf' } },
          { mimeType: { equals: 'application/msword' } },
          { mimeType: { equals: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' } },
        ],
      },
      admin: {
        description: 'Optional. Upload a PDF or Word doc with the full job description for applicants to download.',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Employment Type',
      options: [
        { label: 'Full-time', value: 'FULL_TIME' },
        { label: 'Part-time', value: 'PART_TIME' },
        { label: 'Contract', value: 'CONTRACT' },
      ],
    },
    {
      name: 'applyEmail',
      type: 'email',
      label: 'Apply Email',
      admin: {
        description: 'Optional. Defaults to careers@eprod-solutions.com if left blank.',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      admin: {
        description: 'Uncheck to hide this role without deleting it.',
      },
    },
  ],
}
