import '@testing-library/jest-dom'

// Mock next/cache revalidatePath used in server actions
// vitest global 'vi' will be available at test runtime
vi.mock('next/cache', () => ({
	revalidatePath: () => {},
}))

// Provide a lightweight mock for '@/lib/prisma' used in server actions during tests
vi.mock('@/lib/prisma', async () => {
	return {
		prisma: {
			team: { findMany: async () => [], create: async () => ({}) },
			event: { findMany: async () => [], create: async () => ({}) },
			program: { findMany: async () => [] },
		},
	}
})
