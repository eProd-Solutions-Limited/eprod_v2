import 'server-only'
import { BetaAnalyticsDataClient } from '@google-analytics/data'

function getClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SA_CREDENTIALS ?? '{}')
  return new BetaAnalyticsDataClient({ credentials })
}

function getPropertyId() {
  return process.env.GOOGLE_GA_PROPERTY_ID ?? ''
}

function startOfMonth(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${m}-01`
}

function startOfLastMonth(date: Date): string {
  const d = new Date(date.getFullYear(), date.getMonth() - 1, 1)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${d.getFullYear()}-${m}-01`
}

function endOfLastMonth(date: Date): string {
  const d = new Date(date.getFullYear(), date.getMonth(), 0)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export async function getTopPages(limit = 5): Promise<{ page: string; views: number }[]> {
  const propertyId = getPropertyId()
  if (!propertyId || !process.env.GOOGLE_SA_CREDENTIALS) return []

  try {
    const client = getClient()
    const now = new Date()
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: startOfMonth(now), endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit,
    })

    return (response.rows ?? []).map((row) => ({
      page: row.dimensionValues?.[0]?.value ?? '',
      views: parseInt(row.metricValues?.[0]?.value ?? '0', 10),
    }))
  } catch (err) {
    console.error('[ga-reporting] getTopPages failed:', err)
    return []
  }
}

export async function getMonthlyVisitors(): Promise<{ thisMonth: number; lastMonth: number }> {
  const propertyId = getPropertyId()
  if (!propertyId || !process.env.GOOGLE_SA_CREDENTIALS) return { thisMonth: 0, lastMonth: 0 }

  try {
    const client = getClient()
    const now = new Date()

    const [[thisMonthResp], [lastMonthResp]] = await Promise.all([
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: startOfMonth(now), endDate: 'today' }],
        metrics: [{ name: 'activeUsers' }],
      }),
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: startOfLastMonth(now), endDate: endOfLastMonth(now) }],
        metrics: [{ name: 'activeUsers' }],
      }),
    ])

    return {
      thisMonth: parseInt(thisMonthResp.rows?.[0]?.metricValues?.[0]?.value ?? '0', 10),
      lastMonth: parseInt(lastMonthResp.rows?.[0]?.metricValues?.[0]?.value ?? '0', 10),
    }
  } catch (err) {
    console.error('[ga-reporting] getMonthlyVisitors failed:', err)
    return { thisMonth: 0, lastMonth: 0 }
  }
}
