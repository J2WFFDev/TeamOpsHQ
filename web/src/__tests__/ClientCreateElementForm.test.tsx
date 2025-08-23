import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

import ClientCreateElementForm from '../app/elements/ClientCreateElementForm'

describe('ClientCreateElementForm', () => {
  let fetchMock: any

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ element: { id: 123, type: 'note', title: 'Server Title', detailsJson: { $type: 'note', $v: 1 } } }) })
    // @ts-ignore
    global.fetch = fetchMock
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('emits provisional created then replaced when server responds', async () => {
    const onCreated = vi.fn()
    render(<ClientCreateElementForm onCreated={onCreated} />)

    const title = screen.getByPlaceholderText(/Title/i)
    const textarea = screen.getByPlaceholderText(/Write something/i)
    const submit = screen.getByRole('button', { name: /create/i })

    await userEvent.type(title, 'My note')
    await userEvent.type(textarea, 'Hello world')
    await userEvent.click(submit)

    // provisional should be emitted synchronously before fetch resolves
    expect(onCreated).toHaveBeenCalled()
    const first = onCreated.mock.calls[0]
    expect(first[1]).toBe('created')

    // wait for server replacement
    await waitFor(() => expect(onCreated.mock.calls.length).toBeGreaterThan(1))
    const second = onCreated.mock.calls[1]
    expect(second[1]).toBe('replaced')
    expect(fetchMock).toHaveBeenCalled()
  })
})
