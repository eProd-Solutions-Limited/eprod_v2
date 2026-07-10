import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

const replacePlaceholders = (template: string, data: Record<string, string>) =>
  template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? '')

const VALUE_CHAIN_LABELS: Record<string, string> = {
  coffee_cocoa_tea: 'Coffee, Cocoa & Tea',
  horticulture: 'Horticulture',
  dairy: 'Dairy',
  seeds: 'Seeds',
  grains_pulses: 'Grains & Pulses',
  spices: 'Spices',
  nuts: 'Nuts',
  oil_tree_crops: 'Oil & Tree Crops',
  apiculture: 'Apiculture',
  pisciculture: 'Pisciculture',
  poultry: 'Poultry',
  rubber_gum: 'Rubber & Gum',
  other: 'Other',
}

const FARMERS_LABELS: Record<string, string> = {
  lt_100: 'Fewer than 100',
  '100_500': '100 – 500',
  '500_1000': '500 – 1,000',
  '1000_5000': '1,000 – 5,000',
  '5000_10000': '5,000 – 10,000',
  gt_10000: 'More than 10,000',
}

const REQUEST_FOR_LABELS: Record<string, string> = {
  newsletter: 'Newsletter Signup',
  demo: 'Demo',
  other: 'Other',
}

const VALUE_CHAIN_VALUES = Object.keys(VALUE_CHAIN_LABELS)
const FARMERS_VALUES = Object.keys(FARMERS_LABELS)
const REQUEST_FOR_VALUES = Object.keys(REQUEST_FOR_LABELS)

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

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

    // New optional fields
    const contactName: string =
      typeof body.contactName === 'string' ? body.contactName.trim().slice(0, 100) : ''
    const position: string = typeof body.position === 'string' ? body.position.trim() : ''
    const numberOfFarmers: string =
      typeof body.numberOfFarmers === 'string' && FARMERS_VALUES.includes(body.numberOfFarmers)
        ? body.numberOfFarmers
        : ''
    const valueChain: string =
      typeof body.valueChain === 'string' && VALUE_CHAIN_VALUES.includes(body.valueChain)
        ? body.valueChain
        : ''
    const requestForValue: string =
      typeof body.requestFor === 'string' && REQUEST_FOR_VALUES.includes(body.requestFor)
        ? body.requestFor
        : ''
    const requestForOther: string =
      typeof body.requestForOther === 'string' ? body.requestForOther.trim().slice(0, 200) : ''
    const valueChainLabel = valueChain ? VALUE_CHAIN_LABELS[valueChain] : ''
    const farmersLabel = numberOfFarmers ? FARMERS_LABELS[numberOfFarmers] : ''
    const requestForLabel = requestForValue
      ? requestForValue === 'other' && requestForOther
        ? `Other: ${requestForOther}`
        : REQUEST_FOR_LABELS[requestForValue]
      : ''

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
      contactName ? `<tr><td style="border:1px solid #e0e0e0;background:#f5f5f5;font-weight:600;">Name</td><td style="border:1px solid #e0e0e0;">${escapeHtml(contactName)}</td></tr>` : '',
      position ? `<tr><td style="border:1px solid #e0e0e0;background:#f5f5f5;font-weight:600;">Position</td><td style="border:1px solid #e0e0e0;">${escapeHtml(position)}</td></tr>` : '',
      farmersLabel ? `<tr><td style="border:1px solid #e0e0e0;background:#f5f5f5;font-weight:600;">Number of Farmers</td><td style="border:1px solid #e0e0e0;">${farmersLabel}</td></tr>` : '',
      valueChainLabel ? `<tr><td style="border:1px solid #e0e0e0;background:#f5f5f5;font-weight:600;">Value Chain</td><td style="border:1px solid #e0e0e0;">${valueChainLabel}</td></tr>` : '',
      requestForLabel ? `<tr><td style="border:1px solid #e0e0e0;background:#f5f5f5;font-weight:600;">Request For</td><td style="border:1px solid #e0e0e0;">${escapeHtml(requestForLabel)}</td></tr>` : '',
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
          ...(contactName && { contactName }),
          ...(position && { position }),
          ...(farmersLabel && { numberOfFarmers: farmersLabel }),
          ...(valueChain && { valueChain: valueChain as any }),
          ...(requestForLabel && { requestFor: requestForLabel }),
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
