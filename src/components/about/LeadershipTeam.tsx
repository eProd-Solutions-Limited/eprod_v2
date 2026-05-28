import { Linkedin } from "lucide-react";
import { CircleBackground } from '@/components/ui/CircleBackground'
import Image from "next/image";
import { cache } from 'react'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'

const getTeam = cache(async () => {
  const payload = await getPayload({ config: payloadConfig })
  return payload.find({
    collection: 'team',
    sort: 'order',
    limit: 100,
  })
})

export default async function LeadershipTeam() {
  const { docs: team } = await getTeam()

  const leaders = team.filter((p: any) => p.isLeadership)
  const rest = team.filter((p: any) => !p.isLeadership).sort((a: any, b: any) => a.name.localeCompare(b.name))

  return (
    <section className="bg-background py-20 relative overflow-hidden">
      <CircleBackground />
      <div className="container mx-auto px-4 relative z-10">

        {(leaders.length > 0 || rest.length > 0) && (
          <>
            {/* Leadership */}
            {leaders.length > 0 && (
              <div>
                <div className="text-center mb-14">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Meet Our <span className="gradient-primary-text">Leadership</span>
                  </h2>
                  <p className="text-muted-foreground text-base max-w-2xl mx-auto">
                    A team built for a generational business.
                  </p>
                </div>

                <div className="grid md:grid-cols-4 gap-8 mx-auto">
                  {leaders.map((person: any) => (
                    <div key={person.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                      {person.photo?.url && (
                        <div className="aspect-square overflow-hidden">
                          <Image
                            src={person.photo.url}
                            alt={`${person.name}, ${person.title}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            width={512}
                            height={512}
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-foreground">{person.name}</h3>
                            <p className="text-sm font-medium text-secondary">{person.title}</p>
                          </div>
                          {person.linkedin && (
                            <a
                              href={person.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition"
                              aria-label={`${person.name}'s LinkedIn`}
                            >
                              <Linkedin size={16} />
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                          {person.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rest of team */}
            {rest.length > 0 && (
              <div className="mt-20">
                <div className="text-center mb-14">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Meet The <span className="gradient-primary-text">Team</span>
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                  {rest.map((person: any) => (
                    <div key={person.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                      {person.photo?.url && (
                        <div className="aspect-square overflow-hidden">
                          <Image
                            src={person.photo.url}
                            alt={`${person.name}, ${person.title}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            width={512}
                            height={512}
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-foreground">{person.name}</h3>
                        <p className="text-sm font-medium text-secondary">{person.title}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                          {person.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}
