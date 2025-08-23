const { PrismaClient } = require('@prisma/client')

async function main() {
  const prisma = new PrismaClient()
  try {
    const types = await prisma.element.groupBy({
      by: ['type'],
      _count: { type: true }
    })
    console.log('Element types in database:')
    types.forEach(t => console.log(`  ${t.type}: ${t._count.type} items`))
    
    const total = await prisma.element.count()
    console.log(`Total elements: ${total}`)
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await prisma.$disconnect()
  }
}

main()