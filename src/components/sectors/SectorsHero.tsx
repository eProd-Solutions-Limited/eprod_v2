'use client'

import { Globe, ArrowRight } from 'lucide-react'
import Image, { type StaticImageData } from 'next/image'
import { useState, useEffect } from 'react'

import { CircleBackground } from '@/components/ui/CircleBackground'

import coffeeImg from '@/assets/eprod-coffee-clients.jpg'
import horticultureImg from '@/assets/Horticulture-eprod.jpg'
import dairyImg from '@/assets/Value-chains-eProd-Solutions-Dairy.webp'
import seedsImg from '@/assets/Seed-producers-eprod.jpg'
import grainsImg from '@/assets/grains.jpg'
import spicesImg from '@/assets/Value-chain-eProd-Solutions-spices.jpg'
import nutsImg from '@/assets/Value-chain-eProd-Solutions-nuts.jpg'
import apicultureImg from '@/assets/Value-chain-eProd-Solutions-apiculture.jpg'
import palmoilImg from '@/assets/Palm-oil-eProd-Products.jpg'
import piscicultureImg from '@/assets/Value-chains-eProd-Solutions-Fish.webp'
import poultryImg from '@/assets/Value-chain-eProd-Solutions-Ltd-poultry.jpg'

// africa.svg geoViewBox="-25.360994 37.343521 59.838547 -34.833225", natural size 239.057 × 217.318
const W = 239.057
const H = 217.318

function geo(lon: number, lat: number) {
  return {
    x: +((lon + 25.360994) / 85.199541 * W).toFixed(2),
    y: +((37.343521 - lat) / 72.176746 * H).toFixed(2),
  }
}

type Sector = {
  id: string
  name: string
  color: string
  image: StaticImageData
  x: number
  y: number
  delay: string
}

const PER_SECTOR_MS = 4000

const SECTORS: Sector[] = [
  { id: 'coffee',       name: 'Coffee, Cocoa & Tea',  color: '#C2845A', image: coffeeImg,       delay: '0s',   ...geo(38,    8)   },
  { id: 'hort',         name: 'Horticulture',          color: '#4DB870', image: horticultureImg, delay: '0.5s', ...geo(-4,   32)   },
  { id: 'dairy',        name: 'Dairy',                 color: '#4A9FE0', image: dairyImg,        delay: '1s',   ...geo(36,   -1)   },
  { id: 'seeds',        name: 'Seeds',                 color: '#D4A020', image: seedsImg,        delay: '1.5s', ...geo(28,  -15)   },
  { id: 'grains',       name: 'Grains & Pulses',       color: '#E8721A', image: grainsImg,       delay: '2s',   ...geo(1,    14)   },
  { id: 'spices',       name: 'Spices',                color: '#E05050', image: spicesImg,       delay: '2.5s', ...geo(39.5, -6.2) },
  { id: 'nuts',         name: 'Nuts',                  color: '#C09060', image: nutsImg,         delay: '3s',   ...geo(-15,  14)   },
  { id: 'apiculture',   name: 'Apiculture',            color: '#FFB800', image: apicultureImg,   delay: '3.5s', ...geo(41,   11)   },
  { id: 'oiltree',      name: 'Oil & Tree Crops',      color: '#56AE76', image: palmoilImg,      delay: '4s',   ...geo(13,    4)   },
  { id: 'pisciculture', name: 'Pisciculture',          color: '#20A0B8', image: piscicultureImg, delay: '4.5s', ...geo(33,   -2)   },
  { id: 'poultry',      name: 'Poultry',               color: '#C89E30', image: poultryImg,      delay: '5s',   ...geo(26,  -28)   },
]

const DOT_MAP = Object.fromEntries(SECTORS.map(s => [s.id, s]))

const ARCS: [string, string][] = [
  ['coffee', 'apiculture'],
  ['dairy', 'pisciculture'],
  ['pisciculture', 'spices'],
  ['dairy', 'seeds'],
  ['seeds', 'poultry'],
  ['grains', 'oiltree'],
  ['grains', 'nuts'],
]

function arcPath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy)
  const bend = len * 0.2
  return `M${a.x},${a.y} Q${+(mx - (dy / len) * bend).toFixed(1)},${+(my + (dx / len) * bend).toFixed(1)} ${b.x},${b.y}`
}

