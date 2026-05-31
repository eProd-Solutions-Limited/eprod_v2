'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Props {
  images: { url: string; alt: string }[]
  interval?: number
}

export function EventSlideshow({ images, interval = 5000 }: Props) {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)

  // Advance slide and remember the outgoing image
  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => {
      setCurrent((c) => {
        setPrev(c)
        return (c + 1) % images.length
      })
    }, interval)
    return () => clearInterval(id)
  }, [images.length, interval])

  // Drop the outgoing image reference after the crossfade completes
  useEffect(() => {
    if (prev === null) return
    const t = setTimeout(() => setPrev(null), 1800)
    return () => clearTimeout(t)
  }, [prev])

  if (!images.length) return null

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map(({ url, alt }, i) => {
        const isActive = i === current
        const isPrev   = i === prev

        return (
          <div
            key={url + i}
            className="absolute inset-0"
            style={{
              // outgoing image stays fully opaque beneath the incoming one;
              // incoming fades in on top; everything else invisible
              opacity:    isActive || isPrev ? 1 : 0,
              zIndex:     isActive ? 2 : isPrev ? 1 : 0,
              // only the incoming image gets a transition — outgoing stays put
              transition: isActive ? 'opacity 1800ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            }}
          >
            <Image
              src={url}
              alt={alt}
              fill
              className="object-cover"
              style={{
                // Ken Burns: slow zoom while the slide is active
                transform:  isActive ? 'scale(1.08)' : 'scale(1.0)',
                transition: isActive ? 'transform 9000ms ease-in-out' : 'none',
                willChange: 'transform',
              }}
              sizes="100vw"
              priority={i === 0}
            />
          </div>
        )
      })}
    </div>
  )
}
