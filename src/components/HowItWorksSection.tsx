'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { gaEvents } from '@/lib/ga-events'

const steps = [
  {
    image: "/steps/SetUp.png",
    title: "Setup",
    time: "Week 1",
    text: "We configure eProd for your specific supply chain.",
  },
  {
    image: "/steps/Onboard.jpeg",
    title: "Onboard",
    time: "Week 2-3",
    text: "Your team and farmers get trained on the platform.",
  },
  {
    image: "/steps/Integrate.png",
    title: "Integrate",
    time: "Week 3-4",
    text: "Connect existing systems. eProd becomes your central hub.",
  },
  {
    image: "/steps/Optimize.png",
    title: "Optimize",
    time: "Ongoing",
    text: "Monitor metrics and optimize operations with our support.",
  },
]

const HowItWorksSection = () => {
  useEffect(() => {
    gaEvents.viewPage('home_how_it_works', 'how_it_works')
  }, [])

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-14">
          Get Started in <span className="gradient-primary-text">4 Simple Steps</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-6 lg:gap-0 items-start mb-10">
          {steps.map((step, i) => (
            <>
              {/* Card */}
              <div
                key={step.title}
                className="group bg-card border border-border rounded-2xl overflow-hidden shadow-md hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 transition-all duration-200"
              >
                {/* Image with number badge + gradient overlay */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-4 left-4 w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-black text-base shadow-lg">
                    {i + 1}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6">
                  <span className="inline-block text-xs font-bold rounded-full bg-secondary/20 text-secondary px-3 py-1 mb-3">
                    {step.time}
                  </span>
                  <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
                </div>
              </div>

              {/* Arrow connector — shown only between cards on large screens */}
              {i < steps.length - 1 && (
                <div key={`arrow-${i}`} className="hidden lg:flex items-center justify-center px-2 pt-20">
                  <ArrowRight size={20} className="text-primary/40" />
                </div>
              )}
            </>
          ))}
        </div>

        <div className="text-center">
          <p className="inline-block rounded-full bg-secondary/15 px-6 py-3 text-secondary font-semibold text-sm">
            ⚡ Most customers see results within 30 days of launch.
          </p>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
