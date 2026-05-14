'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

type CarouselImage = {
  url: string
  alt: string
}

const INTERVAL_MS = 5000

export function CaseStudiesHeroCarousel({ images }: { images: CarouselImage[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [images.length])

  if (images.length === 0) return null

  return (
    <>
      {/* Carousel slides */}
      {images.map((img, i) => (
        <div
          key={img.url}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={img.url}
            alt={img.alt}
            fill
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Dot indicators — rendered outside the background layer so they sit above the overlay */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 h-2.5 bg-secondary'
                  : 'w-2.5 h-2.5 bg-primary-foreground/40 hover:bg-primary-foreground/70'
              }`}
            />
          ))}
        </div>
      )}
    </>
  )
}
