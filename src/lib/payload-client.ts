import { cache } from 'react'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'

// Cached per request — prevents initializing Payload multiple times
// across server components rendered in the same request tree.
export const getPayloadClient = cache(async () => {
  return getPayload({ config: payloadConfig })
})
