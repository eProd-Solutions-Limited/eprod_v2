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

  it('demoRequestClicked fires demo_request_clicked with source', () => {
    gaEvents.demoRequestClicked('fab')
    expect(window.gtag).toHaveBeenCalledWith('event', 'demo_request_clicked', {
      source: 'fab',
      timestamp: expect.any(String),
    })
  })

  it('demoRequestSubmitted fires demo_request_submitted with company', () => {
    gaEvents.demoRequestSubmitted('Acme Ltd')
    expect(window.gtag).toHaveBeenCalledWith('event', 'demo_request_submitted', {
      company: 'Acme Ltd',
      timestamp: expect.any(String),
    })
  })

  it('demoRequestSubmitted defaults company to "not_provided"', () => {
    gaEvents.demoRequestSubmitted()
    expect(window.gtag).toHaveBeenCalledWith('event', 'demo_request_submitted', {
      company: 'not_provided',
      timestamp: expect.any(String),
    })
  })

  it('contactFormSubmitted fires contact_form_submitted with company', () => {
    gaEvents.contactFormSubmitted('Acme Ltd')
    expect(window.gtag).toHaveBeenCalledWith('event', 'contact_form_submitted', {
      company: 'Acme Ltd',
      timestamp: expect.any(String),
    })
  })

  it('popupShown fires popup_shown with title and id', () => {
    gaEvents.popupShown('Summer Offer', 'popup-42')
    expect(window.gtag).toHaveBeenCalledWith('event', 'popup_shown', {
      popup_title: 'Summer Offer',
      popup_id: 'popup-42',
      timestamp: expect.any(String),
    })
  })

  it('popupCtaClicked fires popup_cta_clicked', () => {
    gaEvents.popupCtaClicked('Summer Offer', 'Learn More')
    expect(window.gtag).toHaveBeenCalledWith('event', 'popup_cta_clicked', {
      popup_title: 'Summer Offer',
      cta_text: 'Learn More',
      timestamp: expect.any(String),
    })
  })

  it('videoSelected fires video_selected with title', () => {
    gaEvents.videoSelected('eProd Platform Overview')
    expect(window.gtag).toHaveBeenCalledWith('event', 'video_selected', {
      video_title: 'eProd Platform Overview',
      timestamp: expect.any(String),
    })
  })

  it('faqOpened fires faq_opened with question and section', () => {
    gaEvents.faqOpened('What is eProd?', 'home')
    expect(window.gtag).toHaveBeenCalledWith('event', 'faq_opened', {
      question: 'What is eProd?',
      section: 'home',
      timestamp: expect.any(String),
    })
  })

  it('articleRead fires article_read with slug and depth', () => {
    gaEvents.articleRead('smallholder-finance', 50)
    expect(window.gtag).toHaveBeenCalledWith('event', 'article_read', {
      slug: 'smallholder-finance',
      depth: 50,
      timestamp: expect.any(String),
    })
  })

  it('caseStudyViewed fires case_study_viewed with slug', () => {
    gaEvents.caseStudyViewed('equity-bank')
    expect(window.gtag).toHaveBeenCalledWith('event', 'case_study_viewed', {
      slug: 'equity-bank',
      timestamp: expect.any(String),
    })
  })

  it('sectionViewed fires section_viewed with section name', () => {
    gaEvents.sectionViewed('hero')
    expect(window.gtag).toHaveBeenCalledWith('event', 'section_viewed', {
      section_name: 'hero',
      timestamp: expect.any(String),
    })
  })
})
