# TeamOpsHQ — web

This is the `web/` Next.js app for TeamOpsHQ. The README below focuses on developer setup, running the app, database notes (Prisma + SQLite dev DB), test commands, and troubleshooting — tuned for the current branch and migration work.

## Quick start (development)

Prerequisites:
- Node.js (LTS), pnpm installed globally (recommended)
- Git

Install dependencies and start the dev server:

```pwsh
Set-Location 'C:\sandbox\teamopshq\web'
pnpm install
pnpm dev
```

Open http://localhost:3000 in your browser.

Notes:
- Start the dev server from the `web` folder (important). Starting from the repository root can cause lockfile detection warnings.
- The app uses Next.js (app dir) and Turbopack by default in local dev.

## Useful commands

From `web/`:

```pwsh
# start dev server (foreground)
pnpm dev

# run tests (interactive watch mode)
pnpm test

# run tests in single-run mode (recommended for CI / deterministic output)
pnpm test -- --run
# or (after you add the script below)
pnpm run test:ci

# open Prisma Studio to inspect SQLite dev DB
pnpm exec prisma studio --schema=prisma/schema.prisma

# regenerate Prisma client after schema changes
pnpm exec prisma generate --schema=prisma/schema.prisma
```

Suggested package.json scripts to add (optional but helpful):

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "test": "vitest",
  "test:ci": "vitest run"
}
```

## Database / Prisma

- Development uses an SQLite file at `prisma/dev.db` (see `prisma/schema.prisma`).
- After you change the Prisma schema run:

```pwsh
pnpm exec prisma migrate dev --name your_change_here --schema=prisma/schema.prisma
pnpm exec prisma generate --schema=prisma/schema.prisma
```

- To inspect data quickly use Prisma Studio:

```pwsh
pnpm exec prisma studio --schema=prisma/schema.prisma
```

- Backup the dev DB before destructive changes:

```pwsh
Set-Location 'C:\sandbox\teamopshq\web\prisma'
Copy-Item dev.db dev.db.bak -Force
```

There is a `scripts/inspect-db.js` and `prisma/seed.ts` in the repo you can use as references for seeding and inspecting the DB.

## Migration notes (Element v2)

- This branch migrates the old `note` model to a generic `Element` + `CalendarEvent` models and updates client Dexie stores (`elements`, `attachments`).
- During the migration we used a small shim helper `getPrisma()` that currently returns the Prisma client as `any` to avoid scattering `as any` casts during the migration. Plan a cleanup pass to remove this shim once the schema is stable.

## Client-side storage (Dexie / IndexedDB)

- The client uses Dexie for offline storage with stores like `elements`, `attachments`, and a `pendingActions` queue.
- To inspect IndexedDB in the browser: DevTools → Application → IndexedDB → look for `elements` / `attachments` / `pendingActions`.

## Testing

- Unit tests use Vitest. There are Playwright e2e specs in `tests/e2e/` which must be run separately with Playwright — do not let Vitest import Playwright tests.

Tips:
- Run unit tests deterministically:

```pwsh
pnpm test -- --run
```

- If Vitest is accidentally discovering Playwright e2e tests, update `vitest.config.ts` to exclude them:

```ts
// add to your vitest config
export default defineConfig({
  test: {
    exclude: ['**/tests/e2e/**', '**/playwright/**', '**/*.e2e.*']
  }
})
```

- Playwright e2e: run separately (from `web/`):

```pwsh
pnpm exec playwright test
```

## Offline / optimistic behaviour

- The UI implements optimistic creation for elements: provisional items are created client-side (with a `localId` and `pending` flag) and replaced when the server responds.
- The client persists pending items to IndexedDB so they survive reloads and can be retried.

Testing these flows:
- Use browser DevTools → Network → Offline to simulate offline and then reconnect to observe sync.
- Use Prisma Studio simultaneously to confirm server-side records created after sync.

## Troubleshooting

- Vitest imports Playwright tests and throws errors:
  - Ensure `vitest.config.ts` excludes e2e/playwright files (see Testing above).

- Multiple lockfiles warning from pnpm when starting dev server:
  - You may see: "Found multiple lockfiles. Selecting C:\\sandbox\\pnpm-lock.yaml". Fix by removing or consolidating the extra `pnpm-lock.yaml`. Start the dev server in the `web/` folder to avoid ambiguous lockfile selection.

- Dev server not responding / port 3000 issues:
  - Make sure nothing else uses port 3000. If `pnpm dev` exits silently, run it in foreground so you can read stdout/stderr.

- Type errors suppressed by `getPrisma()` shim:
  - The repo currently uses a small shim to avoid typing churn during the schema migration. If you want stricter typing, regenerate Prisma client and replace `getPrisma()` usages with typed imports and run `pnpm -s tsc --noEmit`.

## Adding a feature — recommended workflow

1. Create a feature branch from `feature/ddl-20250820` (or main if you have rebased):

```pwsh
git checkout -b feature/your-feature-name
```

2. Implement changes, run dev server, and add unit tests with Vitest.

3. Run unit tests locally (single-run) and verify UI flows. Use Prisma Studio to inspect DB state.

4. Create a PR with a short description, mention the migration context (Element v2), and include screenshots or Prisma Studio snapshots for data-impacting changes.

## CI / recommended scripts

- Add a CI job to run:
  - pnpm install
  - pnpm exec prisma generate --schema=prisma/schema.prisma
  - pnpm -s tsc --noEmit
  - pnpm test -- --run

## Helpful commands summary

```pwsh
Set-Location 'C:\sandbox\teamopshq\web'
pnpm install
pnpm dev
pnpm test -- --run
pnpm exec prisma studio --schema=prisma/schema.prisma
pnpm exec prisma generate --schema=prisma/schema.prisma
```

## Contact / Maintainers

If you need context about the Element v2 migration, or why the `getPrisma()` shim exists, see the PR on the feature branch `feature/ddl-20250820` or reach out to the author (Jim West) listed in the repo history.
