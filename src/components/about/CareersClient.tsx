'use client'

import { CircleBackground } from '@/components/ui/CircleBackground'
import { useI18n } from '@/lib/i18n/LanguageProvider'

const FALLBACK_EMAIL = 'hr@eprod-solutions.com'

export type Job = {
  id: string | number
  title: string
  department?: string
  location?: string
  type?: string
  description?: string
  applyEmail?: string
}

export default function CareersClient({ jobs }: { jobs: Job[] }) {
  const { t } = useI18n()
  const typeLabels = t.about.careers.typeLabels as Record<string, string>

  return (
    <section id="careers" className="bg-background py-20 relative overflow-hidden">
      <CircleBackground />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
            {t.about.careers.eyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.about.careers.headingLead} <span className="gradient-primary-text">{t.about.careers.headingHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto mb-6">
            {t.about.careers.subtitle}
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="max-w-md mx-auto text-center border-2 border-dashed border-border rounded-xl p-10">
            <h3 className="text-lg font-bold text-foreground mb-2">{t.about.careers.emptyTitle}</h3>
            <p className="text-muted-foreground text-sm mb-6">{t.about.careers.emptyText}</p>
            <a
              href={`mailto:${FALLBACK_EMAIL}`}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110 transition"
            >
              {t.about.careers.emailPrefix} {FALLBACK_EMAIL} →
            </a>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <article
                key={job.id}
                className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">
                  {job.department}
                </p>
                <h3 className="text-lg font-bold text-foreground mb-1">{job.title}</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  {job.location} · {(job.type && typeLabels[job.type]) ?? job.type}
                </p>
                {job.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{job.description}</p>
                )}
                <a
                  href={`mailto:${job.applyEmail || FALLBACK_EMAIL}?subject=Application for ${encodeURIComponent(job.title)}`}
                  aria-label={`Apply for ${job.title}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 transition"
                >
                  {t.about.careers.apply}
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
