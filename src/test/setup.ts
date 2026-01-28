import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Mock GSAP to avoid issues in testing environment
vi.mock('gsap', () => {
  const mockTimeline = {
    to: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    fromTo: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    delay: vi.fn().mockReturnThis(),
  }

  return {
    gsap: {
      timeline: vi.fn(() => mockTimeline),
      fromTo: vi.fn(),
      to: vi.fn(),
      from: vi.fn(),
      set: vi.fn(),
      registerPlugin: vi.fn(),
      context: vi.fn((fn) => {
        if (typeof fn === 'function') fn()
        return { revert: vi.fn() }
      }),
    },
    ScrollTrigger: {
      create: vi.fn(),
      refresh: vi.fn(),
    },
  }
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Clean up after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})