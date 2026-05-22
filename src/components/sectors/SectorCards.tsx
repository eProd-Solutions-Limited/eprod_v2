import Image, { type StaticImageData } from 'next/image'
import coffeeImg from '@/assets/eprod-coffee-clients.jpg'
import farmerImg from '@/assets/hero-farmer.jpg'
import heroImg from '@/assets/hero_image.png'
import horticultureImg from '@/assets/Horticulture-eprod.jpg'
import dairyImg from '@/assets/Value-chains-eProd-Solutions-Dairy.webp'
import seedsImg from '@/assets/Seed-producers-eprod.jpg'
import spicesImg from '@/assets/Value-chain-eProd-Solutions-spices.jpg'
import grainsImg from '@/assets/grains.jpg'
import nutsImg from '@/assets/Value-chain-eProd-Solutions-nuts.jpg'
import apicultureImg from '@/assets/Value-chain-eProd-Solutions-apiculture.jpg'
import piscicultureImg from '@/assets/Value-chains-eProd-Solutions-Fish.webp'
import poultryImg from '@/assets/Value-chain-eProd-Solutions-Ltd-poultry.jpg'
import palmoilImg from '@/assets/Palm-oil-eProd-Products.jpg'

type Sector = {
  name: string
  color: string
  description: string
  features: string[]
  image: StaticImageData
}

const sectors: Sector[] = [
  {
    name: 'Coffee, Cocoa & Tea',
    color: '#7C5030',
    description:
      'High-value crops grown with large farmer numbers in cooperative setups. Full chain traceability links produce to individual farms for EUDR compliance. Supports volatile-market price management and broker oversight.',
    features: ['EUDR Compliance', 'Input Tracking', 'Certification Mgmt', 'Price Management', 'Broker Oversight'],
    image: coffeeImg,
  },
  {
    name: 'Horticulture',
    color: '#1E6A2E',
    description:
      'Markets demand full seed-to-product traceability. Chemical input use is monitored closely for food safety. Yield forecasting drives cashflow planning and peak season readiness.',
    features: ['Seed-to-Product Traceability', 'Food Safety Monitoring', 'Yield Forecasting', 'Input Repayment', 'Quality Payments'],
    image: horticultureImg,
  },
  {
    name: 'Dairy',
    color: '#1A5FA0',
    description:
      'End-to-end milk chain management for processors and cooperatives. Milk testing integration enables adulteration detection. Farmers are linked to financial institutions for direct loan access.',
    features: ['Herd Management', 'Milk Collection Routes', 'Adulteration Detection', 'Automated Payments', 'Financial Linkage'],
    image: dairyImg,
  },
  {
    name: 'Seeds',
    color: '#9B6A12',
    description:
      'QR codes on seed packages allow farmers to opt in and share traceability data directly with the producer, bypassing stockist intermediary gaps and enabling weather and production advice.',
    features: ['QR Code Traceability', 'Stockist Network Mgmt', 'Production Advice', 'Impact Measurement', 'Batch Codes'],
    image: seedsImg,
  },
  {
    name: 'Grains & Pulses',
    color: '#B04215',
    description:
      'Grain traders and aggregators provide inputs recovered from future deliveries, working through cooperatives and brokers. Pulses clients track input issuance to improve productivity. Integrates with RiceAdvice.',
    features: ['Input Recovery', 'Mobile Money Payments', 'Quality Control', 'RiceAdvice Integration', 'Climate-Smart Ag'],
    image: grainsImg,
  },
  {
    name: 'Spices',
    color: '#8B1A1A',
    description:
      'Clients work with saffron and Zanzibar spices — pepper, cloves, chilies, cardamom. Full cycle from farmer onboarding and crop registration to certification, purchase, and payment.',
    features: ['Crop Registration', 'Certification Mgmt', 'Training Uploads', 'Purchase Tracking', 'Payment Processing'],
    image: spicesImg,
  },
  {
    name: 'Nuts',
    color: '#5C4A28',
    description:
      'Cashew, macadamia, coconut, and almond exporters use eProd from seedling provision through GlobalGAP certification, field inspections, and traceable buying with SMS farmer support.',
    features: ['GlobalGAP Certification', 'Seedling Provision', 'Field Inspections', 'Traceability', 'SMS Notifications'],
    image: nutsImg,
  },
  {
    name: 'Apiculture',
    color: '#C8880A',
    description:
      'Thousands of beehives mapped under farmer groups with traceability codes. Barcoded food-safe buckets are issued to farmers. IQBP rewards quality and deducts unreturned equipment automatically.',
    features: ['Beehive GPS Mapping', 'Barcode Traceability', 'Quality-Based Payment', 'Adulteration Prevention', 'Mobile Money'],
    image: apicultureImg,
  },
  {
    name: 'Oil & Tree Crops',
    color: '#2D6B4A',
    description:
      'Clients provide tree seedlings and regular agricultural advice. Field and crop mapping drives follow-up and projection management with nutrient advisory integration and quality-based payments.',
    features: ['Tree & Field Mapping', 'Projection Management', 'Traceable Purchasing', 'Quality Assessment', 'Nutrient Advisory'],
    image: palmoilImg,
  },
  {
    name: 'Pisciculture',
    color: '#1A6B7A',
    description:
      'Clients produce feed and purchase fish for onward production. eProd maps fishponds, tracks feed and fingerling distribution, rates pond performance, and manages weight-based purchasing with SMS alerts.',
    features: ['Fishpond Mapping', 'Feed Distribution', 'Pond Performance', 'Weight-Based Buying', 'Input Deductions'],
    image: piscicultureImg,
  },
  {
    name: 'Poultry',
    color: '#8B6A14',
    description:
      "Hatchlings are fully traceable and distributed to farmers on loan with feed. Covers vaccination scheduling, survival tracking, and egg/broiler purchasing through to complete feed production management.",
    features: ['Hatchery Management', 'Vaccination Scheduling', 'Survival Rate Tracking', 'Broiler Purchasing', 'Feed Production'],
    image: poultryImg,
  },
]

const SectorCards = () => (
  <section id="sectors" className="bg-background py-20" aria-labelledby="sectors-heading">
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">Platform Coverage</p>
        <h2 id="sectors-heading" className="text-3xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
          Every Sector.{' '}
          <span className="gradient-primary-text">One Platform.</span>
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Each sector has distinct workflows, compliance requirements, and data needs.
          eProd is purpose-built to handle all of them.
        </p>
      </div>

      <ul
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto"
        role="list"
        aria-label="Agricultural sectors supported by eProd"
      >
        {sectors.map((sector) => (
          <li key={sector.name} className="flex">
            <article
              className="relative rounded-2xl overflow-hidden w-full h-80 group hover:shadow-2xl transition-all duration-500 cursor-default focus-within:ring-2 focus-within:ring-ring"
              aria-label={sector.name}
            >
              {/* Full-bleed image */}
              <Image
                src={sector.image}
                alt=""
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                aria-hidden="true"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-black/5" />

              {/* Content anchored to bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white font-bold text-lg leading-snug mb-1.5">{sector.name}</h3>
                <p className="text-white/75 text-xs leading-relaxed">{sector.description}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  </section>
)

export default SectorCards
