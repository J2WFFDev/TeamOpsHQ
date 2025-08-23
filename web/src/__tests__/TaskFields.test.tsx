import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TaskFields from '../app/elements/fields/TaskFields'

describe('TaskFields', () => {
  it('renders status/priority/due inputs', () => {
    render(<TaskFields status="open" priority="medium" dueDate="" setStatus={()=>{}} setPriority={()=>{}} setDueDate={()=>{}} />)
    expect(screen.getByLabelText(/Task status/i)).toBeTruthy()
    expect(screen.getByLabelText(/Task priority/i)).toBeTruthy()
    expect(screen.getByLabelText(/Task due/i)).toBeTruthy()
  })
})
