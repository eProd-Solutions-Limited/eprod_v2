import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { gaEvents } from '@/lib/ga-events'

describe('gaEvents', () => {
  beforeEach(() => {
    vi.stubGlobal('gtag', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('viewPage fires page_engagement with provided section', () => {
    gaEvents.viewPage('home_hero', 'hero')
    expect(window.gtag).toHaveBeenCalledWith('event', 'page_engagement', {
      page_name: 'home_hero',
      section: 'hero',
      timestamp: expect.any(String),
    })
  })

  it('viewPage defaults section to "general"', () => {
    gaEvents.viewPage('home_hero')
    expect(window.gtag).toHaveBeenCalledWith('event', 'page_engagement', {
      page_name: 'home_hero',
      section: 'general',
      timestamp: expect.any(String),
    })
  })

  it('formSubmitted fires lead_form_submission with company', () => {
    gaEvents.formSubmitted('cta_form', 'Acme Ltd')
    expect(window.gtag).toHaveBeenCalledWith('event', 'lead_form_submission', {
      form_name: 'cta_form',
      company: 'Acme Ltd',
      timestamp: expect.any(String),
    })
  })

  it('formSubmitted defaults company to "not_provided"', () => {
    gaEvents.formSubmitted('cta_form')
    expect(window.gtag).toHaveBeenCalledWith('event', 'lead_form_submission', {
      form_name: 'cta_form',
      company: 'not_provided',
      timestamp: expect.any(String),
    })
  })

  it('clickCTA fires cta_clicked event', () => {
    gaEvents.clickCTA('Get Started', 'home_cta')
    expect(window.gtag).toHaveBeenCalledWith('event', 'cta_clicked', {
      cta_text: 'Get Started',
      section: 'home_cta',
      target_url: '',
      timestamp: expect.any(String),
    })
  })

  it('does not throw when gtag is unavailable', () => {
    vi.unstubAllGlobals()
    expect(() => gaEvents.viewPage('home', 'hero')).not.toThrow()
    expect(() => gaEvents.formSubmitted('cta_form')).not.toThrow()
    expect(() => gaEvents.clickCTA('Get Started', 'home_cta')).not.toThrow()
  })
})
