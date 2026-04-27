import { getPayload } from 'payload'
import payloadConfig from '../payload.config.js'

function richText(...nodes: object[]) {
  return {
    root: {
      children: nodes,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

function heading(text: string, tag: 'h2' | 'h3' = 'h2') {
  return {
    children: [{ detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    type: 'heading',
    tag,
    version: 1,
  }
}

function paragraph(...parts: Array<string | { text: string; format?: number }>) {
  return {
    children: parts.map((p) =>
      typeof p === 'string'
        ? { detail: 0, format: 0, mode: 'normal', style: '', text: p, type: 'text', version: 1 }
        : { detail: 0, format: p.format ?? 0, mode: 'normal', style: '', text: p.text, type: 'text', version: 1 }
    ),
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    type: 'paragraph',
    version: 1,
  }
}

function bulletList(items: string[]) {
  return {
    children: items.map((item) => ({
      children: [
        {
          children: [{ detail: 0, format: 0, mode: 'normal', style: '', text: item, type: 'text', version: 1 }],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          type: 'listitem',
          version: 1,
          value: 1,
        },
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      type: 'listitem',
      version: 1,
      value: 1,
    })),
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    listType: 'bullet' as const,
    start: 1,
    tag: 'ul' as const,
    type: 'list',
    version: 1,
  }
}

const caseStudies = [
  {
    title: 'Digitising Loan Management for a Rural MFI Network',
    slug: 'digital-loan-management-rural-mfi',
    client: 'AgriCredit Kenya',
    industry: 'Microfinance',
    publishedAt: '2024-10-15',
    excerpt:
      'AgriCredit Kenya served 12,000 smallholder farmers across five counties but was drowning in paper-based loan files. eProd rebuilt their entire loan lifecycle digitally — cutting approval time from 14 days to 36 hours.',
    content: [
      {
        blockType: 'richText',
        content: richText(
          heading('The Challenge'),
          paragraph(
            'AgriCredit Kenya had grown to serve over 12,000 smallholder farmers across Nakuru, Meru, Kisii, Trans Nzoia, and Uasin Gishu counties. Their loan officers were travelling up to 80 km per day carrying physical loan files, and their head office team spent three weeks each month manually reconciling repayment data collected on paper forms.'
          ),
          paragraph(
            'Loan approval took an average of 14 days — not because of credit risk analysis, but because of the paper trail. Farmers were borrowing from moneylenders at 30% monthly rates while waiting for approvals that were simply held up in transit.'
          ),
          heading('What We Built', 'h2'),
          paragraph(
            'eProd designed and deployed a mobile-first Loan Management System (LMS) tailored to low-connectivity field environments. The system operates fully offline on Android tablets and syncs automatically when a data connection is available — even via 2G.'
          ),
          bulletList([
            'Digital loan application capture with biometric client verification',
            'Automated credit scoring using farm size, crop type, and repayment history',
            'Real-time dashboard for branch managers tracking portfolio at risk',
            'Bulk M-Pesa repayment reconciliation via Daraja API integration',
            'Automated SMS repayment reminders in Swahili and English',
          ]),
          heading('Implementation Timeline', 'h3'),
          paragraph(
            'Phase 1 (Months 1–2): Discovery, system design, and data migration from legacy spreadsheets. Phase 2 (Months 3–4): Pilot deployment across two branches with 15 loan officers. Phase 3 (Month 5): Full rollout to all 11 branches with 3-day field training programme.'
          )
        ),
      },
      {
        blockType: 'quote',
        text: "Before eProd, I carried a bag full of forms every day. Now I approve a loan on my tablet while I'm still sitting with the farmer. It changed everything.",
        author: 'Grace Wanjiku',
        role: 'Senior Loan Officer, AgriCredit Kenya',
      },
      {
        blockType: 'stats',
        items: [
          { value: '14 days → 36 hrs', label: 'Loan approval time' },
          { value: '94%', label: 'Repayment rate (up from 71%)' },
          { value: '12,000+', label: 'Active borrowers on platform' },
          { value: '68%', label: 'Reduction in operational cost' },
        ],
      },
      {
        blockType: 'richText',
        content: richText(
          heading('The Outcome'),
          paragraph(
            'Within six months of full deployment, AgriCredit Kenya\'s portfolio at risk (PAR30) dropped from 18% to 6.2%. The organisation was able to onboard 3,400 new borrowers without hiring additional staff, purely through the efficiency gains from digitalisation.'
          ),
          paragraph(
            'The success of this implementation led AgriCredit to expand their product offering — they launched a seasonal input finance product specifically for maize and potato farmers, fully managed within the eProd platform.'
          )
        ),
      },
    ],
  },

  {
    title: 'Building a Unified Digital Banking Platform for a SACCO Federation',
    slug: 'unified-digital-banking-sacco-federation',
    client: 'Jua Kali SACCO Federation',
    industry: 'Digital Banking',
    publishedAt: '2024-07-22',
    excerpt:
      'Twenty-three SACCOs were running on seven different core banking systems with no shared visibility. eProd built a federated digital banking layer that gave members instant access to savings, loans, and interoperability — without replacing what each SACCO already had.',
    content: [
      {
        blockType: 'richText',
        content: richText(
          heading('Background'),
          paragraph(
            'The Jua Kali SACCO Federation represents 23 member SACCOs across urban and peri-urban Kenya, collectively serving 87,000 members in the informal sector — artisans, market traders, and small manufacturers. Despite their collective scale, each SACCO operated in isolation on incompatible systems.'
          ),
          paragraph(
            'Members who belonged to multiple SACCOs — common among traders — had to visit physical branches for each society. There was no shared credit history, no cross-SACCO loan products, and no federation-level reporting for the national regulator (SASRA).'
          ),
          heading('Our Approach', 'h2'),
          paragraph(
            'Rather than forcing a rip-and-replace of existing core banking systems, eProd built an integration middleware layer — a federated API hub — that sits above each SACCO\'s existing system and creates a unified member experience and data model.'
          ),
          bulletList([
            'REST API adapters for 4 existing core banking systems (Bankers Realm, Mifos, Mambu, custom)',
            'Single sign-on mobile app giving members a unified view across all their SACCOs',
            'Federated KYC — verify once, recognised across all member SACCOs',
            'Cross-SACCO loan product with shared collateral pool (patent pending)',
            'SASRA-compliant regulatory reporting engine with one-click quarterly submissions',
          ])
        ),
      },
      {
        blockType: 'quote',
        text: 'Our members used to ask us why their SACCO couldn\'t work like a bank. Now we can honestly say: it does, and it does it in a way that keeps them at the centre.',
        author: 'Peter Otieno',
        role: 'Federation CEO, Jua Kali SACCO Federation',
      },
      {
        blockType: 'stats',
        items: [
          { value: '23', label: 'SACCOs integrated' },
          { value: '87,000', label: 'Members on unified platform' },
          { value: '4.1×', label: 'Increase in cross-SACCO loan uptake' },
          { value: '100%', label: 'SASRA reporting compliance' },
        ],
      },
      {
        blockType: 'richText',
        content: richText(
          heading('Technical Highlights', 'h2'),
          paragraph(
            'The platform processes an average of 14,000 transactions daily across the federation. The mobile app, built in React Native, supports USSD fallback for members on feature phones — critical in areas with limited smartphone penetration.'
          ),
          paragraph(
            'Security was paramount: the system implements end-to-end encryption for all inter-SACCO data transfers, role-based access control at the federation level, and a full audit trail for every regulatory submission.'
          ),
          heading('Next Phase', 'h3'),
          paragraph(
            'The federation is now piloting an embedded insurance product — micro crop insurance tied to loan disbursements — built directly within the eProd platform. Premiums are deducted automatically at the point of disbursement, with claims processed via satellite crop yield data.'
          )
        ),
      },
    ],
  },

  {
    title: 'Supply Chain Financing Platform for Crop Input Distributors',
    slug: 'supply-chain-financing-crop-inputs',
    client: 'FarmLink Distributors',
    industry: 'Agribusiness',
    publishedAt: '2025-01-08',
    excerpt:
      'FarmLink was sitting on KES 340M in receivables with no visibility into which retailers would pay and when. eProd built a supply chain finance platform that turned their receivables into a revolving credit facility — unlocking capital for the entire value chain.',
    content: [
      {
        blockType: 'richText',
        content: richText(
          heading('The Problem with Agri-Finance Receivables'),
          paragraph(
            'FarmLink Distributors supplies certified seeds, fertilisers, and agrochemicals to 1,800 agro-dealer retailers across the Rift Valley and Western Kenya. Like most agricultural distributors, they extended 45–90 day credit terms to retailers who in turn sold to farmers on credit.'
          ),
          paragraph(
            'The result: KES 340 million trapped in receivables, unpredictable cash flow, and an inability to grow their own inventory ahead of planting seasons. FarmLink\'s CFO described it plainly: "We knew we were profitable, but we couldn\'t pay our own suppliers on time."'
          ),
          heading('The eProd Solution', 'h2'),
          paragraph(
            'eProd designed a supply chain finance (SCF) platform that uses FarmLink\'s own transaction data — order history, delivery confirmations, payment behaviour — to create dynamic credit risk profiles for each agro-dealer in their network.'
          ),
          bulletList([
            'Real-time receivables dashboard with predictive payment forecasting',
            'Automated invoice discounting facility connected to a partner bank',
            'Digital purchase order management with e-signature for retailers',
            'Agro-dealer credit scoring engine using 18 months of transaction history',
            'Early payment incentive module (retailers pay early for a 1.5% discount)',
            'Integration with KRA eTIMS for VAT-compliant digital invoicing',
          ])
        ),
      },
      {
        blockType: 'quote',
        text: 'We always had the data. eProd showed us how to make it work for us financially. Our bank was suddenly very interested in our receivables book once it was structured and visible.',
        author: 'Samuel Kipkoech',
        role: 'CFO, FarmLink Distributors',
      },
      {
        blockType: 'stats',
        items: [
          { value: 'KES 340M', label: 'Receivables digitised' },
          { value: '31 days', label: 'Average collection period (down from 67)' },
          { value: '1,800+', label: 'Agro-dealers on platform' },
          { value: '22%', label: 'Revenue growth in year one' },
        ],
      },
      {
        blockType: 'richText',
        content: richText(
          heading('Financial Impact', 'h2'),
          paragraph(
            'Within 12 months, FarmLink reduced their average collection period from 67 days to 31 days. The partner bank approved a KES 80M invoice discounting facility based directly on the platform\'s receivables data — something they had been unable to secure previously without structured reporting.'
          ),
          paragraph(
            'The early payment incentive module saw 38% of retailers opt in within the first quarter, improving FarmLink\'s working capital position without increasing their debt load.'
          ),
          heading('Broader Impact on the Value Chain', 'h3'),
          paragraph(
            'The platform created a spillover effect: agro-dealers with strong credit scores on the FarmLink platform began presenting this data to local MFIs to access their own credit facilities. eProd is now working with two partner MFIs to recognise FarmLink platform scores as part of their underwriting criteria — effectively building credit infrastructure for the agricultural SME sector.'
          )
        ),
      },
    ],
  },
]

async function seed() {
  const payload = await getPayload({ config: payloadConfig })

  console.log('Seeding case studies...')

  for (const study of caseStudies) {
    const existing = await payload.find({
      collection: 'case-studies',
      where: { slug: { equals: study.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  ↳ Skipping "${study.title}" (already exists)`)
      continue
    }

    await payload.create({
      collection: 'case-studies',
      data: study as any,
    })

    console.log(`  ✓ Created "${study.title}"`)
  }

  console.log('\nDone.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
