'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import { LogoCell } from '@/components/LogoCell'
import type { LogoEntry } from '@/components/LogoCell'
import { gaEvents } from '@/lib/ga-events'

import eudrLogo from '@/assets/EUDR.png'
import organicLogo from '@/assets/eu-organic-logo-600x400_0.png'
import fairtradeLogoSrc from '@/assets/Fairtrade-Logo.jpg'
import financeImage from '@/assets/Finance-2.png'
import supplyChainImage from '@/assets/supply-chain-digitalisation.png'

const impactMetrics = [
  { value: '1M+', label: 'Farmers digitalized' },
  { value: '250+', label: 'Agribusiness Clients' },
  { value: '20+', label: 'Countries' },
  { value: '15+', label: 'Years of Experience' },
  { value: 'Millions', label: 'in Loans De-risked Annually' },
]

const complianceLogos = [
  { src: eudrLogo, alt: 'EUDR Compliant' },
  { src: organicLogo, alt: 'EU Organic' },
  { src: fairtradeLogoSrc, alt: 'Fairtrade Certified' },
]

const ProofSection = ({ agribusinessLogos = [] }: { agribusinessLogos?: LogoEntry[] }) => {
  useEffect(() => {
    gaEvents.viewPage('home_proof', 'proof')
  }, [])

  return (
    <>
      {/* ── Trust & Metrics ──────────────────────────────────────────────────── */}
      <section className="section-gray py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-14">
            Trusted by <span className="gradient-primary-text">250+ Agribusinesses</span> to manage
            1M+ farmers Across 20 Countries
          </h2>

          {/* Impact Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto mb-16">
            {impactMetrics.map((m) => (
              <div
                key={m.label}
                className="text-center bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="text-2xl md:text-3xl font-black text-primary leading-tight">
                  {m.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1.5 leading-snug">{m.label}</div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mb-6">
            Trusted by leading agribusinesses in East Africa, West Africa, and beyond.
          </p>
          {agribusinessLogos.length > 0 && (
            <div
              className="overflow-hidden"
              style={{
                maskImage:
                  'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
              }}
            >
              <div
                className="flex items-center"
                style={{
                  animation: 'marquee 30s linear infinite',
                  width: 'max-content',
                }}
              >
                {[...agribusinessLogos, ...agribusinessLogos].map((logo, i) => (
                  <div
                    key={`${logo.id ?? logo.name}-${i}`}
                    className="flex items-center justify-center mx-10 opacity-60 hover:opacity-100 transition-opacity duration-300"
                  >
                    <LogoCell logo={{ ...logo, image: logo.image ? { ...logo.image, width: (logo.image.width ?? 120) * 1.5, height: (logo.image.height ?? 60) * 1.5 } : undefined }} textClassName="text-base font-bold text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Value Proposition — Layout E (minimal type-first) ───────────────── */}
      <section className="bg-background py-20">
        <div className="container mx-auto px-4">

          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Built to Solve{' '}
              <span className="gradient-primary-text">Africa&apos;s Agri-Value Chain</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-base">
              End-to-end traceability, built for global standards. De-risk lending, unlock capital for smallholders. From farm to market — fully digitalized.
            </p>
          </div>

          {/* 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">

            {/* ── Column 1: Traceability & Compliance ── */}
            <div className="flex flex-col">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
                Traceability &amp; Compliance
              </p>
              <h3 className="text-xl font-extrabold text-foreground leading-snug mb-3">
                End-to-end traceability, built for global standards
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                GPS mapping, automated compliance workflows, and digital chain-of-custody for EUDR,
                Organic, and Fairtrade certification.
              </p>
              <ul className="space-y-2.5 mb-6">
                {[
                  'GPS-mapped farm boundaries',
                  'Automated compliance reporting',
                  'Digital chain-of-custody',
                  'Audit-ready documentation',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="border-t border-border pt-6 flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-2">
                  {complianceLogos.map((logo) => (
                    <div
                      key={logo.alt}
                      className="bg-card rounded-lg p-2.5 flex items-center justify-center h-16"
                    >
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={80}
                        height={40}
                        className="object-contain max-h-full max-w-full"
                      />
                    </div>
                  ))}
                </div>
                <div className="bg-card rounded-xl p-4 flex items-center gap-4">
                  <QRCodeSVG value="http://whoproducedthis.info/" size={72} level="M" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      Trace your product
                    </p>
                    <a
                      href="http://whoproducedthis.info/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-primary hover:underline"
                    >
                      whoproducedthis.info
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Column 2: Financial Inclusion Engine ── */}
            <div className="flex flex-col">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">
                Financial Inclusion Engine
              </p>
              <h3 className="text-xl font-extrabold text-foreground leading-snug mb-3">
                De-risk lending. Unlock capital for smallholders.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Farmer profiling, input credit management, repayment tracking, and integrations with
                banks and mobile money.
              </p>
              <ul className="space-y-2.5 mb-6">
                {[
                  'Farmer credit scoring & profiling',
                  'Input loan disbursement via USSD',
                  'Repayment tracking & alerts',
                  'Bank & mobile money integrations',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="border-t border-border pt-6 flex-1">
                <div className="rounded-xl overflow-hidden border border-border">
                  <Image
                    src={financeImage}
                    alt="Financial Inclusion Engine"
                    width={480}
                    height={320}
                    className="object-contain w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* ── Column 3: Supply Chain Digitization ── */}
            <div className="flex flex-col">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
                Supply Chain Digitization
              </p>
              <h3 className="text-xl font-extrabold text-foreground leading-snug mb-3">
                From farm to market — fully digitalized.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Digitize aggregation, quality control, payments, logistics, and production
                planning — online and offline.
              </p>
              <ul className="space-y-2.5 mb-6">
                {[
                  'Aggregation & weighing',
                  'Quality grading & control',
                  'Payment disbursement',
                  'Logistics & production planning',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="border-t border-border pt-6 flex-1">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border">
                  <Image
                    src={supplyChainImage}
                    alt="Supply Chain Digitization"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

export default ProofSection
