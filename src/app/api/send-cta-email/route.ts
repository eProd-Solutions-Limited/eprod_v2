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

    const { to } = docs[0]
    const { company, email, challenge, phone, message, sourceSection } = body

    const subject = `New Enquiry from ${company}`

    const rows = [
      `<p>A new enquiry was submitted via the website.</p>`,
      `<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:500px;font-family:sans-serif;font-size:14px;">`,
      `<tr><td style="border:1px solid #e0e0e0;background:#f5f5f5;font-weight:600;width:140px;">Company</td><td style="border:1px solid #e0e0e0;">${company}</td></tr>`,
      `<tr><td style="border:1px solid #e0e0e0;background:#f5f5f5;font-weight:600;">Email</td><td style="border:1px solid #e0e0e0;">${email}</td></tr>`,
      `<tr><td style="border:1px solid #e0e0e0;background:#f5f5f5;font-weight:600;">Challenge</td><td style="border:1px solid #e0e0e0;">${challenge}</td></tr>`,
      phone ? `<tr><td style="border:1px solid #e0e0e0;background:#f5f5f5;font-weight:600;">Phone</td><td style="border:1px solid #e0e0e0;">${phone}</td></tr>` : '',
      message ? `<tr><td style="border:1px solid #e0e0e0;background:#f5f5f5;font-weight:600;">Message</td><td style="border:1px solid #e0e0e0;">${message}</td></tr>` : '',
      `<tr><td style="border:1px solid #e0e0e0;background:#f5f5f5;font-weight:600;">Source</td><td style="border:1px solid #e0e0e0;">${sourceSection ?? 'unknown'}</td></tr>`,
      `</table>`,
      `<p style="color:#888;font-size:12px;margin-top:16px;">Sent by the eProd website enquiry form.</p>`,
    ].filter(Boolean).join('')

    await payload.sendEmail({
      to,
      subject,
      html: `<div style="font-family:sans-serif;max-width:600px;padding:24px;">${rows}</div>`,
    })

    try {
      const notes = [
        phone && `Phone: ${phone}`,
        message && `Message: ${message}`,
      ].filter(Boolean).join('\n\n')

      await payload.create({
        collection: 'enquiries',
        data: {
          company,
          email,
          challenge,
          sourceSection: sourceSection ?? 'unknown',
          status: 'new',
          ...(notes && { notes }),
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
