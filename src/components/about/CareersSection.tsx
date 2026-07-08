import { getPayloadClient } from '@/lib/payload-client'
// src/components/about/CareersSection.tsx
import { cache } from 'react'
import CareersClient, { type Job } from './CareersClient'

const getJobs = cache(async () => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'jobs',
    where: { isActive: { equals: true } },
    sort: 'department',
    limit: 100,
  })
})

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

  const clientJobs: Job[] = jobs.map((job: any) => ({
    id: job.id,
    title: job.title,
    department: job.department,
    location: job.location,
    type: job.type,
    description: job.description,
    applyEmail: job.applyEmail,
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
      <CareersClient jobs={clientJobs} />
    </>
  )
}
