import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

const replacePlaceholders = (template: string, data: Record<string, string>) =>
  template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? '')

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const payload = await getPayload({ config: payloadConfig })

    const config = await payload.findGlobal({ slug: 'enquiry-settings' })

    if (!config?.to) {
      return NextResponse.json({ error: 'Enquiry settings not configured' }, { status: 500 })
    }

    const { to, cc, subject: subjectTemplate, body: bodyTemplate } = config
    const { company, email, challenge, phone, message, sourceSection } = body

    const placeholders: Record<string, string> = {
      company: company ?? '',
      email: email ?? '',
      challenge: challenge ?? '',
      phone: phone ?? '',
      message: message ?? '',
      sourceSection: sourceSection ?? 'unknown',
    }

    const subject = replacePlaceholders(subjectTemplate ?? 'New Enquiry from {{company}}', placeholders)
    const introHtml = bodyTemplate ? `<p>${replacePlaceholders(bodyTemplate, placeholders).replace(/\n/g, '<br />')}</p>` : ''

    const rows = [
      introHtml,
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

    const ccAddresses = (cc ?? []).map((entry: { email: string }) => entry.email).filter(Boolean)

    await payload.sendEmail({
      to,
      ...(ccAddresses.length > 0 && { cc: ccAddresses }),
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
