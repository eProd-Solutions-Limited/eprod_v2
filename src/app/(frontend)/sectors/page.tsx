import type { Metadata } from 'next'
import SectorsHero from '@/components/sectors/SectorsHero'
import SectorCards from '@/components/sectors/SectorCards'
import ValueChainBlock from '@/components/sectors/ValueChainBlock'
import SectorsFAQ from '@/components/sectors/SectorsFAQ'

export const metadata: Metadata = {
  title: 'Sectors We Serve | eProd — Agricultural Cooperative Management',
  description:
    'Tailored solutions for coffee, cocoa, horticulture, dairy, seeds, grains, spices, nuts, apiculture, pisciculture, and poultry agribusinesses. Traceability, EUDR compliance, and automated payments.',
  openGraph: {
    title: 'Sectors We Serve — Tailored Solutions for Every Value Chain | eProd',
    description:
      'Tailored solutions for coffee, cocoa, horticulture, dairy, seeds, grains, spices, nuts, apiculture, pisciculture, and poultry agribusinesses. Traceability, EUDR compliance, and automated payments.',
    type: 'website',
    siteName: 'eProd',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does eProd support multi-value chain operations?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Manage multiple commodities within one unified system.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can eProd handle certification audits?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The platform stores all required data for Organic, Fairtrade and EUDR audits.',
      },
    },
  ],
}

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Agricultural Sectors Supported by eProd',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Coffee, Cocoa & Tea' },
    { '@type': 'ListItem', position: 2, name: 'Horticulture' },
    { '@type': 'ListItem', position: 3, name: 'Dairy' },
    { '@type': 'ListItem', position: 4, name: 'Seeds' },
    { '@type': 'ListItem', position: 5, name: 'Grains & Pulses' },
    { '@type': 'ListItem', position: 6, name: 'Spices' },
    { '@type': 'ListItem', position: 7, name: 'Nuts' },
    { '@type': 'ListItem', position: 8, name: 'Apiculture' },
    { '@type': 'ListItem', position: 9, name: 'Oil & Tree Crops' },
    { '@type': 'ListItem', position: 10, name: 'Pisciculture' },
    { '@type': 'ListItem', position: 11, name: 'Poultry' },
  ],
}

export default function SectorsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <main className="min-h-screen">
        <SectorsHero />
        <SectorCards />
        <ValueChainBlock />
        <SectorsFAQ />
      </main>
    </>
  )
}
