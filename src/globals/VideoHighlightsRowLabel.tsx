'use client'

import { useRowLabel } from '@payloadcms/ui'

type VideoRow = {
  title?: string | null
  url?: string | null
  active?: boolean | null
}

/**
 * Row label for the Video Highlights array so the drag handles read as real
 * videos ("1. eProd Platform Overview") instead of "Video 01".
 */
export const VideoHighlightsRowLabel = () => {
  const { data, rowNumber } = useRowLabel<VideoRow>()
  const position = (rowNumber ?? 0) + 1
  const label = data?.title || data?.url || 'New video'
  const hidden = data?.active === false

  return (
    <span style={hidden ? { opacity: 0.5 } : undefined}>
      {position}. {label}
      {hidden ? ' — hidden' : ''}
    </span>
  )
}
