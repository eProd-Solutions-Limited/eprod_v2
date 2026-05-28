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
          width: 110,
          height: 110,
          background: isLight ? 'rgba(2, 85, 90, 0.09)' : 'rgba(255, 255, 255, 0.05)',
          filter: 'blur(30px)',
        }}
      />
      <div
        className="animate-drift-2 absolute rounded-full"
        style={{
          bottom: '12%',
          left: '5%',
          width: 80,
          height: 80,
          background: isLight ? 'rgba(139, 180, 58, 0.11)' : 'rgba(139, 180, 58, 0.10)',
          filter: 'blur(24px)',
        }}
      />
    </div>
  )
}
