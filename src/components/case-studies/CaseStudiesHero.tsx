import { getPayloadClient } from '@/lib/payload-client'
import type { CaseStudiesHero as CaseStudiesHeroType } from '@/payload-types'
import { CaseStudiesHeroContent } from './CaseStudiesHeroContent'

async function getHeroImages() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'case-studies-hero',
    limit: 10,
    depth: 0,
  })
  return (result.docs as CaseStudiesHeroType[]).map((doc) => ({
    url: doc.url ?? '',
    alt: doc.alt ?? '',
  }))
}

export async function CaseStudiesHero() {
  const images = await getHeroImages()
  return <CaseStudiesHeroContent images={images} />
}
