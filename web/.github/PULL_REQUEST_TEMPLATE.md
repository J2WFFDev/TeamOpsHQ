## Summary

Short description of the changes in this PR.

## What I changed

- Add CI workflow (GitHub Actions) to run build, lint, and tests
- Add Vitest configuration and a base test for `ClientCreateTeamForm`
- Migrate client form components to React 19 `React.useActionState`

## Why

Ensure CI coverage and basic tests on PRs and keep the codebase buildable.

## How to test

- Run locally:

```bash
pnpm install
pnpm run ci:test
```

## Notes

- Authentication was temporarily removed for initial build stability. Follow-up PRs should reintroduce auth per the PRD.
