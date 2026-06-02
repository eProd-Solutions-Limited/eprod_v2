import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor, EXPERIMENTAL_TableFeature } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { seoPlugin } from '@payloadcms/plugin-seo'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Articles } from './collections/Articles'
import { CaseStudies } from './collections/CaseStudies'
import { Team } from './collections/Team'
import { EnquirySettings } from './globals/EnquirySettings'
import { Popups } from './collections/Popups'
import { Categories } from './collections/Categories'
import { Enquiries } from './collections/Enquiries'
import { CaseStudiesHeroCollection } from './collections/CaseStudiesHero'
import { Jobs } from './collections/Jobs'
import { Events } from './collections/Events'
import { PopupRegistrations } from './collections/PopupRegistrations'
import { LogoWall } from './globals/LogoWall'
import { VoiceOfCustomer } from './globals/VoiceOfCustomer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Articles, CaseStudies, Team, Popups, Categories, Enquiries, CaseStudiesHeroCollection, Jobs, Events, PopupRegistrations],
  globals: [LogoWall, VoiceOfCustomer, EnquirySettings],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, EXPERIMENTAL_TableFeature()],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
  ...(process.env.SMTP_HOST
    ? {
        email: nodemailerAdapter({
          transportOptions: {
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: process.env.SMTP_USER
              ? {
                  user: process.env.SMTP_USER,
                  pass: process.env.SMTP_PASS,
                }
              : undefined,
          },
          defaultFromName: 'eProd Solutions',
          defaultFromAddress: process.env.SMTP_FROM || 'noreply@eprod.local',
        }),
      }
    : {}),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: !!process.env.BLOB_READ_WRITE_TOKEN,
      collections: {
        media: true,
        'case-studies-hero': true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
    seoPlugin({
      collections: ['articles', 'events', 'case-studies'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => {
        const title = (doc as any)?.title ?? (doc as any)?.name ?? ''
        return title ? `${title} | eProd` : 'eProd Solutions'
      },
      generateDescription: ({ doc }) => {
        return (doc as any)?.excerpt ?? ''
      },
      generateURL: ({ doc, collectionConfig }) => {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.eprod-solutions.com'
        const slug = collectionConfig?.slug
        if (slug === 'articles') return `${siteUrl}/articles/${(doc as any)?.slug ?? ''}`
        if (slug === 'events') return `${siteUrl}/events/${(doc as any)?.id ?? ''}`
        if (slug === 'case-studies') return `${siteUrl}/case-studies`
        return siteUrl
      },
    }),
  ],
})