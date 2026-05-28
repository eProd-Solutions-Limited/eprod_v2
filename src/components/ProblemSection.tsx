'use client'

import { useEffect } from 'react'
import Image, { StaticImageData } from 'next/image'
import { gaEvents } from '@/lib/ga-events'
import ledgerImg from '@/assets/Ledger.jpg'
import euMarketImg from '@/assets/EU-market.webp'
import marginErosionImg from '@/assets/margin erosin.png'

const problems: { title: string; text: string; image: StaticImageData; imageAlt: string; contain?: boolean }[] = [
  {
    title: "Fragmentation",
    text: "Managing 500+ farmers means juggling spreadsheets, WhatsApp, and notebooks. Data is scattered. Insights are hidden.",
    image: ledgerImg,
    imageAlt: "Fragmented ledger records representing data silos",
  },
  {
    title: "Compliance Risk",
    text: "Export requirements are tightening. One missed farmer record or quality issue can mean failed certification and lost market access.",
    image: euMarketImg,
    imageAlt: "EU market representing compliance and export requirements",
  },
  {
    title: "Margin Erosion",
    text: "Without visibility, waste goes undetected. Manual payments and inefficient communication with farmers cost you money every day.",
    image: marginErosionImg,
      imageAlt: "Declining margins illustrating cost inefficiencies",
      contain: false,
  },
];

const ProblemSection = () => {
  useEffect(() => {
    gaEvents.viewPage('home_problem', 'problem')
  }, [])

  return (
    <section className="section-gray py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          The Challenge: Managing Agricultural Supply Chains{" "}
          <span className="gradient-primary-text">at Scale</span>
        </h2>
        <p className="text-center md:text-2xl text-muted-foreground mb-14 max-w-2xl mx-auto">
          Agribusinesses face growing complexity every day. Here are the three biggest pain points.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((p) => (
            <div
              key={p.title}
              className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition group"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.imageAlt}
                  fill
                  className={`${p.contain ? 'object-contain' : 'object-cover'} group-hover:scale-105 transition-transform duration-500`}
                />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-foreground mb-3">{p.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
