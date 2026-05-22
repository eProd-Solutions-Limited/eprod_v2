const chains = [
  'Coffee', 'Cocoa', 'Tea', 'Horticulture', 'Dairy',
  'Seeds', 'Grains', 'Pulses', 'Spices', 'Nuts',
  'Apiculture', 'Oil & Tree Crops', 'Pisciculture', 'Poultry',
]

const ValueChainBlock = () => (
  <section
    className="gradient-primary py-16"
    aria-label="Value chains supported by eProd"
  >
    <div className="container mx-auto px-4 text-center">
      <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-4">Platform Reach</p>
      <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
        Value Chains Supported
      </h2>
      <p className="text-primary-foreground/80 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
        Coffee, Cocoa, Tea, Horticulture, Dairy, Seeds, Grains, Pulses, Spices, Nuts,
        Apiculture, Oil &amp; Tree Crops, Pisciculture, Poultry, and more.
      </p>
      <div
        className="flex flex-wrap justify-center gap-3"
        role="list"
        aria-label="Supported value chains"
      >
        {chains.map((chain) => (
          <span
            key={chain}
            role="listitem"
            className="px-4 py-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground text-sm font-medium backdrop-blur"
          >
            {chain}
          </span>
        ))}
      </div>
    </div>
  </section>
)

export default ValueChainBlock
