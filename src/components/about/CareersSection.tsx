// src/components/about/CareersSection.tsx
import { cache } from 'react'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'

const FALLBACK_EMAIL = 'hr@eprod-solutions.com'

const getJobs = cache(async () => {
  const payload = await getPayload({ config: payloadConfig })
  return payload.find({
    collection: 'jobs',
    where: { isActive: { equals: true } },
    sort: 'department',
    limit: 100,
  })
})

const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
}

export default async function CareersSection() {
  const { docs: jobs } = await getJobs()

  const jobPostingSchemas = jobs.map((job: any) => ({
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    hiringOrganization: {
      '@type': 'Organization',
      name: 'eProd Solutions',
      sameAs: 'https://eprod-solutions.com',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
      },
    },
    employmentType: job.type,
    datePosted: new Date(job.createdAt).toISOString().split('T')[0],
    ...(job.description ? { description: job.description } : {}),
  }))

  return (
    <>
      {jobPostingSchemas.map((schema: any, i: number) => (
        <script
          key={jobs[i].id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/\//g, '\\/') }}
        />
      ))}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
            Careers
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Work With <span className="gradient-primary-text">Us</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto mb-6">
            We&apos;re a mission-driven team building the infrastructure for African agriculture. Join us.
          </p>
          </div>

          {jobs.length === 0 ? (
            <div className="max-w-md mx-auto text-center border-2 border-dashed border-border rounded-xl p-10">
              <h3 className="text-lg font-bold text-foreground mb-2">
                No open roles right now — but great things grow slowly.
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Interested in joining us anyway? We&apos;d love to hear from you.
              </p>
              <a
                href={`mailto:${FALLBACK_EMAIL}`}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110 transition"
              >
                Email us at {FALLBACK_EMAIL} →
              </a>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {jobs.map((job: any) => (
                <article
                  key={job.id}
                  className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">
                    {job.department}
                  </p>
                  <h3 className="text-lg font-bold text-foreground mb-1">{job.title}</h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    {job.location} · {TYPE_LABELS[job.type] ?? job.type}
                  </p>
                  {job.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{job.description}</p>
                  )}
                  <a
                    href={`mailto:${job.applyEmail || FALLBACK_EMAIL}?subject=Application for ${encodeURIComponent(job.title)}`}
                    aria-label={`Apply for ${job.title}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 transition"
                  >
                    Apply →
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
