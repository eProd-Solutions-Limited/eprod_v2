import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const payload = await getPayload({ config: payloadConfig })
    const updated = await payload.update({
      collection: 'enquiries',
      id,
      data: body,
      overrideAccess: true,
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Failed to update enquiry:', error)
    return NextResponse.json({ error: 'Failed to update enquiry' }, { status: 500 })
  }
}
