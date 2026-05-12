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
}
