import { prisma } from './prisma'

// Return the prisma client but typed as `any` to avoid transient TypeScript mismatches
// during the migration. Replace direct `prisma as any` with this helper.
export function getPrisma(): any {
  return prisma as any
}
