'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import { LogoCell } from '@/components/LogoCell'
import type { LogoEntry } from '@/components/LogoCell'
import { gaEvents } from '@/lib/ga-events'
import { ShieldCheck, Landmark, Package2, Check } from 'lucide-react'

import eudrLogo from '@/assets/EUDR.png'
import organicLogo from '@/assets/eu-organic-logo-600x400_0.png'
import fairtradeLogoSrc from '@/assets/Fairtrade-Logo.jpg'
import rainforestLogoSrc from '@/assets/rainforest-alliance.png'
import ussdFlowImage from '@/assets/I&M_USSD_Flow-Onboarding.png'
import supplyChainImage from '@/assets/supply-chain-digitalisation.jpeg'

const impactMetrics = [
  { value: '1M+', label: 'Farmers Digitized' },
  { value: '250+', label: 'Agribusiness Clients' },
  { value: '20+', label: 'Countries' },
  { value: '15+', label: 'Years of Experience' },
  { value: 'Millions', label: 'in Loans De-risked Annually' },
]

const complianceLogos = [
  { src: eudrLogo, alt: 'EUDR Compliant' },
  { src: organicLogo, alt: 'EU Organic' },
  { src: fairtradeLogoSrc, alt: 'Fairtrade Certified' },
  { src: rainforestLogoSrc, alt: 'Rainforest Alliance' },
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
          <div className="flex flex-wrap items-center justify-center gap-8">
            {agribusinessLogos.map((logo) => (
              <div
                key={logo.id ?? logo.name}
                className="px-6 py-3 rounded-lg bg-card border border-border flex items-center justify-center opacity-60 hover:opacity-100 transition"
              >
                <LogoCell logo={logo} textClassName="text-sm font-semibold text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Value Proposition Blocks ─────────────────────────────────────────── */}
      <section className="bg-background">
        <div className="container mx-auto px-4">

          {/* Section header */}
          <div className="text-center pt-20 pb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Built to Solve{' '}
              <span className="gradient-primary-text">Africa&apos;s Agri-Value Chain</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-base">
              From farm to finance to market — eProd digitizes every layer.
            </p>
          </div>

          {/* ── Block 1: Traceability & Compliance ───────────────────────────── */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center py-16 border-b border-border">
            {/* Text */}
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-5">
                <ShieldCheck size={14} />
                Traceability &amp; Compliance
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                End-to-end traceability, built for global standards
              </h3>
              <p className="text-muted-foreground mb-7 leading-relaxed">
                GPS mapping, automated compliance workflows, and digital chain-of-custody for EUDR,
                Organic, Fairtrade, and Rainforest Alliance certification.
              </p>
              <ul className="space-y-3">
                {[
                  'GPS-mapped farm boundaries',
                  'Automated compliance reporting',
                  'Digital chain-of-custody',
                  'Audit-ready documentation',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full gradient-primary flex items-center justify-center">
                      <Check size={11} className="text-primary-foreground" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual: Compliance logos grid + QR */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {complianceLogos.map((logo) => (
                  <div
                    key={logo.alt}
                    className="bg-card border border-border rounded-xl p-4 flex items-center justify-center h-24 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={120}
                      height={56}
                      className="object-contain max-h-full max-w-full"
                    />
                  </div>
                ))}
              </div>
              <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center gap-3 shadow-sm">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Trace your product
                </p>
                <QRCodeSVG value="http://whoproducedthis.info/" size={128} level="M" />
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

          {/* ── Block 2: Financial Inclusion Engine (reversed) ────────────────── */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center py-16 border-b border-border">
            {/* Visual: USSD flow — listed first so it appears on top on mobile */}
            <div className="rounded-2xl overflow-hidden shadow-xl border border-border bg-card">
              <Image
                src={ussdFlowImage}
                alt="USSD Loan Journey"
                width={640}
                height={440}
                className="object-contain w-full h-auto"
              />
            </div>

            {/* Text */}
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-3 py-1.5 rounded-full mb-5">
                <Landmark size={14} />
                Financial Inclusion Engine
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                De-risk lending. Unlock capital for smallholders.
              </h3>
              <p className="text-muted-foreground mb-7 leading-relaxed">
                De-risk lending with farmer profiling, input credit management, repayment tracking,
                and integrations with banks and mobile money.
              </p>
              <ul className="space-y-3">
                {[
                  'Farmer credit scoring & profiling',
                  'Input loan disbursement via USSD',
                  'Repayment tracking & alerts',
                  'Bank & mobile money integrations',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Check size={11} className="text-secondary" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Block 3: Supply Chain Digitization ───────────────────────────── */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center py-16 pb-20">
            {/* Text */}
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-5">
                <Package2 size={14} />
                Supply Chain Digitization
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                From farm to market — fully digitized.
              </h3>
              <p className="text-muted-foreground mb-7 leading-relaxed">
                Digitize aggregation, quality control, payments, logistics, and production
                planning — online and offline.
              </p>
              <ul className="space-y-3">
                {[
                  'Aggregation & weighing',
                  'Quality grading & control',
                  'Payment disbursement',
                  'Logistics & production planning',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full gradient-primary flex items-center justify-center">
                      <Check size={11} className="text-primary-foreground" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual: Supply chain image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-border">
              <Image
                src={supplyChainImage}
                alt="Supply Chain Digitization"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

        </div>
      </section>
    </>
  )
}

export default ProofSection
