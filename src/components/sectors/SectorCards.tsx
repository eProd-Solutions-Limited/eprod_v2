'use client'

import Image, { type StaticImageData } from 'next/image'
import { CircleBackground } from '@/components/ui/CircleBackground'
import { useI18n } from '@/lib/i18n/LanguageProvider'
import coffeeImg from '@/assets/eprod-coffee-clients.jpg'
import horticultureImg from '@/assets/Horticulture-eprod.jpg'
import dairyImg from '@/assets/cow.jpg'
import seedsImg from '@/assets/Seed-producers-eprod.jpg'
import spicesImg from '@/assets/Value-chain-eProd-Solutions-spices.jpg'
import grainsImg from '@/assets/grains.jpg'
import nutsImg from '@/assets/Value-chain-eProd-Solutions-nuts.jpg'
import apicultureImg from '@/assets/Value-chain-eProd-Solutions-apiculture.jpg'
import piscicultureImg from '@/assets/Fish.jpg'
import poultryImg from '@/assets/poultry.jpg'
import palmoilImg from '@/assets/Palm-oil-eProd-Products.jpg'
import rubberTreeImg from '@/assets/rubber-tree.jpg'

const sectorImages: StaticImageData[] = [
  coffeeImg, horticultureImg, dairyImg, seedsImg, grainsImg, spicesImg,
  nutsImg, apicultureImg, palmoilImg, piscicultureImg, poultryImg, rubberTreeImg,
]

const SectorCards = () => {
  const { t } = useI18n()
  const sectors = t.sectors.cards.items.map((s, i) => ({ ...s, image: sectorImages[i] }))

  return (
  <section id="sectors" className="bg-background py-20 relative overflow-hidden" aria-labelledby="sectors-heading">
    <CircleBackground />
    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">{t.sectors.cards.eyebrow}</p>
        <h2 id="sectors-heading" className="text-3xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
          {t.sectors.cards.headingLead}{' '}
          <span className="gradient-primary-text">{t.sectors.cards.headingHighlight}</span>
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {t.sectors.cards.subtitle}
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
}

export default SectorCards
