export const dynamic = 'force-dynamic'

import { cache } from 'react'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { CaseStudiesHero } from '@/components/case-studies/CaseStudiesHero'
import { LogoWall } from '@/components/case-studies/LogoWall'
import { ImpactGrid } from '@/components/case-studies/ImpactGrid'
import { DifferentiatorBanner } from '@/components/case-studies/DifferentiatorBanner'
import { VoiceOfCustomer } from '@/components/case-studies/VoiceOfCustomer'
import { CaseStudiesCTA } from '@/components/case-studies/CaseStudiesCTA'
import type { CaseStudyCard } from '@/components/case-studies/ImpactGrid'

const getData = cache(async () => {
  const payload = await getPayload({ config: payloadConfig })

  const [storiesResult, logoWall, voiceOfCustomer, caseStudiesCta] = await Promise.all([
    payload.find({ collection: 'case-studies', limit: 50, depth: 1 }),
    payload.findGlobal({ slug: 'logo-wall', depth: 1 }),
    payload.findGlobal({ slug: 'voice-of-customer' }),
    payload.findGlobal({ slug: 'case-studies-cta' }),
  ])

  return { storiesResult, logoWall, voiceOfCustomer, caseStudiesCta }
})

export default async function CaseStudiesPage() {
  const { storiesResult, logoWall, voiceOfCustomer, caseStudiesCta } = await getData()

  const stories = storiesResult.docs as unknown as CaseStudyCard[]
  const agribusinessLogos = (logoWall as any).agribusinessLogos ?? []
  const bankLogos = (logoWall as any).bankLogos ?? []
  const quotes = (voiceOfCustomer as any).quotes ?? []
  const cta = caseStudiesCta as any

  return (
    <main className="min-h-screen">
      <CaseStudiesHero />
      <LogoWall agribusinessLogos={agribusinessLogos} bankLogos={bankLogos} />
      <ImpactGrid stories={stories} />
      <DifferentiatorBanner />
      <VoiceOfCustomer quotes={quotes} />
      <CaseStudiesCTA
        heading={cta.heading}
        description={cta.description}
        primaryButtonLabel={cta.primaryButtonLabel}
        primaryButtonLink={cta.primaryButtonLink}
        secondaryButtonLabel={cta.secondaryButtonLabel}
        secondaryButtonLink={cta.secondaryButtonLink}
      />
    </main>
  )
}
