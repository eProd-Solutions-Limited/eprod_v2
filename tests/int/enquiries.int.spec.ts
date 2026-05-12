import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('Enquiries collection', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('creates an enquiry with default status "new"', async () => {
    const enquiry = await payload.create({
      collection: 'enquiries',
      data: {
        company: 'Test Agri Corp',
        email: 'test@example.com',
        challenge: 'efficiency',
        sourceSection: 'home_cta',
      },
    })
    expect(enquiry.company).toBe('Test Agri Corp')
    expect(enquiry.email).toBe('test@example.com')
    expect(enquiry.challenge).toBe('efficiency')
    expect(enquiry.status).toBe('new')
    expect(enquiry.createdAt).toBeDefined()
  })

  it('can update enquiry status to "contacted"', async () => {
    const created = await payload.create({
      collection: 'enquiries',
      data: {
        company: 'Update Corp',
        email: 'update@example.com',
        challenge: 'compliance',
      },
    })
    const updated = await payload.update({
      collection: 'enquiries',
      id: created.id,
      data: { status: 'contacted' },
      overrideAccess: true,
    })
    expect(updated.status).toBe('contacted')
  })
})
