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

  it('skips active Hydra without saving a run', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Rozpocznij run' }))
    fireEvent.click(screen.getByRole('button', { name: 'Pomiń Hydrę' }))
    expect(screen.getByRole('button', { name: 'Rozpocznij run' })).toBeInTheDocument()
    expect(screen.getByText('0 zapisanych')).toBeInTheDocument()
  })

  it('shows active Hydra time in browser-tab title and restores default after reset', () => {
    render(<App />)
    expect(document.title).toBe('Dungeon Tracker | Metin2')

    fireEvent.click(screen.getByRole('button', { name: 'Rozpocznij run' }))
    expect(document.title).toBe('20:00 | Hydra')

    act(() => vi.advanceTimersByTime(1000))
    expect(document.title).toBe('19:59 | Hydra')

    fireEvent.click(screen.getByRole('button', { name: 'Resetuj timer' }))
    expect(document.title).toBe('Dungeon Tracker | Metin2')
  })

  it('restores default browser-tab title when Hydra expires', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Rozpocznij run' }))

    act(() => vi.advanceTimersByTime(20 * 60 * 1000))

    expect(document.title).toBe('Dungeon Tracker | Metin2')
  })

  it('advances Meley from registration through entry', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Zarejestruj' }))
    expect(screen.getByText(/oczekiwanie na wejście/i)).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(4 * 60 * 60 * 1000))
    expect(screen.getByRole('button', { name: 'Wejdź' })).toBeInTheDocument()
  })

  it('saves Hydra chests and shows sell threshold', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Rozpocznij run' }))
    fireEvent.change(screen.getByLabelText('Liczba skrzyń'), { target: { value: '40' } })
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz run' }))
    expect(screen.getByText(/40 skrzyń/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Sprzedane \/ wyzeruj' }))
    expect(screen.getByText('0 szt.')).toBeInTheDocument()
    expect(screen.getByText('40 skrzyń')).toBeInTheDocument()
  })

  it('adds a character from the Cory tab', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Cory' }))
    fireEvent.click(screen.getByRole('button', { name: 'Dodaj postać' }))
    expect(screen.getByDisplayValue('Postać 1')).toBeInTheDocument()
  })

  it('saves Hydra run on plain HTTP without UUID API', () => {
    vi.stubGlobal('crypto', {})
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Rozpocznij run' }))
    fireEvent.change(screen.getByLabelText('Liczba skrzyń'), { target: { value: '4' } })
    expect(() => fireEvent.click(screen.getByRole('button', { name: 'Zapisz run' }))).not.toThrow()
    expect(screen.getByText('4 skrzyń')).toBeInTheDocument()
    vi.unstubAllGlobals()
  })
})
