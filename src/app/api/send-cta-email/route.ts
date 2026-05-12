import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const payload = await getPayload({ config: payloadConfig })

    const { docs } = await payload.find({
      collection: 'cta-config',
      limit: 1,
    })

    if (!docs?.length) {
      return NextResponse.json({ error: 'CTA config not found' }, { status: 500 })
    }

    const config = docs[0]
    const { to, subject, body: emailBody } = config.email

    let content = JSON.stringify(emailBody)
    content = content.replace(/{company}/g, body.company)
    content = content.replace(/{email}/g, body.email)
    content = content.replace(/{challenge}/g, body.challenge)

    await payload.sendEmail({ to, subject, html: content })

    try {
      await payload.create({
        collection: 'enquiries',
        data: {
          company: body.company,
          email: body.email,
          challenge: body.challenge,
          sourceSection: body.sourceSection ?? 'unknown',
          status: 'new',
        },
      })
    } catch (saveError) {
      console.error('Failed to save enquiry to Payload:', saveError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
