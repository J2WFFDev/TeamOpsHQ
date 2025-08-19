import { prisma } from '@/lib/prisma'
import ClientCreateEventForm from './ClientCreateEventForm'

export const dynamic = 'force-dynamic'

async function getData() {
  const teams = await prisma.team.findMany({ orderBy: { name: 'asc' } })
  const events = await prisma.event.findMany({
    include: { team: true },
    orderBy: [{ startsAt: 'asc' }]
  })
  return { teams, events }
}

export default async function EventsPage() {
  const { teams, events } = await getData()
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Events</h1>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-3">Create Event</h2>
        <ClientCreateEventForm teams={teams} />
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-3">Upcoming</h2>
        <ul className="divide-y">
          {events.map(ev => (
            <li key={ev.id} className="py-2">
              <div className="font-medium">{ev.title}</div>
              <div className="text-sm text-gray-600">
                Team: {ev.team.name} • {new Date(ev.startsAt).toLocaleString()} – {new Date(ev.endsAt).toLocaleString()} {ev.location ? `• ${ev.location}` : ''}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
