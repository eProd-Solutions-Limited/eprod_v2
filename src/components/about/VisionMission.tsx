'use client'

import Image from 'next/image'
import { CircleBackground } from '@/components/ui/CircleBackground'
import { useI18n } from '@/lib/i18n/LanguageProvider'

const VisionMission = () => {
  const { t } = useI18n()
  return (
    <section className="section-gray py-20 relative overflow-hidden">
      <CircleBackground />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col gap-8 max-w-5xl mx-auto">
          <div className="relative w-2/3 h-56 mx-auto rounded-xl overflow-hidden">
            <Image
              src="/logos/integrations/about-mission.jpeg"
              alt="eProd vision and mission"
              fill
              className="object-contain"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-8 border border-border shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-4">{t.about.vision.visionTitle}</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                {t.about.vision.visionText}
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-4">{t.about.vision.missionTitle}</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                {t.about.vision.missionText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VisionMission
