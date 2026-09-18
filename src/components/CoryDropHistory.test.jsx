import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CoryDropHistory from './CoryDropHistory'

describe('CoryDropHistory', () => {
  it('saves a complete drop summary', () => {
    const onAdd = vi.fn()
    render(<CoryDropHistory history={[]} now={new Date('2026-09-17T12:00:00')} onAdd={onAdd} />)
    fireEvent.change(screen.getByLabelText('Cory'), { target: { value: '10' } })
    ;['Rubiny', 'Granaty', 'Onyksy', 'Szafiry', 'Jadeity', 'Diamenty'].forEach((label) => fireEvent.change(screen.getByLabelText(label), { target: { value: '1' } }))
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz podsumowanie' }))
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ cory: 10, startDate: '2026-09-17', endDate: '2026-09-17' }))
  })

  it('rejects negative values', () => {
    const onAdd = vi.fn()
    render(<CoryDropHistory history={[]} now={new Date('2026-09-17T12:00:00')} onAdd={onAdd} />)
    fireEvent.change(screen.getByLabelText('Rubiny'), { target: { value: '-1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz podsumowanie' }))
    expect(onAdd).not.toHaveBeenCalled()
  })
})
