'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { dictionary, type Dict, type Lang } from './dictionary'

export const LANG_COOKIE = 'eprod-lang'
const STORAGE_KEY = 'eprod-lang'
const ONE_YEAR = 60 * 60 * 24 * 365

type I18nContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  toggle: () => void
  t: Dict
}

const I18nContext = createContext<I18nContextValue | null>(null)

function readStoredLang(): Lang | null {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|;\s*)eprod-lang=(en|fr)/)
    if (match) return match[1] as Lang
  }
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'fr') return saved
  } catch {
    /* ignore */
  }
  return null
}

export function LanguageProvider({
  children,
  initialLang = 'en',
}: {
  children: React.ReactNode
  /**
   * Language resolved on the server from the `eprod-lang` cookie. Used as the
   * initial state so the first (server) render already matches the visitor's
   * choice — no English flash on a fresh load.
   */
  initialLang?: Lang
}) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  // Safety net: after mount, re-read the stored choice directly from the cookie
  // (falling back to localStorage). This corrects the language even if the page
  // HTML was served from a cache that didn't see the cookie. Runs after hydration
  // so it can't cause a hydration mismatch.
  useEffect(() => {
    const stored = readStoredLang()
    if (stored && stored !== lang) {
      setLangState(stored)
      document.documentElement.lang = stored
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    document.documentElement.lang = next
    // Cookie is the source of truth the server reads on every request.
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=${ONE_YEAR}; samesite=lax`
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore write failures (private mode, etc.) */
    }
  }, [])

  const toggle = useCallback(() => {
    setLang(lang === 'en' ? 'fr' : 'en')
  }, [lang, setLang])

  const value = useMemo<I18nContextValue>(
    () => ({ lang, setLang, toggle, t: dictionary[lang] }),
    [lang, setLang, toggle],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within a LanguageProvider')
  return ctx
}
