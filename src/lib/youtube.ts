/**
 * Pulls the 11-character video id out of any YouTube link an editor is likely to
 * paste — watch URLs, share links, embeds, Shorts, live links — or accepts a bare
 * id. Returns null when nothing usable is found.
 */
export function extractYouTubeId(input?: string | null): string | null {
  if (!input) return null
  const value = input.trim()
  if (!value) return null

  // Already just an id
  if (/^[\w-]{11}$/.test(value)) return value

  const patterns = [
    /[?&]v=([\w-]{11})/, // youtube.com/watch?v=ID
    /youtu\.be\/([\w-]{11})/, // youtu.be/ID
    /\/embed\/([\w-]{11})/, // youtube.com/embed/ID
    /\/shorts\/([\w-]{11})/, // youtube.com/shorts/ID
    /\/live\/([\w-]{11})/, // youtube.com/live/ID
    /\/v\/([\w-]{11})/, // youtube.com/v/ID
  ]

  for (const pattern of patterns) {
    const match = value.match(pattern)
    if (match) return match[1]
  }

  return null
}

/** Asks YouTube for a video's public title. Returns null if the lookup fails. */
export async function fetchYouTubeTitle(videoId: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
    )
    if (!res.ok) return null
    const data = (await res.json()) as { title?: string }
    return data.title?.trim() || null
  } catch {
    return null
  }
}
