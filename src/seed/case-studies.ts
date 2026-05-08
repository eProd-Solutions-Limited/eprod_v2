import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import payloadConfig from '../payload.config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IMAGES_DIR = path.resolve(__dirname, '../../public/seed-images')

async function uploadImage(payload: Awaited<ReturnType<typeof getPayload>>, filename: string, alt: string) {
  const filePath = path.join(IMAGES_DIR, filename)
  const data = fs.readFileSync(filePath)
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype: 'image/jpeg', name: filename, size: data.length },
  })
  console.log(`  ✓ Uploaded ${filename} → id ${doc.id}`)
  return doc.id
}

async function seed() {
  const payload = await getPayload({ config: payloadConfig })

  console.log('\n── Uploading images ──')
  const heroId = await uploadImage(payload, 'case-hero.jpg', 'African agricultural landscape showing thriving farms')
  const poultryId = await uploadImage(payload, 'case-poultry.jpg', 'Poultry farm managed via eProd')
  const coffeeId = await uploadImage(payload, 'case-coffee.jpg', 'Coffee cooperative using eProd for EUDR compliance')
  const dairyId = await uploadImage(payload, 'case-dairy.jpg', 'Dairy operation scaled with eProd platform')

  console.log('\n── Seeding case studies ──')
  const studies = [
    {
      title: 'Unlocking $2M in Input Financing for 5,000 Poultry Farmers',
      coverImage: poultryId,
      client: 'Novos Horizontes — Poultry Sector',
      tag: 'Financial Inclusion',
      headline: 'Unlocking $2M in Input Financing for 5,000 Poultry Farmers',
      situation:
        'A major poultry aggregator struggled with high feed costs and poor feed conversion ratios (FCR) among its outgrower network, limiting their ability to secure bank financing.',
      action:
        "Implementing eProd's mobile ERP provided real-time tracking of FCR and mortality rates, creating a verifiable data trail.",
      result:
        'The transparent data de-risked the portfolio, allowing a partner bank to extend $2M in low-interest input financing, boosting overall production by 35%.',
      ctaLabel: 'Read Full Case Study',
      hasVideo: false,
    },
    {
      title: 'Achieving 100% EUDR Compliance Ahead of the 2026 Deadline',
      coverImage: coffeeId,
      client: 'Nyamirima — Coffee Sector',
      tag: 'EUDR Traceability',
      headline: 'Achieving 100% EUDR Compliance Ahead of the 2026 Deadline',
      situation:
        'A coffee exporting cooperative faced the threat of losing access to European markets due to an inability to prove zero-deforestation across its complex, multi-tiered supply chain.',
      action:
        "eProd's offline-first mobile app was deployed to map 1,000+ individual farm plots via GPS polygons, seamlessly integrating with the core ERP.",
      result:
        'The exporter achieved full, automated EUDR reporting compliance 18 months ahead of the deadline, securing long-term European contracts and a premium price point.',
      ctaLabel: 'Watch Video Interview',
      hasVideo: true,
    },
    {
      title: 'Scaling from 2,000 to 15,000 Farmers with Zero Added Overhead',
      coverImage: dairyId,
      client: 'Billys — Dairy Sector',
      tag: 'Operational Efficiency',
      headline: 'Scaling from 2,000 to 15,000 Farmers with Zero Added Overhead',
      situation:
        'A rapidly growing dairy company was drowning in spreadsheet management, leading to delayed farmer payments, high error rates, and an inability to scale operations efficiently.',
      action:
        "Transitioning to eProd's centralized platform automated milk collection data, quality testing, and mobile money payment integrations.",
      result:
        'The company scaled its farmer network by 750% without hiring additional administrative staff, while reducing payment processing time from 14 days to 24 hours.',
      ctaLabel: 'Download PDF Report',
      hasVideo: false,
    },
  ]

  for (const study of studies) {
    const existing = await payload.find({
      collection: 'case-studies',
      where: { title: { equals: study.title } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.log(`  ↳ Skipping "${study.title}" (already exists)`)
      continue
    }
    await payload.create({ collection: 'case-studies', data: study as any })
    console.log(`  ✓ Created "${study.title}"`)
  }

  console.log('\n── Seeding LogoWall global ──')
  await payload.updateGlobal({
    slug: 'logo-wall',
    data: {
      agribusinessLogos: [
        { name: 'Miyonga Fresh Greens' },
        { name: 'Swahili Honey' },
        { name: 'Novos Horizontes' },
        { name: 'Billys Dairy' },
        { name: 'Nyamirima Coffee' },
        { name: 'Soy Bean Co-op' },
      ],
      bankLogos: [
        { name: 'I&M Bank' },
        { name: 'NCBA' },
        { name: 'Equity Bank' },
        { name: 'Rabobank' },
        { name: 'Mastercard' },
      ],
    },
  })
  console.log('  ✓ LogoWall global updated')

  console.log('\n── Seeding VoiceOfCustomer global ──')
  await payload.updateGlobal({
    slug: 'voice-of-customer',
    data: {
      quotes: [
        {
          quote:
            'eProd provides the data integrity and transparency we need to confidently deploy capital into agricultural value chains that were previously considered too risky.',
          name: 'Head of Agribusiness',
          role: 'Partner Bank',
          tag: 'Bank Partner',
        },
        {
          quote:
            "The platform didn't just digitize our operations; it completely changed our relationship with our buyers in Europe. We now sell traceability as a premium feature.",
          name: 'CEO',
          role: 'Nut Exporter',
          tag: 'Agribusiness CEO',
        },
        {
          quote:
            'Our farmers are paid faster and more accurately than ever before. eProd has built immense trust within our network.',
          name: 'Chairman',
          role: 'Dairy Cooperative',
          tag: 'Cooperative Leader',
        },
      ],
    },
  })
  console.log('  ✓ VoiceOfCustomer global updated')

  console.log('\nDone.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
