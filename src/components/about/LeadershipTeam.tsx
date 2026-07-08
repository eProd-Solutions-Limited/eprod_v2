import { getPayloadClient } from '@/lib/payload-client'
import { cache } from 'react'
import LeadershipTeamClient, { type TeamMember } from './LeadershipTeamClient'

const getTeam = cache(async () => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'team',
    sort: 'order',
    limit: 100,
  })
})

function toMember(p: any): TeamMember {
  return {
    id: p.id,
    name: p.name,
    title: p.title,
    bio: p.bio,
    linkedin: p.linkedin,
    photoUrl: p.photo?.url ?? null,
  }
}

export default async function LeadershipTeam() {
  const { docs: team } = await getTeam()

  const leaders = team.filter((p: any) => p.isLeadership).map(toMember)
  const rest = team
    .filter((p: any) => !p.isLeadership)
    .sort((a: any, b: any) => a.name.localeCompare(b.name))
    .map(toMember)

  return <LeadershipTeamClient leaders={leaders} rest={rest} />
}