function AfricaMap({ activeSectorId }: { activeSectorId: string }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const highlightId = hovered ?? activeSectorId

  return (
    <div className="relative w-full max-w-120" style={{ aspectRatio: `${W} / ${H}` }}>
      {/* Ambient glow */}
      <div className="absolute rounded-full pointer-events-none" style={{
        inset: '-15%',
        background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.18) 0%, transparent 68%)',
      }} />

      {/* Continent fill via CSS mask */}
      <div className="absolute inset-0 pointer-events-none" style={{
        WebkitMaskImage: "url('/africa.svg')",
        WebkitMaskSize: '100% 100%',
        maskImage: "url('/africa.svg')",
        maskSize: '100% 100%',
        background: 'rgba(255,255,255,0.14)',
      }} />

      {/* Outline — inverted to near-white so it contrasts against the teal background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/africa.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          filter: 'brightness(0) invert(1)',
          opacity: 0.7,
        }}
      />

      {/* SVG overlay — arcs, dots, hover labels */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
        className="absolute inset-0 w-full h-full"
        role="img"
        aria-label="Map of Africa showing eProd agricultural sector coverage"
        style={{ overflow: 'visible' }}
      >
        {/* Connecting arcs */}
        {ARCS.map(([fromId, toId]) => {
          const a = DOT_MAP[fromId], b = DOT_MAP[toId]
          if (!a || !b) return null
          return (
            <path
              key={`${fromId}-${toId}`}
              d={arcPath(a, b)}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.8"
              strokeDasharray="2.5 3.5"
              strokeLinecap="round"
            />
          )
        })}

        {/* Sector dots */}
        {SECTORS.map((sector) => {
          const isActive = highlightId === sector.id
          const dimmed = !isActive
          const labelLeft = sector.x > W * 0.6
          const labelBelow = sector.y < H * 0.15
          const labelW = sector.name.length * 5 + 14
          const lx = labelLeft ? -(labelW + 7) : 7
          const ly = labelBelow ? 8 : -16
          const r = isActive ? 5.5 : 4

          return (
            <g
              key={sector.id}
              transform={`translate(${sector.x},${sector.y})`}
              onMouseEnter={() => setHovered(sector.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Static glow rings when active */}
              {isActive && (
                <>
                  <circle r="12" fill="none" stroke={sector.color} strokeWidth="1.5" opacity="0.5" />
                  <circle r="22" fill="none" stroke={sector.color} strokeWidth="0.8" opacity="0.22" />
                </>
              )}

              {/* Animated pulse rings — only for the active sector */}
              {isActive && (
                <>
                  <circle r={r} fill="none" stroke={sector.color} strokeWidth="2">
                    <animate attributeName="r"       from={String(r)} to="26" dur="2.8s" begin={sector.delay} repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.9"        to="0"  dur="2.8s" begin={sector.delay} repeatCount="indefinite" />
                  </circle>
                  <circle r={r} fill="none" stroke={sector.color} strokeWidth="0.6">
                    <animate attributeName="r"       from={String(r)} to="40" dur="2.8s" begin={`${parseFloat(sector.delay) + 0.9}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.4"        to="0"  dur="2.8s" begin={`${parseFloat(sector.delay) + 0.9}s`} repeatCount="indefinite" />
                  </circle>
                </>
              )}

              {/* Core dot */}
              <circle r={r}          fill={sector.color}            opacity={dimmed ? 0.32 : 1} />
              <circle r={r * 0.42}   fill="rgba(255,255,255,0.75)"  opacity={dimmed ? 0.32 : 1} />

              {/* Label: always visible when active, visible on hover */}
              {(isActive || hovered === sector.id) && (
                <g>
                  <rect
                    x={lx} y={ly}
                    width={labelW} height="14" rx="3"
                    fill="rgba(0,18,28,0.88)"
                    stroke={sector.color} strokeWidth="0.8"
                  />
                  <text
                    x={lx + labelW / 2} y={ly + 9.5}
                    textAnchor="middle"
                    fill="white" fontSize="6.5"
                    fontFamily="system-ui, sans-serif" fontWeight="600"
                    style={{ pointerEvents: 'none' }}
                  >
                    {sector.name}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

const SectorsHero = () => {
  const [activeSectorIdx, setActiveSectorIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setActiveSectorIdx(i => (i + 1) % SECTORS.length),
      PER_SECTOR_MS,
    )
    return () => clearInterval(id)
  }, [])

  const activeSector = SECTORS[activeSectorIdx]

  return (
    <section
      className="relative overflow-hidden pt-24 md:pt-28 pb-28"
      style={{ backgroundColor: 'hsl(183,97%,18%)' }}
    >
      {/* Sector images — crossfade on active sector change */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {SECTORS.map((sector, i) => (
          <Image
            key={sector.id}
            src={sector.image}
            alt=""
            fill
            className="object-cover"
            style={{
              opacity: i === activeSectorIdx ? 1 : 0,
              transition: 'opacity 1.4s ease',
            }}
            priority={i === 0}
            sizes="100vw"
          />
        ))}
        {/* Teal brand overlay — keeps the gradient-primary look */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, hsl(183,97%,18%) 0%, hsl(183,38%,42%) 100%)', opacity: 0.2 }}
        />
      </div>

      <CircleBackground variant="dark" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-1"
        aria-hidden="true"
        style={{ backgroundColor: 'hsl(0 0% 100%)', borderRadius: '60px 0 0 0' }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Hero content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-[1fr_500px] gap-10 items-center">

          {/* Text */}
          <div>

            <h1 className="text-4xl md:text-6xl font-black text-primary-foreground leading-tight mb-6">
              Sectors We Serve —{' '}
              <span className="text-secondary">Tailored Solutions</span>{' '}
              for Every Value Chain
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed mb-8 max-w-xl">
              From farm-level data collection to export compliance and farmer payments, eProd adapts
              to the specific requirements of each agricultural sector across Africa and beyond.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#sectors"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-7 py-3.5 text-base font-semibold text-secondary-foreground hover:brightness-110 transition shadow-lg"
              >
                Explore Sectors
                <ArrowRight size={18} />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary-foreground/30 bg-primary-foreground/5 backdrop-blur px-7 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition"
              >
                Talk to a Specialist
              </a>
            </div>
          </div>

          {/* Africa map — desktop only */}
          <div className="hidden md:flex items-center justify-center" aria-hidden="true">
            <AfricaMap activeSectorId={activeSector.id} />
          </div>

        </div>
      </div>
    </section>
  )
}

export default SectorsHero
