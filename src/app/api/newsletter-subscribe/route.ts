import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const source = typeof body.source === 'string' ? body.source.slice(0, 100) : 'footer'

    if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const payload = await getPayload({ config: payloadConfig })

    // Avoid duplicates — the email field is unique.
    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'subscribers',
        data: { email, source },
      })
    }

    // Always return success so the form doesn't reveal whether an email is already subscribed.
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
