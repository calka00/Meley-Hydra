import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import SettingsPanel from './SettingsPanel'

describe('SettingsPanel', () => {
  it('requires confirmation before clearing data', () => {
    const onReset = vi.fn()
    render(<SettingsPanel state={{}} onImport={vi.fn()} onReset={onReset} />)
    fireEvent.click(screen.getByRole('button', { name: 'Wyczyść dane' }))
    expect(onReset).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Potwierdź wyczyszczenie' }))
    expect(onReset).toHaveBeenCalled()
  })
})
