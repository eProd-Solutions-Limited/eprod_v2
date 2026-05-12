'use client'
import { useState, useEffect } from 'react'

interface Enquiry {
  id: string
  company: string
  email: string
  challenge: string
  status: 'new' | 'contacted' | 'qualified' | 'won' | 'lost'
  sourceSection: string
  notes: string
  createdAt: string
}

const STATUS_FILTERS = ['all', 'new', 'contacted', 'qualified', 'won', 'lost'] as const
type Filter = (typeof STATUS_FILTERS)[number]

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-gray-100 text-gray-800',
  qualified: 'bg-yellow-100 text-yellow-800',
  won: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800',
}

export default function LeadDashboard() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<Enquiry | null>(null)

  useEffect(() => {
    fetch('/api/enquiries')
      .then((r) => r.json())
      .then((data) => setEnquiries(data.docs ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/enquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: status as Enquiry['status'] } : e))
      )
      setSelected((prev) => (prev?.id === id ? { ...prev, status: status as Enquiry['status'] } : prev))
    }
  }

  const filtered = filter === 'all' ? enquiries : enquiries.filter((e) => e.status === filter)
  const stats = {
    total: enquiries.length,
    new: enquiries.filter((e) => e.status === 'new').length,
    qualified: enquiries.filter((e) => e.status === 'qualified').length,
    won: enquiries.filter((e) => e.status === 'won').length,
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Lead Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-gray-600 text-sm">New</p>
          <p className="text-3xl font-bold text-blue-600">{stats.new}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-gray-600 text-sm">Qualified</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.qualified}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-gray-600 text-sm">Won</p>
          <p className="text-3xl font-bold text-green-600">{stats.won}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition capitalize ${
              filter === f ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-600 py-12">Loading enquiries...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-600 py-12">No enquiries found</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold">Company</th>
                <th className="text-left px-4 py-3 font-semibold">Email</th>
                <th className="text-left px-4 py-3 font-semibold">Challenge</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-left px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((enquiry) => (
                <tr key={enquiry.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{enquiry.company}</td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${enquiry.email}`} className="text-primary underline">
                      {enquiry.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 capitalize">{enquiry.challenge}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[enquiry.status] ?? 'bg-gray-100 text-gray-800'}`}
                    >
                      {enquiry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(enquiry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(enquiry)}
                      className="text-primary hover:underline text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">{selected.company}</h2>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email</p>
                <a href={`mailto:${selected.email}`} className="text-primary underline">
                  {selected.email}
                </a>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Challenge</p>
                <p className="capitalize">{selected.challenge}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Source</p>
                <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded inline-block">
                  {selected.sourceSection || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Date</p>
                <p>{new Date(selected.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="border-t pt-6 mb-6">
              <p className="text-sm font-medium mb-3">Update Status</p>
              <div className="flex gap-2 flex-wrap">
                {(['new', 'contacted', 'qualified', 'won', 'lost'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(selected.id, status)}
                    className={`px-4 py-2 rounded text-sm capitalize transition ${
                      selected.status === status
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="w-full px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
