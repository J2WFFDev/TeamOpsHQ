import { createTeam } from '@/app/teams/actions'
import { createEvent } from '@/app/events/actions'

describe('server actions', () => {
  it('createTeam returns ok when input is valid', async () => {
    const form = new FormData()
    form.append('programId', 'p1')
    form.append('name', 'My Team')
  const res = await createTeam(undefined, form)
    expect(res).toEqual({ ok: true })
  })

  it('createEvent returns ok when input is valid', async () => {
    const form = new FormData()
    form.append('teamId', 't1')
    form.append('title', 'Practice')
    form.append('startsAt', new Date().toISOString())
    form.append('endsAt', new Date(Date.now() + 3600_000).toISOString())
    form.append('location', 'Range')
  const res = await createEvent(undefined, form)
    expect(res).toEqual({ ok: true })
  })
})
