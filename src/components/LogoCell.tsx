import Image from 'next/image'

export interface LogoEntry {
  name: string
  id?: string | number
  image?: { url: string; alt?: string; width?: number; height?: number } | null
}

export function LogoCell({ logo, textClassName }: { logo: LogoEntry; textClassName: string }) {
  if (logo.image?.url) {
    return (
      <Image
        src={logo.image.url}
        alt={logo.image.alt ?? logo.name}
        width={logo.image.width ?? 120}
        height={logo.image.height ?? 60}
        className="max-h-10 w-auto object-contain"
      />
    )
  }
  return <span className={textClassName}>{logo.name}</span>
}
