import type { CollectionConfig } from 'payload'

export const Popups: CollectionConfig = {
  slug: 'popups',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'isActive', 'updatedAt'],
    description: 'Manage popup notifications for trainings, webinars, and announcements. No code required — create and configure popups entirely from this panel.',
  },
  fields: [
    // ─── Identity ─────────────────────────────────────────────────────
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal label to identify this popup (not visible to site visitors)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Enable or disable this popup. Only active popups are shown on the site.',
        position: 'sidebar',
      },
    },

    // ─── Scheduling ───────────────────────────────────────────────────
    {
      name: 'scheduling',
      type: 'group',
      label: 'Scheduling',
      admin: {
        description: 'Optionally limit when this popup is shown. Leave both dates empty to always show it (while active).',
      },
      fields: [
        {
          name: 'startDate',
          type: 'date',
          admin: {
            description: 'Start showing from this date/time. Leave empty to start immediately.',
            date: { pickerAppearance: 'dayAndTime' },
          },
        },
        {
          name: 'endDate',
          type: 'date',
          admin: {
            description: 'Stop showing after this date/time. Leave empty to show indefinitely.',
            date: { pickerAppearance: 'dayAndTime' },
          },
        },
      ],
    },

    // ─── Display Rules ────────────────────────────────────────────────
    {
      name: 'display',
      type: 'group',
      label: 'Display Rules',
      fields: [
        {
          name: 'pages',
          type: 'select',
          defaultValue: 'all',
          required: true,
          options: [
            { label: 'All Pages', value: 'all' },
            { label: 'Homepage Only', value: 'homepage' },
            { label: 'Specific Pages', value: 'specific' },
          ],
          admin: {
            description: 'Which pages should this popup appear on.',
          },
        },
        {
          name: 'specificPaths',
          type: 'array',
          label: 'Page Paths',
          admin: {
            description: 'Enter exact page paths where the popup should appear (e.g. /about, /case-studies).',
            condition: (_, siblingData) => siblingData?.pages === 'specific',
          },
          fields: [
            {
              name: 'path',
              type: 'text',
              required: true,
              admin: { placeholder: '/example-page' },
            },
          ],
        },
        {
          name: 'delay',
          type: 'number',
          defaultValue: 2,
          admin: {
            description: 'Seconds to wait after page load before showing the popup.',
          },
        },
        {
          name: 'frequency',
          type: 'select',
          defaultValue: 'once-per-session',
          required: true,
          options: [
            { label: 'Every Visit', value: 'every-visit' },
            { label: 'Once Per Session (tab)', value: 'once-per-session' },
            { label: 'Once Per Day', value: 'once-per-day' },
            { label: 'Once Per Week', value: 'once-per-week' },
            { label: 'Only Once Ever', value: 'once-ever' },
          ],
          admin: {
            description: 'How often this popup is shown to the same visitor.',
          },
        },
      ],
    },

    // ─── Content ──────────────────────────────────────────────────────
    {
      name: 'content',
      type: 'group',
      label: 'Content',
      fields: [
        {
          name: 'badge',
          type: 'text',
          admin: {
            description: 'Optional small label shown above the title (e.g. "Upcoming Webinar", "Free Training").',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Main heading of the popup.',
          },
        },
        {
          name: 'body',
          type: 'richText',
          admin: {
            description: 'Detailed popup content. Supports formatting, lists, and links.',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional banner image shown at the top of the popup.',
          },
        },
      ],
    },

    // ─── Buttons ──────────────────────────────────────────────────────
    {
      name: 'buttons',
      type: 'array',
      label: 'Buttons',
      admin: {
        description: 'Action buttons displayed at the bottom of the popup. You can add multiple buttons.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { placeholder: 'Register Now' },
        },
        {
          name: 'action',
          type: 'select',
          defaultValue: 'link',
          required: true,
          options: [
            { label: 'Open a Link', value: 'link' },
            { label: 'Register (collect visitor email)', value: 'register' },
            { label: 'Close Popup', value: 'close' },
          ],
          admin: {
            description: 'What happens when this button is clicked.',
          },
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'URL to open (required for "Open a Link" action).',
            condition: (_, siblingData) => siblingData?.action === 'link',
            placeholder: 'https://example.com or /internal-page',
          },
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
          label: 'Open in new tab',
          admin: {
            condition: (_, siblingData) => siblingData?.action === 'link',
          },
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary (filled)', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
            { label: 'Ghost / Text', value: 'ghost' },
          ],
          admin: {
            description: 'Visual style of this button.',
          },
        },
      ],
    },

    // ─── Registration ─────────────────────────────────────────────────
    {
      name: 'registration',
      type: 'group',
      label: 'Registration Settings',
      admin: {
        description: 'Configures the form shown when a visitor clicks a "Register" button. The marketing team will receive an email for each registration.',
      },
      fields: [
        {
          name: 'notifyEmail',
          type: 'text',
          admin: {
            description: 'Email address that receives registration notifications (e.g. marketing@eprod.com).',
            placeholder: 'marketing@eprod.com',
          },
        },
        {
          name: 'emailSubject',
          type: 'text',
          defaultValue: 'New Registration',
          admin: {
            description: 'Subject line for the notification email sent to your team.',
          },
        },
        {
          name: 'collectName',
          type: 'checkbox',
          defaultValue: true,
          label: 'Ask for name',
        },
        {
          name: 'collectPhone',
          type: 'checkbox',
          defaultValue: false,
          label: 'Ask for phone number',
        },
        {
          name: 'collectOrganization',
          type: 'checkbox',
          defaultValue: false,
          label: 'Ask for organization / company',
        },
        {
          name: 'successMessage',
          type: 'text',
          defaultValue: "You're registered! We'll be in touch soon.",
          admin: {
            description: 'Message shown to the visitor after they successfully register.',
          },
        },
      ],
    },

    // ─── Appearance ───────────────────────────────────────────────────
    {
      name: 'appearance',
      type: 'group',
      label: 'Appearance',
      fields: [
        {
          name: 'size',
          type: 'select',
          defaultValue: 'md',
          options: [
            { label: 'Small (400px)', value: 'sm' },
            { label: 'Medium (560px)', value: 'md' },
            { label: 'Large (720px)', value: 'lg' },
          ],
          admin: {
            description: 'Maximum width of the popup.',
          },
        },
        {
          name: 'showCloseButton',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show close (×) button',
          admin: {
            description: 'Allows visitors to dismiss the popup.',
          },
        },
        {
          name: 'closeOnOverlayClick',
          type: 'checkbox',
          defaultValue: true,
          label: 'Close when clicking outside the popup',
        },
        {
          name: 'badgeColor',
          type: 'select',
          defaultValue: 'brand',
          label: 'Badge color',
          options: [
            { label: 'Brand (teal)', value: 'brand' },
            { label: 'Green', value: 'green' },
            { label: 'Blue', value: 'blue' },
            { label: 'Orange', value: 'orange' },
            { label: 'Purple', value: 'purple' },
            { label: 'Red', value: 'red' },
          ],
          admin: {
            description: 'Color of the badge label (if set).',
            condition: (data) => !!data?.content?.badge,
          },
        },
      ],
    },
  ],
}
