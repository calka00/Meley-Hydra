import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CoryPanel from './CoryPanel'
import { createInitialCoryState } from '../domain'

describe('CoryPanel', () => {
  it('supports named characters up to nine per account', () => {
    const cory = createInitialCoryState()
    const onChange = vi.fn()
    const { rerender } = render(<CoryPanel cory={cory} now={new Date('2026-09-17T12:00:00')} onChange={onChange} />)
    fireEvent.change(screen.getByDisplayValue('Konto 1'), { target: { value: 'Main' } })
    expect(onChange).toHaveBeenCalled()
    let current = cory
    for (let index = 0; index < 9; index += 1) { fireEvent.click(screen.getByRole('button', { name: 'Dodaj postać' })); current = onChange.mock.lastCall[0]; rerender(<CoryPanel cory={current} now={new Date('2026-09-17T12:00:00')} onChange={onChange} />) }
    expect(screen.queryByRole('button', { name: 'Dodaj postać' })).not.toBeInTheDocument()
  })

  it('progresses status and keeps tomorrow read-only', () => {
    const cory = createInitialCoryState()
    cory.accounts[0].characters = [{ id: 'char-1', name: 'Ninja' }]
    const onChange = vi.fn()
    const { rerender } = render(<CoryPanel cory={cory} now={new Date('2026-09-17T12:00:00')} onChange={onChange} />)
    fireEvent.click(screen.getAllByRole('button', { name: 'Puste' })[0])
    expect(onChange.mock.lastCall[0].statuses).toBeTruthy()
    const received = onChange.mock.lastCall[0]
    rerender(<CoryPanel cory={received} now={new Date('2026-09-17T12:00:00')} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Odebrane' }))
    expect(onChange.mock.lastCall[0].statuses).toBeTruthy()
    expect(screen.getAllByRole('button', { name: 'Puste' }).at(-1)).toBeDisabled()
  })

  it('adds a character when UUID API is unavailable on plain HTTP', () => {
    const cory = createInitialCoryState()
    vi.stubGlobal('crypto', {})
    render(<CoryPanel cory={cory} now={new Date('2026-09-17T12:00:00')} onChange={vi.fn()} />)
    expect(() => fireEvent.click(screen.getByRole('button', { name: 'Dodaj postać' }))).not.toThrow()
    vi.unstubAllGlobals()
  })

  it('shows all three game days in one character row', () => {
    const cory = createInitialCoryState()
    cory.accounts[0].characters = [{ id: 'char-1', name: 'Ninja' }]
    render(<CoryPanel cory={cory} now={new Date('2026-09-17T12:00:00')} onChange={vi.fn()} />)
    expect(screen.getByText('Wczoraj')).toBeInTheDocument()
    expect(screen.getByText('Dzisiaj')).toBeInTheDocument()
    expect(screen.getByText('Jutro')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Puste' })).toHaveLength(3)
    expect(screen.getAllByRole('button', { name: 'Puste' })[2]).toBeDisabled()
  })
})
