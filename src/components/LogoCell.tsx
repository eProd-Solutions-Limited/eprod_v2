import Image from 'next/image'

export interface LogoEntry {
  name: string
  id?: string | number
  image?: { url: string; alt?: string; width?: number; height?: number } | null
  link?: string | null
}

function LogoContent({ logo, textClassName }: { logo: LogoEntry; textClassName: string }) {
  if (logo.image?.url) {
    return (
      <Image
        src={logo.image.url}
        alt={logo.image.alt ?? logo.name}
        width={logo.image.width ?? 120}
        height={logo.image.height ?? 60}
        className="max-h-16 w-auto object-contain"
      />
    )
  }
  return <span className={textClassName}>{logo.name}</span>
}

export function LogoCell({ logo, textClassName }: { logo: LogoEntry; textClassName: string }) {
  if (logo.link) {
    return (
      <a href={logo.link} target="_blank" rel="noopener noreferrer" aria-label={logo.name}>
        <LogoContent logo={logo} textClassName={textClassName} />
      </a>
    )
  }
  return <LogoContent logo={logo} textClassName={textClassName} />
}
