import { GlobalConfig } from 'payload'
import { extractYouTubeId, fetchYouTubeTitle } from '../lib/youtube'

export const VideoHighlights: GlobalConfig = {
  slug: 'video-highlights',
  label: 'Video Highlights',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Home Page',
    description:
      'Videos shown in the "Video Highlights" section on the homepage. Drag the rows to reorder — the first video plays in the big player, the rest appear under "Watch next".',
  },
  fields: [
    {
      name: 'videos',
      type: 'array',
      label: 'Videos',
      labels: { singular: 'Video', plural: 'Videos' },
      admin: {
        initCollapsed: false,
        description: 'Drag to reorder. The top video is the one that shows first on the homepage.',
        components: {
          RowLabel: '@/globals/VideoHighlightsRowLabel#VideoHighlightsRowLabel',
        },
      },
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'YouTube Link',
          admin: {
            description:
              'Paste the YouTube link, e.g. https://www.youtube.com/watch?v=K60ZdON-xO0 or https://youtu.be/K60ZdON-xO0',
          },
          validate: (value: string | null | undefined) => {
            if (!value) return 'Please paste a YouTube link.'
            return extractYouTubeId(value)
              ? true
              : 'That does not look like a YouTube link. Copy the link straight from the video page or the Share button.'
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title (English)',
          admin: {
            description:
              'Leave blank and the title will be pulled from YouTube automatically when you save.',
          },
          hooks: {
            beforeChange: [
              async ({ value, siblingData }) => {
                if (value) return value
                const id = extractYouTubeId((siblingData as { url?: string })?.url)
                if (!id) return value
                return (await fetchYouTubeTitle(id)) ?? value
              },
            ],
          },
        },
        {
          name: 'titleFr',
          type: 'text',
          label: 'Title (French)',
          admin: {
            description: 'Optional. Falls back to the English title when left blank.',
          },
        },
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show on site',
          admin: { description: 'Uncheck to hide this video without deleting it.' },
        },
      ],
    },
  ],
}
