# AGENTS.md

This is a Next.js 15 App Router project. Follow current Next.js App Router docs rather than Pages Router patterns.

## Cursor Cloud specific instructions

- Install with `pnpm install` from the repository root. There is a `pnpm-lock.yaml`.
- Development server: `pnpm dev` (Next.js on port 3000).
- Lint / tests / types: `pnpm lint`, `pnpm test`, `pnpm typecheck`.
- Keep `TAVUS_API_KEY` server-only (`.env.local` or Vercel env). Never prefix it with `NEXT_PUBLIC_`.
- Live CVI uses Daily (`@daily-co/daily-react`) via the official Tavus CVI UI copied from `tavus-examples/examples/cvi-ui-haircheck-conversation`. Those components are client-only.
- For automated conversation checks, send `test_mode: true` to `POST /api/conversations`. Tavus then returns `status: "ended"` without joining a billed live PAL.
- The Vercel project Root Directory must be the repository root (where `package.json` lives). The previous empty-repo deploy failed because `next` was not a dependency yet.
