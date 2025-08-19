import 'vitest'

declare global {
  // allow using `vi` in test setup files without TypeScript errors
  const vi: typeof import('vitest').vi
}
