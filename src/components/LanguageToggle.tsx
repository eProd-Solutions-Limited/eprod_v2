'use client'

import { Languages } from 'lucide-react'
import { useI18n } from '@/lib/i18n/LanguageProvider'

/**
 * Language switch (EN / FR) shown on every page, fixed just above the
 * "Contact Us" floating action button (DemoRequestFAB).
 */
export function LanguageToggle() {
  const { lang, setLang, t } = useI18n()

  return (
    <div
      className="fixed bottom-24 right-6 z-40 flex items-center gap-1 rounded-full border border-border bg-card/95 backdrop-blur px-1 py-1 shadow-lg"
      role="group"
      aria-label={t.languageToggle.label}
    >
      <Languages size={15} className="ml-1.5 mr-0.5 text-muted-foreground" aria-hidden="true" />
      {(['en', 'fr'] as const).map((code) => {
        const active = lang === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase transition-colors ${
              active
                ? 'gradient-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {code}
          </button>
        )
      })}
    </div>
  )
}

export default LanguageToggle
