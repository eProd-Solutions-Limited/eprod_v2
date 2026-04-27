'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { RichTextRenderer } from './RichTextRenderer'

// ─── Types ────────────────────────────────────────────────────────────────────

type MediaValue = { url?: string; alt?: string; width?: number; height?: number }

type PopupButton = {
  id?: string
  label: string
  action: 'link' | 'register' | 'close'
  url?: string
  openInNewTab?: boolean
  style: 'primary' | 'secondary' | 'outline' | 'ghost'
}

export type SerializedPopup = {
  id: string | number
  name: string
  scheduling?: { startDate?: string; endDate?: string }
  display: {
    pages: 'all' | 'homepage' | 'specific'
    specificPaths?: { path: string }[]
    delay: number
    frequency: 'every-visit' | 'once-per-session' | 'once-per-day' | 'once-per-week' | 'once-ever'
  }
  content: {
    badge?: string
    title: string
    body?: unknown
    image?: MediaValue | null
  }
  buttons?: PopupButton[]
  registration?: {
    notifyEmail?: string
    emailSubject?: string
    collectName?: boolean
    collectPhone?: boolean
    collectOrganization?: boolean
    successMessage?: string
  }
  appearance?: {
    size?: 'sm' | 'md' | 'lg'
    showCloseButton?: boolean
    closeOnOverlayClick?: boolean
    badgeColor?: 'brand' | 'green' | 'blue' | 'orange' | 'purple' | 'red'
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = (id: string | number) => `eprod_popup_${id}`

function shouldShow(popup: SerializedPopup): boolean {
  const { frequency } = popup.display
  if (frequency === 'every-visit') return true

  const key = STORAGE_KEY(popup.id)

  if (frequency === 'once-per-session') {
    return !sessionStorage.getItem(key)
  }

  const raw = localStorage.getItem(key)
  if (!raw) return true
  const ts = parseInt(raw, 10)
  const now = Date.now()
  const day = 86_400_000
  if (frequency === 'once-per-day') return now - ts > day
  if (frequency === 'once-per-week') return now - ts > 7 * day
  if (frequency === 'once-ever') return false
  return true
}

function markShown(popup: SerializedPopup) {
  const { frequency } = popup.display
  if (frequency === 'every-visit') return
  const key = STORAGE_KEY(popup.id)
  if (frequency === 'once-per-session') {
    sessionStorage.setItem(key, '1')
  } else {
    localStorage.setItem(key, String(Date.now()))
  }
}

function matchesPage(popup: SerializedPopup, pathname: string): boolean {
  const { pages, specificPaths } = popup.display
  if (pages === 'all') return true
  if (pages === 'homepage') return pathname === '/'
  if (pages === 'specific') {
    return (specificPaths ?? []).some((entry) => entry.path === pathname)
  }
  return false
}

function isScheduled(popup: SerializedPopup): boolean {
  const { startDate, endDate } = popup.scheduling ?? {}
  const now = Date.now()
  if (startDate && new Date(startDate).getTime() > now) return false
  if (endDate && new Date(endDate).getTime() < now) return false
  return true
}

function selectPopup(popups: SerializedPopup[], pathname: string): SerializedPopup | null {
  for (const popup of popups) {
    if (!isScheduled(popup)) continue
    if (!matchesPage(popup, pathname)) continue
    if (!shouldShow(popup)) continue
    return popup
  }
  return null
}

// ─── Badge colors ─────────────────────────────────────────────────────────────

const BADGE_CLASSES: Record<string, string> = {
  brand: 'bg-primary text-primary-foreground',
  green: 'bg-green-600 text-white',
  blue: 'bg-blue-600 text-white',
  orange: 'bg-orange-500 text-white',
  purple: 'bg-purple-600 text-white',
  red: 'bg-red-600 text-white',
}

// ─── Size map ─────────────────────────────────────────────────────────────────

const SIZE_CLASSES: Record<string, string> = {
  sm: 'max-w-[400px]',
  md: 'max-w-[560px]',
  lg: 'max-w-[720px]',
}

// ─── Button component ─────────────────────────────────────────────────────────

function PopupBtn({
  btn,
  onClick,
  disabled,
}: {
  btn: PopupButton
  onClick: () => void
  disabled?: boolean
}) {
  const base = 'inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:pointer-events-none'
  const styles: Record<string, string> = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    outline: 'border border-primary text-primary hover:bg-primary/10',
    ghost: 'text-primary hover:bg-primary/10',
  }

  if (btn.action === 'link' && btn.url) {
    return (
      <a
        href={btn.url}
        target={btn.openInNewTab ? '_blank' : undefined}
        rel={btn.openInNewTab ? 'noopener noreferrer' : undefined}
        className={`${base} ${styles[btn.style] ?? styles.primary}`}
        onClick={onClick}
      >
        {btn.label}
      </a>
    )
  }

  return (
    <button
      className={`${base} ${styles[btn.style] ?? styles.primary}`}
      onClick={onClick}
      disabled={disabled}
    >
      {btn.label}
    </button>
  )
}

// ─── Registration form ────────────────────────────────────────────────────────

type RegState = 'idle' | 'loading' | 'success' | 'error'

function RegistrationForm({
  popup,
  onSuccess,
}: {
  popup: SerializedPopup
  onSuccess: () => void
}) {
  const reg = popup.registration ?? {}
  const [state, setState] = useState<RegState>('idle')
  const [error, setError] = useState('')
  const [fields, setFields] = useState({ name: '', email: '', phone: '', organization: '' })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    setError('')
    try {
      const res = await fetch('/api/popup-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ popupId: popup.id, ...fields }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || 'Something went wrong')
      }
      setState('success')
      onSuccess()
    } catch (err: unknown) {
      setState('error')
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (state === 'success') {
    return (
      <div className="mt-4 rounded-lg bg-secondary/20 px-4 py-3 text-center text-sm font-medium text-foreground">
        {reg.successMessage ?? "You're registered! We'll be in touch soon."}
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3">
      {reg.collectName && (
        <input
          type="text"
          placeholder="Your name"
          required
          value={fields.name}
          onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      )}
      <input
        type="email"
        placeholder="Your email address"
        required
        value={fields.email}
        onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      {reg.collectPhone && (
        <input
          type="tel"
          placeholder="Phone number (optional)"
          value={fields.phone}
          onChange={(e) => setFields((f) => ({ ...f, phone: e.target.value }))}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      )}
      {reg.collectOrganization && (
        <input
          type="text"
          placeholder="Organization / Company (optional)"
          value={fields.organization}
          onChange={(e) => setFields((f) => ({ ...f, organization: e.target.value }))}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      )}
      {state === 'error' && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <button
        type="submit"
        disabled={state === 'loading'}
        className="w-full rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {state === 'loading' ? 'Submitting…' : 'Submit'}
      </button>
    </form>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function PopupModal({
  popup,
  onClose,
}: {
  popup: SerializedPopup
  onClose: () => void
}) {
  const appearance = popup.appearance ?? {}
  const sizeClass = SIZE_CLASSES[appearance.size ?? 'md']
  const badgeColor = BADGE_CLASSES[appearance.badgeColor ?? 'brand']
  const [showRegForm, setShowRegForm] = useState(false)
  const [registered, setRegistered] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Trap focus inside modal
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()
    return () => { prev?.focus() }
  }, [])

  // ESC to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && appearance.showCloseButton !== false) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, appearance.showCloseButton])

  function handleButtonClick(btn: PopupButton) {
    if (btn.action === 'close') { onClose(); return }
    if (btn.action === 'register') { setShowRegForm(true); return }
    // 'link' handled by the anchor tag itself — just mark shown & close
    if (btn.action === 'link') onClose()
  }

  const image = popup.content.image
  const hasImage = image && typeof image === 'object' && image.url

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => appearance.closeOnOverlayClick !== false && onClose()}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        ref={dialogRef}
        tabIndex={-1}
        className={`fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 ${sizeClass} rounded-2xl bg-card shadow-2xl outline-none animate-in fade-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Optional image */}
        {hasImage && (
          <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
            <Image
              src={image.url!}
              alt={image.alt ?? popup.content.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Body */}
        <div className="p-6">
          {/* Close button */}
          {appearance.showCloseButton !== false && (
            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}

          {/* Badge */}
          {popup.content.badge && (
            <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold tracking-wide mb-3 ${badgeColor}`}>
              {popup.content.badge}
            </span>
          )}

          {/* Title */}
          <h2 id="popup-title" className="text-xl font-bold text-foreground leading-snug">
            {popup.content.title}
          </h2>

          {/* Rich text body */}
          {popup.content.body != null && (
            <div className="mt-3">
              <RichTextRenderer
                data={popup.content.body as Parameters<typeof RichTextRenderer>[0]['data']}
                className="text-sm [&_p]:my-1.5 [&_p]:text-muted-foreground"
              />
            </div>
          )}

          {/* Register form (shown after clicking register button) */}
          {showRegForm && !registered && (
            <RegistrationForm
              popup={popup}
              onSuccess={() => setRegistered(true)}
            />
          )}

          {/* Buttons */}
          {!showRegForm && (popup.buttons?.length ?? 0) > 0 && (
            <div className="mt-5 flex flex-wrap gap-3">
              {popup.buttons!.map((btn, i) => (
                <PopupBtn
                  key={btn.id ?? i}
                  btn={btn}
                  onClick={() => handleButtonClick(btn)}
                />
              ))}
            </div>
          )}

          {/* After successful registration, offer a close button */}
          {registered && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={onClose}
                className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ─── Manager (entry point rendered in layout) ─────────────────────────────────

export function PopupClient({ popups }: { popups: SerializedPopup[] }) {
  const pathname = usePathname()
  const [active, setActive] = useState<SerializedPopup | null>(null)

  useEffect(() => {
    const popup = selectPopup(popups, pathname)
    if (!popup) return

    const delay = (popup.display.delay ?? 0) * 1000
    const timer = setTimeout(() => {
      markShown(popup)
      setActive(popup)
    }, delay)

    return () => clearTimeout(timer)
  // Re-evaluate when the path changes (SPA navigation)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  if (!active) return null

  return <PopupModal popup={active} onClose={() => setActive(null)} />
}
