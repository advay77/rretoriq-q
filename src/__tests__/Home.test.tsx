import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '../test/utils'
import Home from '../pages/Home'

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    expect(screen.getByText(/Rretoriq/i)).toBeInTheDocument()
  })

  it('displays the hero section with call-to-action', () => {
    render(<Home />)
    const coaches = screen.getAllByText(/Bridging communication with Intelligence/i)
    expect(coaches.length).toBeGreaterThan(0)
  })

  it('shows call-to-action buttons', () => {
    render(<Home />)
    const buttons = screen.getAllByText(/Start Your Journey/i)
    expect(buttons.length).toBeGreaterThan(0)
    expect(screen.getByText(/Watch Demo/i)).toBeInTheDocument()
  })

  it('displays user engagement elements', () => {
    render(<Home />)
    // Check that the page has rendered properly
    const testimonials = screen.getAllByText(/Success stories from/i)
    expect(testimonials.length).toBeGreaterThan(0)
  })
})