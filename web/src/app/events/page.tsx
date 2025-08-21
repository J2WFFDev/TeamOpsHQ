import { prisma } from '@/lib/prisma'
import type { Team, CalendarEvent } from '@prisma/client'
import ClientCreateEventForm from './ClientCreateEventForm'
import QuickNote from '@/components/QuickNote'

export const dynamic = 'force-dynamic'

async function getData(): Promise<{ teams: Team[]; events: (CalendarEvent & { element: any })[] }> {
  const teams = await prisma.team.findMany({ orderBy: { name: 'asc' } })
  const events = await prisma.calendarEvent.findMany({
    include: { element: true },
    orderBy: [{ startAt: 'asc' }]
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

  <QuickNote />

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-3">Upcoming</h2>
        <ul className="divide-y">
          {events.map((ev: CalendarEvent & { element: any }) => (
            <li key={ev.id} className="py-2">
              <div className="font-medium">{ev.element?.title ?? 'Untitled'}</div>
              <div className="text-sm text-gray-600">
                {new Date(ev.startAt).toLocaleString()} – {new Date(ev.endAt).toLocaleString()} {ev.locationName ? `• ${ev.locationName}` : ''}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
