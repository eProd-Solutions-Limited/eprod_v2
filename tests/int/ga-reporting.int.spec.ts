import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockRunReport = vi.fn().mockResolvedValue([{
  rows: [
    { dimensionValues: [{ value: '/case-studies' }], metricValues: [{ value: '384' }] },
    { dimensionValues: [{ value: '/solutions' }], metricValues: [{ value: '218' }] },
  ],
}])

vi.mock('@google-analytics/data', () => ({
  BetaAnalyticsDataClient: vi.fn().mockImplementation(function () {
    this.runReport = mockRunReport
  }),
}))

describe('ga-reporting', () => {
  beforeEach(() => {
    process.env.GOOGLE_GA_PROPERTY_ID = '123456789'
    process.env.GOOGLE_SA_CREDENTIALS = JSON.stringify({ type: 'service_account', project_id: 'test' })
  })

  it('getTopPages returns pages with view counts', async () => {
    const { getTopPages } = await import('@/lib/ga-reporting')
    const result = await getTopPages(2)
    expect(result).toEqual([
      { page: '/case-studies', views: 384 },
      { page: '/solutions', views: 218 },
    ])
  })

  it('getTopPages returns empty array when env vars are missing', async () => {
    delete process.env.GOOGLE_GA_PROPERTY_ID
    const { getTopPages } = await import('@/lib/ga-reporting')
    const result = await getTopPages(5)
    expect(result).toEqual([])
  })
})
