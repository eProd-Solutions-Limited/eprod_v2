declare global {
  interface Window {
    gtag?: (command: string, event: string, data?: Record<string, unknown>) => void
  }
}

export const gaEvents = {
  viewPage: (pageName: string, section?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_engagement', {
        page_name: pageName,
        section: section ?? 'general',
        timestamp: new Date().toISOString(),
      })
    }
  },

  clickCTA: (ctaText: string, section: string, targetUrl?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cta_clicked', {
        cta_text: ctaText,
        section,
        target_url: targetUrl ?? '',
        timestamp: new Date().toISOString(),
      })
    }
  },

  formSubmitted: (formName: string, company?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'lead_form_submission', {
        form_name: formName,
        company: company ?? 'not_provided',
        timestamp: new Date().toISOString(),
      })
    }
  },

  sectionViewed: (sectionName: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'section_viewed', {
        section_name: sectionName,
        timestamp: new Date().toISOString(),
      })
    }
  },

  demoRequestClicked: (source: 'fab' | 'cta') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'demo_request_clicked', {
        source,
        timestamp: new Date().toISOString(),
      })
    }
  },

  demoRequestSubmitted: (company?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'demo_request_submitted', {
        company: company ?? 'not_provided',
        timestamp: new Date().toISOString(),
      })
    }
  },

  contactFormSubmitted: (company?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'contact_form_submitted', {
        company: company ?? 'not_provided',
        timestamp: new Date().toISOString(),
      })
    }
  },

  popupShown: (popupTitle: string, popupId: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'popup_shown', {
        popup_title: popupTitle,
        popup_id: popupId,
        timestamp: new Date().toISOString(),
      })
    }
  },

  popupCtaClicked: (popupTitle: string, ctaText: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'popup_cta_clicked', {
        popup_title: popupTitle,
        cta_text: ctaText,
        timestamp: new Date().toISOString(),
      })
    }
  },

  videoSelected: (videoTitle: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'video_selected', {
        video_title: videoTitle,
        timestamp: new Date().toISOString(),
      })
    }
  },

  faqOpened: (question: string, section: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'faq_opened', {
        question,
        section,
        timestamp: new Date().toISOString(),
      })
    }
  },

  articleRead: (slug: string, depth: 25 | 50 | 75 | 100) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'article_read', {
        slug,
        depth,
        timestamp: new Date().toISOString(),
      })
    }
  },

  caseStudyViewed: (slug: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'case_study_viewed', {
        slug,
        timestamp: new Date().toISOString(),
      })
    }
  },
}
