interface Props {
  variant?: 'light' | 'dark'
}

export function CircleBackground({ variant = 'light' }: Props) {
  const isLight = variant === 'light'
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="animate-drift-1 absolute rounded-full"
        style={{
          top: '8%',
          right: '6%',
          width: 160,
          height: 160,
          background: isLight ? 'rgba(2, 85, 90, 0.18)' : 'rgba(255, 255, 255, 0.10)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="animate-drift-2 absolute rounded-full"
        style={{
          bottom: '12%',
          left: '5%',
          width: 120,
          height: 120,
          background: isLight ? 'rgba(139, 180, 58, 0.20)' : 'rgba(139, 180, 58, 0.18)',
          filter: 'blur(32px)',
        }}
      />
    </div>
  )
}
