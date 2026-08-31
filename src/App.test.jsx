import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('dashboard', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-31T12:00:00'))
  })

  afterEach(() => vi.useRealTimers())

  it('starts Hydra and shows chest input', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Rozpocznij run' }))
    expect(screen.getByLabelText('Liczba skrzyń')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.getByText('19:59')).toBeInTheDocument()
  })

  it('advances Meley from registration through entry', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Zarejestruj' }))
    expect(screen.getByText(/oczekiwanie na wejście/i)).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(4 * 60 * 60 * 1000))
    expect(screen.getByRole('button', { name: 'Wejdź' })).toBeInTheDocument()
  })
})
