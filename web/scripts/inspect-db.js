// Quick DB inspection script using the generated Prisma client
// Run: node scripts/inspect-db.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    const noteCount = await prisma.note.count()
    const notes = await prisma.note.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    })

    const tables = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;`

    console.log(JSON.stringify({ tables, noteCount, recentNotes: notes }, null, 2))
  } catch (e) {
    console.error('Error inspecting DB:', e)
    process.exitCode = 2
  } finally {
    await prisma.$disconnect()
  }
}

main()
