import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { headers as nextHeaders } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest) {
  try {
    const payload = await getPayload({ config: payloadConfig })

    const headersList = await nextHeaders()
    const { user } = await payload.auth({ headers: headersList })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const enquiries = await payload.find({
      collection: 'enquiries',
      sort: '-createdAt',
      limit: 1000,
      overrideAccess: true,
    })
    return NextResponse.json(enquiries)
  } catch (error) {
    console.error('Failed to fetch enquiries:', error)
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 })
  }
}
