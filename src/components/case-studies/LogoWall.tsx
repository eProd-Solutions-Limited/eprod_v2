interface LogoEntry {
  name: string
  id?: string | number
}

interface LogoWallProps {
  agribusinessLogos: LogoEntry[]
  bankLogos: LogoEntry[]
}

export function LogoWall({ agribusinessLogos, bankLogos }: LogoWallProps) {
  return (
    <section className="bg-muted/40 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">
            The Ecosystem We Power
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
            Trusted by Africa's{' '}
            <span className="gradient-primary-text">Leading Agribusinesses</span> &amp; Financial
            Institutions
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="mb-6">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">Grid A</span>
              <h3 className="text-xl font-bold text-foreground mt-2 mb-1">Agribusiness Leaders</h3>
              <p className="text-sm text-muted-foreground">
                Digitalizing complex value chains from seed to export.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {agribusinessLogos.map((logo) => (
                <div
                  key={logo.id ?? logo.name}
                  className="h-20 rounded-lg bg-muted border border-border flex items-center justify-center px-3 text-center hover:border-primary/40 transition"
                >
                  <span className="text-xs font-bold text-muted-foreground">{logo.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="mb-6">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">Grid B</span>
              <h3 className="text-xl font-bold text-foreground mt-2 mb-1">Strategic Financial Partners</h3>
              <p className="text-sm text-muted-foreground">
                De-risking agricultural lending through verifiable data.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {bankLogos.map((logo) => (
                <div
                  key={logo.id ?? logo.name}
                  className="h-20 rounded-lg gradient-primary flex items-center justify-center px-3 text-center"
                >
                  <span className="text-xs font-bold text-primary-foreground">{logo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
