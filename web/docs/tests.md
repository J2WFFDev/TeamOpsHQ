# Test cases and notes

This document tracks test cases added to the repository and notes about test coverage.

## Current tests

1. `ClientCreateTeamForm.test.tsx`
   - Renders the create-team client form and asserts:
     - Label "Program" exists
     - Input placeholder "Rifle C" exists
   - Uses mocks for `@/lib/prisma` and `next/cache` in `vitest.setup.ts`.

## Suggested next tests

- `ClientCreateEventForm` rendering and basic interaction (submit mocked)
- Server action unit tests (`createTeam`, `createEvent`) with mocked `prisma` returning expected results and errors
- Integration / E2E (Playwright) tests for sign-in workflow and creating teams/events

## Local test commands

```powershell
pnpm run test
pnpm run test:coverage
```

## Notes

- Tests currently run with Vitest and `jsdom` environment. Server action tests should be isolated and mock Prisma.
- If you add a PRD PDF, place it under `docs/prd/` and reference it here with a short summary.
