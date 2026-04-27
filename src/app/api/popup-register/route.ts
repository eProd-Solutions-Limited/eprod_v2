import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { popupId, name, email, phone, organization } = body

    if (!email || !popupId) {
      return NextResponse.json({ error: 'email and popupId are required' }, { status: 400 })
    }

    const payload = await getPayload({ config: payloadConfig })

    const popup = await payload.findByID({
      collection: 'popups',
      id: popupId,
    })

    if (!popup) {
      return NextResponse.json({ error: 'Popup not found' }, { status: 404 })
    }

    const notifyEmail = popup.registration?.notifyEmail
    if (!notifyEmail) {
      return NextResponse.json({ error: 'No notification email configured for this popup' }, { status: 500 })
    }

    const subject = popup.registration?.emailSubject || `New Registration: ${popup.content?.title || popup.name}`

    const rows = [
      `<p>A new registration was submitted via the <strong>${popup.content?.title || popup.name}</strong> popup.</p>`,
      `<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:500px;font-family:sans-serif;font-size:14px;">`,
      `<tr><td style="border:1px solid #e0e0e0;background:#f5f5f5;font-weight:600;width:140px;">Email</td><td style="border:1px solid #e0e0e0;">${email}</td></tr>`,
      name ? `<tr><td style="border:1px solid #e0e0e0;background:#f5f5f5;font-weight:600;">Name</td><td style="border:1px solid #e0e0e0;">${name}</td></tr>` : '',
      phone ? `<tr><td style="border:1px solid #e0e0e0;background:#f5f5f5;font-weight:600;">Phone</td><td style="border:1px solid #e0e0e0;">${phone}</td></tr>` : '',
      organization ? `<tr><td style="border:1px solid #e0e0e0;background:#f5f5f5;font-weight:600;">Organization</td><td style="border:1px solid #e0e0e0;">${organization}</td></tr>` : '',
      `</table>`,
      `<p style="color:#888;font-size:12px;margin-top:16px;">Sent by the eProd website popup system.</p>`,
    ].filter(Boolean).join('')

    await payload.sendEmail({
      to: notifyEmail,
      subject,
      html: `<div style="font-family:sans-serif;max-width:600px;padding:24px;">${rows}</div>`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Popup registration error:', error)
    return NextResponse.json({ error: 'Failed to process registration' }, { status: 500 })
  }
}
