export default function AnalyticsDashboard() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Traffic Overview</h2>
          <p className="text-gray-600 mb-4">
            Visit your{' '}
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Google Analytics Dashboard
            </a>{' '}
            to view:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Page views and sessions</li>
            <li>User engagement by page</li>
            <li>CTA click-through rates</li>
            <li>Time spent on each section</li>
            <li>Traffic sources (organic, direct, referral)</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Events Tracked</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">page_engagement</span>
              <span className="font-mono text-xs">section mounts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">cta_clicked</span>
              <span className="font-mono text-xs">CTA button clicks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">lead_form_submission</span>
              <span className="font-mono text-xs">CTA form submits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">section_viewed</span>
              <span className="font-mono text-xs">scroll depth</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold mb-3">Setup Remaining</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>
            Get your Measurement ID from the{' '}
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Google Analytics console
            </a>{' '}
            (format: G-XXXXXXXXXX)
          </li>
          <li>
            Replace{' '}
            <code className="bg-white px-1 rounded border text-sm">G-PLACEHOLDER</code> in{' '}
            <code className="bg-white px-1 rounded border text-sm">
              src/app/(frontend)/layout.tsx
            </code>
          </li>
          <li>Set up conversion goals for form submissions in GA4</li>
          <li>Wait 24 hours for data to populate</li>
        </ol>
      </div>
    </div>
  )
}
