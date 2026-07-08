'use client'

import { Linkedin } from 'lucide-react'
import Image from 'next/image'
import { CircleBackground } from '@/components/ui/CircleBackground'
import { useI18n } from '@/lib/i18n/LanguageProvider'

export type TeamMember = {
  id: string | number
  name: string
  title?: string
  bio?: string
  linkedin?: string
  photoUrl?: string | null
}

export default function LeadershipTeamClient({
  leaders,
  rest,
}: {
  leaders: TeamMember[]
  rest: TeamMember[]
}) {
  const { t } = useI18n()

  if (leaders.length === 0 && rest.length === 0) return null

  return (
    <section id="team" className="bg-background py-20 relative overflow-hidden">
      <CircleBackground />
      <div className="container mx-auto px-4 relative z-10">
        {/* Leadership */}
        {leaders.length > 0 && (
          <div>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t.about.leadership.leadershipHeadingLead}{' '}
                <span className="gradient-primary-text">
                  {t.about.leadership.leadershipHeadingHighlight}
                </span>
              </h2>
              <p className="text-muted-foreground text-base max-w-2xl mx-auto">
                {t.about.leadership.leadershipSubtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 mx-auto">
              {leaders.map((person) => (
                <div
                  key={person.id}
                  className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group"
                >
                  {person.photoUrl && (
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={person.photoUrl}
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
                    <p className="text-sm text-muted-foreground leading-relaxed mt-3">{person.bio}</p>
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
                {t.about.leadership.teamHeadingLead}{' '}
                <span className="gradient-primary-text">{t.about.leadership.teamHeadingHighlight}</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {rest.map((person) => (
                <div
                  key={person.id}
                  className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group"
                >
                  {person.photoUrl && (
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={person.photoUrl}
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
                    <p className="text-sm text-muted-foreground leading-relaxed mt-3">{person.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
