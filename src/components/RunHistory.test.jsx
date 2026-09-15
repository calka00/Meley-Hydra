import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import RunHistory from './RunHistory'

describe('RunHistory', () => {
  const run = { id: 'one', createdAt: '2026-08-31T10:00:00.000Z', chests: 4 }

  it('edits and deletes a run', () => {
    const onUpdate = vi.fn()
    const onDelete = vi.fn()
    render(<RunHistory runs={[run]} onUpdate={onUpdate} onDelete={onDelete} />)
    fireEvent.click(screen.getByRole('button', { name: 'Edytuj run' }))
    const input = screen.getByDisplayValue('4')
    fireEvent.change(input, { target: { value: '7' } })
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz zmianę' }))
    expect(onUpdate).toHaveBeenCalledWith('one', 7)
    fireEvent.click(screen.getByRole('button', { name: 'Usuń run' }))
    expect(onDelete).toHaveBeenCalledWith('one')
  })

  it('shows five runs per page', () => {
    const runs = Array.from({ length: 6 }, (_, index) => ({ id: String(index + 1), createdAt: `2026-08-31T10:0${index}:00.000Z`, chests: index + 1 }))
    render(<RunHistory runs={runs} onUpdate={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getAllByRole('button', { name: 'Edytuj run' })).toHaveLength(5)
    fireEvent.click(screen.getByRole('button', { name: 'Następna' }))
    expect(screen.getByText('1 skrzyń')).toBeInTheDocument()
  })
})
