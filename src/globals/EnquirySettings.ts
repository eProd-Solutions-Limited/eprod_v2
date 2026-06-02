import { GlobalConfig } from 'payload'

export const EnquirySettings: GlobalConfig = {
  slug: 'enquiry-settings',
  admin: {
    description: 'Configure recipients and email template for enquiry form submissions.',
  },
  fields: [
    {
      name: 'to',
      type: 'text',
      required: true,
      admin: { description: 'Primary recipient address (e.g. info@eprod-solutions.com)' },
    },
    {
      name: 'cc',
      type: 'array',
      label: 'Additional Recipients (CC)',
      admin: { description: 'Extra addresses that receive every enquiry notification.' },
      fields: [
        {
          name: 'email',
          type: 'text',
          required: true,
          admin: { description: 'Email address' },
        },
      ],
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      defaultValue: 'New Enquiry from {{company}}',
      admin: {
        description: 'Email subject line. Supports placeholders: {{company}}, {{email}}, {{challenge}}, {{phone}}, {{message}}, {{sourceSection}}',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Email Body (intro)',
      admin: {
        description: 'Intro message shown above the enquiry data table. Supports the same placeholders as the subject. Leave blank to send only the data table.',
      },
    },
  ],
}
