import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor, EXPERIMENTAL_TableFeature } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Articles } from './collections/Articles'
import { CaseStudies } from './collections/CaseStudies'
import { Team } from './collections/Team'
import { CTAConfig } from './collections/CTAConfig'
import { Popups } from './collections/Popups'
import { Categories } from './collections/Categories'
import { Enquiries } from './collections/Enquiries'
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
  collections: [Users, Media, Articles, CaseStudies, Team, CTAConfig, Popups, Categories, Enquiries],
  globals: [LogoWall, VoiceOfCustomer],
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
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})