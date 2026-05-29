export default function AnalyticsDashboard() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">GA4 Event Reference</h1>
      <p className="text-gray-500 mb-8">
        All custom events sent to Google Analytics 4 from this site.
        View live data in the{' '}
        <a
          href="https://analytics.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          GA4 console
        </a>{' '}
        under Reports → Realtime or Explore.
      </p>

      <div className="space-y-6">
        {[
          {
            group: 'Lead Events',
            events: [
              { name: 'demo_request_clicked', trigger: 'FAB button pressed', params: 'source' },
              { name: 'demo_request_submitted', trigger: 'FAB form successfully submitted', params: 'company' },
              { name: 'contact_form_submitted', trigger: 'Contact page form submitted', params: 'company' },
              { name: 'lead_form_submission', trigger: 'Any form submitted (legacy)', params: 'form_name, company' },
            ],
          },
          {
            group: 'Content Engagement',
            events: [
              { name: 'section_viewed', trigger: 'Major section scrolled into view (once)', params: 'section_name' },
              { name: 'article_read', trigger: 'Article scroll depth milestone', params: 'slug, depth (25/50/75/100)' },
              { name: 'case_study_viewed', trigger: 'Case study selected in carousel', params: 'slug' },
              { name: 'video_selected', trigger: 'Sidebar video thumbnail clicked', params: 'video_title' },
              { name: 'faq_opened', trigger: 'FAQ accordion item expanded', params: 'question, section' },
            ],
          },
          {
            group: 'Popup Events',
            events: [
              { name: 'popup_shown', trigger: 'Popup becomes visible after delay', params: 'popup_title, popup_id' },
              { name: 'popup_cta_clicked', trigger: 'CTA inside popup clicked', params: 'popup_title, cta_text' },
            ],
          },
          {
            group: 'Navigation',
            events: [
              { name: 'cta_clicked', trigger: 'CTA button clicked', params: 'cta_text, section, target_url' },
              { name: 'page_engagement', trigger: 'Page/section mounted', params: 'page_name, section' },
            ],
          },
        ].map(({ group, events }) => (
          <div key={group}>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">{group}</h2>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium">Event Name</th>
                    <th className="text-left px-4 py-2 font-medium">Trigger</th>
                    <th className="text-left px-4 py-2 font-medium">Parameters</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.map((e) => (
                    <tr key={e.name}>
                      <td className="px-4 py-2.5 font-mono text-xs text-indigo-700 whitespace-nowrap">{e.name}</td>
                      <td className="px-4 py-2.5 text-gray-700">{e.trigger}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-500">{e.params}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
