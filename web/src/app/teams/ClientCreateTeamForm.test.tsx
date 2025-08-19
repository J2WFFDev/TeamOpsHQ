import React from 'react'
import { render, screen } from '@testing-library/react'
import ClientCreateTeamForm from './ClientCreateTeamForm'

describe('ClientCreateTeamForm', () => {
  it('renders fields', () => {
    render(<ClientCreateTeamForm programs={[{ id: 'p1', name: 'Prog' }]} />)
    expect(screen.getByText(/Program/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Rifle C/i)).toBeInTheDocument()
  })
})
