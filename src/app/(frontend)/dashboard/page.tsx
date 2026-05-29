import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { headers as nextHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'
import { getTopPages, getMonthlyVisitors } from '@/lib/ga-reporting'

export const dynamic = 'force-dynamic'

function isoWeekKey(date: Date): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week1 = new Date(d.getFullYear(), 0, 4)
  const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
}

function delta(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? `+${current}` : '—'
  const diff = current - previous
  return diff > 0 ? `+${diff}` : String(diff)
}

function deltaColor(current: number, previous: number): string {
  if (current > previous) return 'text-green-600'
  if (current < previous) return 'text-red-500'
  return 'text-gray-400'
}

export default async function LeadDashboardPage() {
  const payload = await getPayload({ config: payloadConfig })
  const headersList = await nextHeaders()
  const { user } = await payload.auth({ headers: headersList })

  if (!user) redirect('/admin')

  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const eightWeeksAgo = new Date(now.getTime() - 8 * 7 * 24 * 60 * 60 * 1000)

  const [enquiriesResult, visitors, topPages] = await Promise.all([
    payload.find({
      collection: 'enquiries',
      where: { createdAt: { greater_than: lastMonthStart.toISOString() } },
      limit: 0,
      sort: '-createdAt',
    }),
    getMonthlyVisitors(),
    getTopPages(5),
  ])

  const allEnquiries = enquiriesResult.docs as unknown as Array<{
    id: string
    company: string
    email: string
    sourceSection: string
    createdAt: string
  }>

  const thisMonth = allEnquiries.filter((e) => new Date(e.createdAt) >= thisMonthStart)
  const lastMonth = allEnquiries.filter(
    (e) => new Date(e.createdAt) >= lastMonthStart && new Date(e.createdAt) < thisMonthStart,
  )

  const demoThisMonth = thisMonth.filter((e) => e.sourceSection === 'demo_request_fab').length
  const demoLastMonth = lastMonth.filter((e) => e.sourceSection === 'demo_request_fab').length
  const contactThisMonth = thisMonth.filter((e) => e.sourceSection === 'contact_page').length
  const contactLastMonth = lastMonth.filter((e) => e.sourceSection === 'contact_page').length

  // Build 8-week trend
  const weeklyEnquiries = allEnquiries.filter((e) => new Date(e.createdAt) >= eightWeeksAgo)
  const weekMap = new Map<string, number>()
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
    weekMap.set(isoWeekKey(d), 0)
  }
  for (const e of weeklyEnquiries) {
    const key = isoWeekKey(new Date(e.createdAt))
    if (weekMap.has(key)) weekMap.set(key, (weekMap.get(key) ?? 0) + 1)
  }
  const weekTrend = Array.from(weekMap.entries()).map(([key, count], i) => ({
    label: `W${i + 1}`,
    count,
  }))
  const maxCount = Math.max(...weekTrend.map((w) => w.count), 1)

  const statCards = [
    {
      label: 'Leads This Month',
      value: thisMonth.length,
      prev: lastMonth.length,
    },
    {
      label: 'Demo Requests',
      value: demoThisMonth,
      prev: demoLastMonth,
    },
    {
      label: 'Contact Forms',
      value: contactThisMonth,
      prev: contactLastMonth,
    },
    {
      label: 'Site Visitors',
      value: visitors.thisMonth,
      prev: visitors.lastMonth,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border p-5">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{card.label}</p>
            <p className="text-3xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
            <p className={`text-xs mt-1 font-medium ${deltaColor(card.value, card.prev)}`}>
              {delta(card.value, card.prev)} vs last month
            </p>
          </div>
        ))}
      </div>

      {/* Trend + top pages */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Weekly trend */}
        <div className="bg-white rounded-xl border p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Lead Trend — Last 8 Weeks</p>
          <div className="flex items-end gap-2 h-20">
            {weekTrend.map((week, i) => (
              <div key={week.label} className="flex flex-col items-center gap-1 flex-1">
                <div
                  className={`w-full rounded-t-sm ${i === weekTrend.length - 1 ? 'bg-green-500' : 'bg-indigo-500'}`}
                  style={{ height: `${Math.max((week.count / maxCount) * 72, 4)}px` }}
                />
                <span className="text-[10px] text-gray-400">{week.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top content */}
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-800">Top Content This Month</p>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded">GA4 API</span>
          </div>
          {topPages.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">
              No GA4 data — check GOOGLE_SA_CREDENTIALS env var
            </p>
          ) : (
            <div className="space-y-2.5">
              {topPages.map((page, i) => (
                <div key={page.page} className="flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 rounded bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate text-gray-700 font-mono text-xs">{page.page}</span>
                  <span className="text-gray-500 font-semibold shrink-0">{page.views.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Existing lead management table */}
      <DashboardClient />
    </div>
  )
}
