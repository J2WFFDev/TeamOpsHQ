import React from 'react'
import { render, screen } from '@testing-library/react'
import ClientCreateEventForm from './ClientCreateEventForm'

describe('ClientCreateEventForm', () => {
  it('renders fields', () => {
    render(<ClientCreateEventForm teams={[{ id: 't1', name: 'Team' }]} />)
    // select is labelled by the visible label text "Team"
    expect(screen.getByLabelText(/Team/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Practice/i)).toBeInTheDocument()
  })
})
