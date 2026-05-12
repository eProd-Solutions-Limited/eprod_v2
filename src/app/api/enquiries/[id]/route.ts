import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { headers as nextHeaders } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await getPayload({ config: payloadConfig })

    const headersList = await nextHeaders()
    const { user } = await payload.auth({ headers: headersList })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const updated = await payload.update({
      collection: 'enquiries',
      id,
      data: {
        ...(body.status !== undefined && { status: body.status }),
        ...(body.notes !== undefined && { notes: body.notes }),
      },
      overrideAccess: true,
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Failed to update enquiry:', error)
    return NextResponse.json({ error: 'Failed to update enquiry' }, { status: 500 })
  }
}
