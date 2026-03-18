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
bunx prisma migrate dev     # Run migrations
bunx prisma generate        # Regenerate Prisma client
bunx prisma studio          # Open Prisma Studio GUI
```

## Architecture

Two-service monorepo: a Next.js frontend and a FastAPI backend sharing a single Neon (serverless PostgreSQL) database.

### Frontend (`frontend/`) — Next.js 16, React 19, TypeScript
- **App Router** layout: `src/app/` contains route segments (`(auth)`, `(dashboard)`, landing page at root)
- **API layer**: tRPC v11 with React Query — routers live in `src/trpc/`, client setup in `src/trpc/react.tsx`
- **Auth**: BetterAuth v1.5 with Prisma adapter — config in `src/utils/auth.ts`, client in `src/utils/auth-client.ts`
- **Database**: Prisma 7 (primary ORM) + Drizzle schema coexisting during transition — Prisma schema at `prisma/schema.prisma`, Drizzle schema at `src/database/`
- **UI**: shadcn/ui (Radix UI) + Tailwind CSS v4 — component config in `components.json`
- **Validation**: Zod 4 schemas in `src/schema/`

### Backend (`backend/`) — FastAPI, Python 3.13
- Currently minimal (`main.py` only); intended to handle all AI agent orchestration
- Will integrate Claude (claude-sonnet-4-6) via MCP servers for GitHub, Notion, Slack, Linear
- Frontend communicates with backend via plain HTTP fetch (not tRPC)

### Data Flow
```
Browser → Next.js (tRPC) → Neon DB
Browser → Next.js (proxy) → FastAPI → Claude/MCP → external services
```

## Key Design Decisions

- **tRPC is frontend-only**: tRPC only wraps calls between the Next.js server and client; backend (FastAPI) is called via HTTP fetch
- **Two ORMs**: Prisma handles auth models (`User`, `Session`, `Account`, `Verification`); Drizzle is used for app-specific tables — keep them separate
- **BetterAuth manages sessions**: Do not manually create/destroy sessions; use `auth.api` server-side and `authClient` client-side
- **Package manager**: frontend uses `bun`, not npm/yarn/pnpm

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

**Backend `.env`** (required when implemented):
```
DATABASE_URL=
ANTHROPIC_API_KEY=
```
