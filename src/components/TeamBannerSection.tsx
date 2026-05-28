import Image from 'next/image'
import Link from 'next/link'
import teamImg from '@/assets/team1.png'

const TeamBannerSection = () => {
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '420px' }}>
      {/* Background image */}
      <Image
        src={teamImg}
        alt="The eProd team"
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Text card — right side */}
      <div className="relative z-10 flex items-center justify-end h-full min-h-[420px]">
        <div className="m-6 md:m-12 bg-white rounded-2xl shadow-2xl p-8 md:p-10 max-w-sm w-full">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            We are <span className="gradient-primary-text">eProd!</span>
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Our team is always looking for passionate thinkers, doers, and innovators who share our mission of transforming agricultural supply chains across Africa and beyond.
          </p>
          <Link
            href="/about#team"
            className="inline-block rounded-full gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:brightness-110 transition shadow-md"
          >
            Meet the team →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default TeamBannerSection
