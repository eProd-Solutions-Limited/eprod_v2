import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { headers as nextHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'

export default async function LeadDashboardPage() {
  const payload = await getPayload({ config: payloadConfig })
  const headersList = await nextHeaders()
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    redirect('/admin')
  }

  return <DashboardClient />
}
