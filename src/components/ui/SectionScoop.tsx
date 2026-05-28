interface Props {
  direction: 'left' | 'right'
  fromBg: string
  nextBg: string
}

export function SectionScoop({ direction, fromBg, nextBg }: Props) {
  return (
    <div
      className="relative h-16 overflow-hidden"
      aria-hidden="true"
      style={{ backgroundColor: fromBg }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: nextBg,
          borderRadius: direction === 'right' ? '60px 0 0 0' : '0 60px 0 0',
        }}
      />
    </div>
  )
}
