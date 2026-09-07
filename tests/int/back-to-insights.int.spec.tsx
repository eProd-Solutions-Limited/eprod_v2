import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { BackToInsights } from '@/components/articles/BackToInsights'

describe('BackToInsights', () => {
  it('renders a link pointing to /insights', () => {
    render(<BackToInsights />)
    const link = screen.getByRole('link', { name: /back to insights/i })
    expect(link.getAttribute('href')).toBe('/insights')
  })

  it('merges a custom className onto the link', () => {
    const { container } = render(<BackToInsights className="mb-8" />)
    expect((container.firstChild as HTMLElement).classList.contains('mb-8')).toBe(true)
  })
})
