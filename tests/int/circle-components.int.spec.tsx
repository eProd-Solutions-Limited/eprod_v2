import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { SectionScoop } from '@/components/ui/SectionScoop'
import { CircleBackground } from '@/components/ui/CircleBackground'

// jsdom does not ship IntersectionObserver
beforeEach(() => {
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })) as unknown as typeof IntersectionObserver
})

describe('SectionScoop', () => {
  it('renders with aria-hidden="true"', () => {
    const { container } = render(
      <SectionScoop direction="right" fromBg="white" nextBg="gray" />
    )
    expect((container.firstChild as HTMLElement).getAttribute('aria-hidden')).toBe('true')
  })

  it('inner div gets borderRadius "60px 0 0 0" for direction right', () => {
    const { container } = render(
      <SectionScoop direction="right" fromBg="white" nextBg="gray" />
    )
    const inner = container.querySelector('div > div > div') as HTMLElement
    expect(inner.style.borderRadius).toBe('60px 0 0 0')
  })

  it('inner div gets borderRadius "0 60px 0 0" for direction left', () => {
    const { container } = render(
      <SectionScoop direction="left" fromBg="white" nextBg="gray" />
    )
    const inner = container.querySelector('div > div > div') as HTMLElement
    expect(inner.style.borderRadius).toBe('0 60px 0 0')
  })

  it('applies nextBg as backgroundColor on inner div', () => {
    const { container } = render(
      <SectionScoop direction="right" fromBg="white" nextBg="hsl(210 20% 97.5%)" />
    )
    const inner = container.querySelector('div > div > div') as HTMLElement
    // jsdom normalizes colors - just verify a color value was set (not empty)
    expect(inner.style.backgroundColor).toBeTruthy()
    expect(inner.style.backgroundColor).not.toBe('white')
  })

  it('applies fromBg as backgroundColor on outer div', () => {
    const { container } = render(
      <SectionScoop direction="right" fromBg="hsl(0 0% 100%)" nextBg="gray" />
    )
    // jsdom normalizes colors - just verify a color value was set (not empty)
    expect((container.firstChild as HTMLElement).style.backgroundColor).toBeTruthy()
  })
})

describe('CircleBackground', () => {
  it('renders with aria-hidden="true"', () => {
    const { container } = render(<CircleBackground />)
    expect((container.firstChild as HTMLElement).getAttribute('aria-hidden')).toBe('true')
  })

  it('has pointer-events-none class', () => {
    const { container } = render(<CircleBackground />)
    expect((container.firstChild as HTMLElement).classList.contains('pointer-events-none')).toBe(true)
  })

  it('renders two blob divs for light variant', () => {
    const { container } = render(<CircleBackground variant="light" />)
    const blobs = container.querySelectorAll('div > div > div')
    expect(blobs.length).toBe(2)
  })

  it('renders two blob divs for dark variant', () => {
    const { container } = render(<CircleBackground variant="dark" />)
    const blobs = container.querySelectorAll('div > div > div')
    expect(blobs.length).toBe(2)
  })

  it('light variant blob uses teal color', () => {
    const { container } = render(<CircleBackground variant="light" />)
    const firstBlob = container.querySelector('div > div > div') as HTMLElement
    expect(firstBlob.style.background).toContain('rgba(2, 85, 90')
  })

  it('dark variant first blob uses white color', () => {
    const { container } = render(<CircleBackground variant="dark" />)
    const firstBlob = container.querySelector('div > div > div') as HTMLElement
    expect(firstBlob.style.background).toContain('rgba(255, 255, 255')
  })
})
