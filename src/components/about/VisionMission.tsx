import Image from 'next/image'

const VisionMission = () => {
  return (
    <section className="section-gray py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-8 max-w-5xl mx-auto">
          <div className="relative w-2/3 h-56 mx-auto rounded-xl overflow-hidden">
            <Image
              src="/logos/integrations/about-mission.jpeg"
              alt="eProd vision and mission"
              fill
              className="object-contain"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-8 border border-border shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                To empower agribusinesses and smallholder farmers with technology that drives
                transparency, compliance, and financial inclusion.
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                A world where every farmer is visible, bankable, and connected to fair and efficient markets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VisionMission
