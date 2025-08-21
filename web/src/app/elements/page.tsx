import ElementsClient from './ElementsClient'
import ElementsFilter from './ElementsFilter'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getData(type?: string) {
  const where = type && type.length ? { type: type.toLowerCase() as any } : undefined
  const elements = await prisma.element.findMany({ where, orderBy: { createdAt: 'desc' } })
  return { elements }
}

export default async function ElementsPage({ searchParams }: { searchParams?: any }) {
  const sp = await searchParams
  const type = Array.isArray(sp?.type) ? sp.type[0] : sp?.type
  const { elements } = await getData(type)
  return (
    // Render a client component that holds the live state; pass initial elements as prop
    <ElementsClient initialElements={elements} />
  )
}
