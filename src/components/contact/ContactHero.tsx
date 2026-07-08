'use client'

import { CircleBackground } from '@/components/ui/CircleBackground'
import { useI18n } from '@/lib/i18n/LanguageProvider'

const ContactHero = () => {
  const { t } = useI18n()
  return (
    <section
      className="relative overflow-hidden py-32 md:py-48 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/steps/Optimize.png')" }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <CircleBackground variant="dark" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-1"
        aria-hidden="true"
        style={{ backgroundColor: 'hsl(0 0% 100%)', borderRadius: '60px 0 0 0' }}
      />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <nav className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-white/80 transition-colors text-white/60">{t.contact.hero.breadcrumbHome}</a>
          <span className="text-white/40">›</span>
          <span className="text-white font-medium">{t.contact.hero.breadcrumbCurrent}</span>
        </nav>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          {t.contact.hero.title}
        </h1>
        <p className="text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
          {t.contact.hero.subtitle}
        </p>
      </div>
    </section>
  );
};

export default ContactHero;
