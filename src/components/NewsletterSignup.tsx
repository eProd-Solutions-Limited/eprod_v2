'use client'

import { useState } from 'react'
import { Mail, ArrowRight, Check } from 'lucide-react'
import { useI18n } from '@/lib/i18n/LanguageProvider'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function NewsletterSignup() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = email.trim()
    if (!EMAIL_RE.test(value) || value.length > 254) {
      setError(t.newsletter.invalidEmail)
      setStatus('error')
      return
    }
    setError('')
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value, source: 'footer' }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setError(t.newsletter.error)
        setStatus('error')
      }
    } catch {
      setError(t.newsletter.error)
      setStatus('error')
    }
  }

  return (
    <div className="border-b border-primary-foreground/10 pb-12 mb-12">
      <div className="grid md:grid-cols-2 gap-6 md:items-center">
        <div>
          <h4 className="text-lg font-bold text-primary-foreground mb-1.5">{t.newsletter.title}</h4>
          <p className="text-sm text-primary-foreground/70 max-w-md">{t.newsletter.subtitle}</p>
        </div>

        {status === 'success' ? (
          <div className="flex items-center gap-2 text-primary-foreground md:justify-end">
            <span className="w-8 h-8 rounded-full bg-secondary/25 flex items-center justify-center shrink-0">
              <Check size={16} className="text-secondary-foreground" />
            </span>
            <span className="text-sm font-medium">{t.newsletter.success}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col sm:flex-row gap-2 md:justify-end">
              <div className="relative flex-1 sm:max-w-xs">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-foreground/50"
                  aria-hidden="true"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
                  disabled={status === 'loading'}
                  placeholder={t.newsletter.placeholder}
                  aria-label={t.newsletter.placeholder}
                  maxLength={254}
                  className="w-full rounded-full bg-primary-foreground/10 border border-primary-foreground/20 pl-9 pr-4 py-2.5 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-6 py-2.5 text-sm font-bold text-secondary-foreground hover:brightness-110 transition disabled:opacity-50"
              >
                {status === 'loading' ? t.newsletter.submitting : <>{t.newsletter.button} <ArrowRight size={15} /></>}
              </button>
            </div>
            {status === 'error' && error && (
              <p className="mt-2 text-xs text-red-300 md:text-right">{error}</p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}

export default NewsletterSignup
