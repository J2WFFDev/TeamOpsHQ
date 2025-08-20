import { prisma } from '@/lib/prisma'
import type { Team, Program } from '@prisma/client'
import ClientCreateTeamForm from './ClientCreateTeamForm'

export const dynamic = 'force-dynamic'

async function getData(): Promise<{ programs: Program[]; teams: (Team & { program: Program | null })[] }> {
  const programs = await prisma.program.findMany({ orderBy: { name: 'asc' } })
  const teams = await prisma.team.findMany({
    include: { program: true },
    orderBy: [{ program: { name: 'asc' } }, { name: 'asc' }],
  })
  return { programs, teams }
}

export default async function TeamsPage() {
  const { programs, teams } = await getData()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Teams</h1>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-3">Create Team</h2>
        <ClientCreateTeamForm programs={programs} />
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-3">All Teams</h2>
        <ul className="divide-y">
          {teams.map((t: Team & { program: Program | null }) => (
            <li key={t.id} className="py-2 flex items-center justify-between">
              <span>{t.program?.name ?? 'No Program'} — <b>{t.name}</b></span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}