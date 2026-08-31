import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ChestValuePanel from './ChestValuePanel'

describe('ChestValuePanel', () => {
  it('shows price, value, and threshold alert', () => {
    render(<ChestValuePanel priceKk="37,5" unsold={43} value={1612500000} onPriceChange={vi.fn()} onSell={vi.fn()} />)
    expect(screen.getByText('37,5kk')).toBeInTheDocument()
    expect(screen.getByText('43 szt.')).toBeInTheDocument()
    expect(screen.getByText(/40\+ skrzyń/i)).toBeInTheDocument()
  })

  it('passes manual price changes and sell action to parent', () => {
    const onPriceChange = vi.fn(); const onSell = vi.fn()
    render(<ChestValuePanel priceKk="" unsold={2} value={0} onPriceChange={onPriceChange} onSell={onSell} />)
    fireEvent.change(screen.getByLabelText('Cena skrzyni'), { target: { value: '37,5' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sprzedane / wyzeruj' }))
    expect(onPriceChange).toHaveBeenCalledWith('37,5')
    expect(onSell).toHaveBeenCalled()
  })
})
