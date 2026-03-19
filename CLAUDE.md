# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (run from `frontend/`)

```bash
bun dev        # Start dev server
bun build      # Production build
bun lint       # ESLint
```

### Backend (run from `backend/`)

```bash
uvicorn main:app --reload   # Start FastAPI dev server
```

### Database (run from `frontend/`)

```bash
bun --bun run prisma migrate dev    # Run migrations (must use bun runner)
bun --bun run prisma generate       # Regenerate Prisma client
bun --bun run prisma studio         # Open Prisma Studio GUI
```

> **Important**: Always use `bun --bun run prisma` (not `bunx prisma`) — the `prisma.config.ts` file requires the bun runner to resolve `DATABASE_URL` from `.env`.

## Architecture

Two-service monorepo: a Next.js frontend and a FastAPI backend sharing a single Neon (serverless PostgreSQL) database.

### Frontend (`frontend/`) — Next.js 16, React 19, TypeScript

**App Router layout:**

- `src/app/(auth)/` — sign-in, sign-up pages (unauthenticated)
- `src/app/(dashboard)/` — route group with auth guard in `layout.tsx`; actual dashboard pages live at `src/app/(dashboard)/dashboard/` to produce `/dashboard/*` URLs
- `src/app/page.tsx` — landing page at root `/`

**tRPC v11** — `src/trpc/`

- `init.ts` — base context (empty `{}`), `baseProcedure`, and `protectedProcedure` (validates BetterAuth session via `auth.api.getSession`)
- `routers/_app.ts` — root router; combines `user`, `projects`, `integrations`, `syncEvents`, `reports`
- `client.tsx` — `useTRPC()` hook and `TRPCReactProvider` for client components
- `server.tsx` — server-side `trpc` proxy and `caller` for server components

**Auth** — BetterAuth v1.5

- Server config: `src/utils/auth.ts` (email/password + Google OAuth, Prisma adapter)
- Client: `src/utils/auth-client.ts` — use `authClient.useSession()` in client components, `auth.api.getSession({ headers: await headers() })` server-side
- API handler: `src/app/api/auth/[...all]/route.ts`

**Database** — Prisma 7 with Neon serverless adapter (`@prisma/adapter-pg`)

- Schema: `prisma/schema.prisma` — models: `User` (with `plan` field), `Project`, `Integration`, `SyncEvent`, `Report`, plus BetterAuth models (`Session`, `Account`, `Verification`)
- Client singleton: `src/utils/prisma.ts`
- Generated types: `src/generated/prisma/` (do not edit manually)
- A Drizzle schema stub exists at `src/database/schema.ts` — currently unused, left from initial setup

**UI** — shadcn/ui (style: `radix-maia`, base: `radix`) + Tailwind CSS v4

- Components in `src/components/ui/` — add new ones with `bunx --bun shadcn@latest add <component>`
- Icon library: `lucide-react`
- Follow rules in `frontend/.agents/skills/shadcn/` — key rules: use `gap-*` not `space-y-*`, use `size-*` for equal dimensions, use semantic color tokens, use `cn()` for conditional classes, full `Card` composition

**Dashboard layout:**

- `src/components/dashboard/side-bar.tsx` — shadcn `Sidebar` with `collapsible="icon"`, active route via `usePathname()`, user dropdown with sign-out
- `src/components/dashboard/header.tsx` — `SidebarTrigger` + `Breadcrumb` built from pathname

### Backend (`backend/`) — FastAPI, Python 3.13

- Currently a minimal stub (`main.py`); intended to handle all AI agent orchestration
- Will use Claude (`claude-sonnet-4-6`) via Anthropic SDK + MCP servers (GitHub, Notion, Slack, Linear)
- Frontend calls backend via plain HTTP fetch to `BACKEND_URL` (not tRPC)

### Data Flow

```
Browser → Next.js (tRPC) → Neon DB
Browser → Next.js (proxy) → FastAPI → Claude/MCP → external services
```

### Integration OAuth Flow

- Start: `GET /api/integrations/[provider]?projectId=...` → redirects to provider OAuth
- Callback: `GET /api/integrations/[provider]/callback?code=...&state=projectId` → stores token in `Integration` table
- Providers: `github`, `notion`, `slack`, `linear`
- Token exchange is currently a placeholder (`placeholder_${code}`) — implement per-provider when building Phase 6–9

## Key Design Decisions

- **tRPC is frontend-only**: tRPC wraps calls between Next.js server and client only; FastAPI is called via HTTP fetch
- **Prisma only for all models**: The Drizzle schema at `src/database/schema.ts` is an unused stub — use Prisma for all DB access
- **BetterAuth manages sessions**: Never manually create/destroy sessions; use `auth.api` server-side and `authClient` client-side
- **Route group vs URL segment**: `(dashboard)` is a route group (no URL impact); the actual `/dashboard` URL segment is the `dashboard/` subdirectory inside it
- **Package manager**: Frontend uses `bun`; never use npm/yarn/pnpm

## Environment Variables

**Frontend `.env`** (required):

```
DATABASE_URL=           # Neon PostgreSQL connection string
BETTER_AUTH_SECRET=     # Random secret for session signing
NEXT_PUBLIC_APP_URL=    # e.g. http://localhost:3000
GOOGLE_CLIENT_ID=       # OAuth (optional)
GOOGLE_CLIENT_SECRET=
BACKEND_URL=            # FastAPI URL, e.g. http://localhost:8000
```

**Integration OAuth** (add when building each integration):

```
GITHUB_CLIENT_ID=
NOTION_CLIENT_ID=
SLACK_CLIENT_ID=
LINEAR_CLIENT_ID=
```

**Backend `.env`**:

```
DATABASE_URL=
ANTHROPIC_API_KEY=
```
