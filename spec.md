# DevSync AI — Build Spec

> "The AI project manager that lives inside your tools"
> Stack: Next.js 16 · tRPC · Drizzle · Neon · BetterAuth · FastAPI · MCP · Stripe · GSAP

---

## Project Overview

DevSync AI is a SaaS that connects a freelancer's tools (GitHub, Notion, Slack, Linear) and uses an AI agent to autonomously sync state across them — updating tickets, posting progress updates, flagging blockers, and generating client-ready PDF reports. Zero manual status updates.

**Business model:** Per-freelancer subscription ($0 / $19 / $49 per month)
**Primary users:** Freelancers + their clients

---

## Monorepo Structure

```
dev-sync-ai/
├── frontend/          # Next.js app (dashboard + landing page)
├── backend/           # FastAPI app (MCP agent orchestration)
├── spec.md
└── project.txt
```

---

## Tech Stack

| Layer | Tech | Purpose |
|---|---|---|
| Frontend framework | Next.js 16 (App Router) | Dashboard, landing page |
| API layer | tRPC v11 | Type-safe frontend ↔ backend API |
| ORM | Drizzle ORM | DB schema + queries |
| Database | Neon (Postgres serverless) | All app data |
| Auth | BetterAuth | Auth + OAuth for tool connections |
| AI backend | FastAPI (Python 3.13) | MCP agent orchestration |
| AI model | Claude claude-sonnet-4-6 via Anthropic SDK | Agent reasoning |
| MCP servers | GitHub, Notion, Slack, Linear | Tool integrations |
| Payments | Stripe | Subscription billing |
| Animations | GSAP | Landing page |
| Styling | Tailwind CSS v4 | All styling |
| Package manager | Bun | Frontend deps |

---

## Build Phases

---

### Phase 1 — Project Foundation

**Goal:** Wire up the full data layer before any UI.

#### 1.1 Environment setup
- Create `frontend/.env.local` with:
  - `DATABASE_URL` (Neon connection string)
  - `BETTER_AUTH_SECRET`
  - `NEXT_PUBLIC_APP_URL`
- Create `backend/.env` with:
  - `DATABASE_URL`
  - `ANTHROPIC_API_KEY`

#### 1.2 Database schema (Drizzle + Neon)
Install: `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`

Create `frontend/src/db/schema.ts`:
```
tables:
- users (id, email, name, plan, createdAt)
- projects (id, userId, name, description, status, createdAt)
- integrations (id, userId, projectId, type, accessToken, refreshToken, metadata)
- syncEvents (id, projectId, type, payload, createdAt)
- reports (id, projectId, content, generatedAt)
- sessions (BetterAuth managed)
```

#### 1.3 tRPC setup
Install: `@trpc/server`, `@trpc/client`, `@trpc/next`, `@trpc/react-query`, `@tanstack/react-query`, `zod`

Files to create:
- `frontend/src/server/trpc.ts` — base tRPC init
- `frontend/src/server/routers/_app.ts` — root router
- `frontend/src/app/api/trpc/[trpc]/route.ts` — Next.js handler
- `frontend/src/trpc/client.ts` — client-side tRPC hooks

---

### Phase 2 — Authentication

**Goal:** Full auth flow with BetterAuth, including OAuth connection placeholders.

Install: `better-auth`, `better-auth/client`

#### 2.1 BetterAuth config
Create `frontend/src/lib/auth.ts`:
- Email/password + Google OAuth for user login
- Social providers: GitHub (for tool connection, not just login)
- Session management with Neon adapter

#### 2.2 Auth routes
- `frontend/src/app/api/auth/[...all]/route.ts` — BetterAuth handler
- `frontend/src/app/(auth)/login/page.tsx`
- `frontend/src/app/(auth)/signup/page.tsx`
- `frontend/src/middleware.ts` — protect `/dashboard` routes

#### 2.3 Tool OAuth connections (placeholders)
Each integration will use OAuth. Store tokens in `integrations` table.
Providers to configure (add keys as we build each):
- GitHub App (read commits, repos)
- Notion OAuth (read/write pages)
- Slack OAuth (post messages)
- Linear OAuth (read/write issues)

---

### Phase 3 — Dashboard

**Goal:** Authenticated app shell with project management.

#### 3.1 Layout
- `frontend/src/app/(dashboard)/layout.tsx` — sidebar + header
- Sidebar items: Projects, Reports, Integrations, Settings, Billing

#### 3.2 Projects
- `frontend/src/app/(dashboard)/projects/page.tsx` — project list
- `frontend/src/app/(dashboard)/projects/new/page.tsx` — create project
- `frontend/src/app/(dashboard)/projects/[id]/page.tsx` — project detail
  - Connected tools status
  - Recent sync events feed
  - Generated reports list

#### 3.3 Integrations page
- `frontend/src/app/(dashboard)/integrations/page.tsx`
- Connect/disconnect: GitHub, Notion, Slack, Linear
- OAuth flow: button → OAuth redirect → callback → store token
- Show connection status (connected / error / syncing)

#### 3.4 tRPC routers to build
- `projects` router: create, list, get, update, delete
- `integrations` router: connect, disconnect, getStatus
- `syncEvents` router: list by project
- `reports` router: list, get

---

### Phase 4 — Landing Page

**Goal:** Stunning GSAP-animated marketing page that converts.

Install: `gsap` (frontend)

#### 4.1 Sections (in order)
1. **Hero** — animated headline, sub-headline, CTA buttons, mock UI preview
2. **Problem** — "The friction every freelancer faces" (3 pain points)
3. **How it works** — animated 7-step flow (matches project.txt diagram)
4. **Why not ChatGPT** — the MCP moat explanation
5. **Features** — grid of key capabilities
6. **Pricing** — Free / Pro $19 / Agency $49 cards
7. **CTA** — final conversion section
8. **Footer**

#### 4.2 GSAP animations
- Hero: text reveal with stagger, floating UI mockup
- How it works: scroll-triggered step-by-step animation (ScrollTrigger)
- Features grid: scroll-triggered fade-in
- Pricing: hover effects on cards

#### 4.3 Files
- `frontend/src/app/(marketing)/page.tsx` — landing page
- `frontend/src/app/(marketing)/layout.tsx` — marketing layout (navbar + footer)
- `frontend/src/components/landing/Hero.tsx`
- `frontend/src/components/landing/HowItWorks.tsx`
- `frontend/src/components/landing/Pricing.tsx`
- etc.

---

### Phase 5 — FastAPI Backend

**Goal:** Python backend ready to orchestrate MCP agents.

#### 5.1 FastAPI setup
Install (pyproject.toml):
- `fastapi`, `uvicorn`
- `anthropic` (Claude SDK)
- `mcp` (MCP Python SDK)
- `httpx`, `pydantic`, `python-dotenv`
- `psycopg2-binary` or `asyncpg` (DB access)

#### 5.2 Structure
```
backend/
├── main.py               # FastAPI app entry
├── routers/
│   ├── sync.py           # POST /sync/trigger
│   ├── reports.py        # POST /reports/generate
│   └── webhooks.py       # POST /webhooks/github
├── agents/
│   ├── orchestrator.py   # Main Claude agent loop
│   └── tools.py          # MCP tool definitions
├── integrations/
│   ├── github.py         # GitHub MCP client
│   ├── notion.py         # Notion MCP client
│   ├── slack.py          # Slack MCP client
│   └── linear.py         # Linear MCP client
└── db.py                 # DB connection + queries
```

#### 5.3 API endpoints
- `POST /sync/trigger` — trigger a sync for a project (called by frontend or webhook)
- `POST /reports/generate` — generate weekly PDF report
- `POST /webhooks/github` — GitHub push webhook handler
- `GET /health` — health check

#### 5.4 Frontend ↔ Backend communication
- Frontend calls FastAPI via internal HTTP (not tRPC)
- Add `BACKEND_URL` to frontend env
- Create `frontend/src/lib/backend.ts` — typed fetch wrapper

---

### Phase 6 — GitHub Integration

**Goal:** Read commits and diffs when code is pushed.

#### 6.1 GitHub App setup
- Create GitHub App (not OAuth App) for webhook support
- Permissions: repo contents (read), webhooks
- Store installation token in `integrations` table

#### 6.2 Webhook handler (`backend/routers/webhooks.py`)
On `push` event:
1. Verify webhook signature
2. Extract commits + diffs
3. Trigger orchestrator for the matching project

#### 6.3 MCP tools for GitHub
In `backend/integrations/github.py`:
- `get_commits(repo, since)` — list recent commits
- `get_diff(repo, sha)` — get commit diff
- `get_pr_status(repo)` — open PRs

---

### Phase 7 — Notion Integration

**Goal:** Read ticket requirements, update ticket status.

#### 7.1 Notion OAuth
- Create Notion integration in Notion developer portal
- OAuth flow → store access token
- User selects which database to sync

#### 7.2 MCP tools for Notion (`backend/integrations/notion.py`)
- `get_database_items(database_id)` — get all tickets
- `update_page_status(page_id, status)` — update ticket status
- `get_page_content(page_id)` — read ticket requirements
- `add_comment(page_id, text)` — post progress comment

---

### Phase 8 — Slack Integration

**Goal:** Post human-readable updates to a project channel.

#### 8.1 Slack OAuth
- Create Slack app with `chat:write`, `channels:read` scopes
- OAuth flow → store bot token

#### 8.2 MCP tools for Slack (`backend/integrations/slack.py`)
- `post_message(channel, text)` — post update
- `list_channels()` — for user to select target channel

---

### Phase 9 — Linear Integration

**Goal:** Read and update Linear issues.

#### 9.1 Linear OAuth
- Linear OAuth app → `issues:read`, `issues:write` scopes

#### 9.2 MCP tools for Linear (`backend/integrations/linear.py`)
- `get_issues(team_id)` — list issues
- `update_issue_status(issue_id, status)` — update status
- `add_comment(issue_id, text)` — post comment

---

### Phase 10 — AI Orchestrator

**Goal:** The core Claude agent that ties everything together.

#### 10.1 Orchestrator logic (`backend/agents/orchestrator.py`)

```python
Input: project_id, trigger_event (push/scheduled/manual)

Steps:
1. Load project context (requirements from Notion/Linear)
2. Load recent commits from GitHub (since last sync)
3. For each commit:
   a. Read diff
   b. Cross-reference against open tickets
   c. Determine which tickets are addressed
4. Update ticket statuses in Notion/Linear
5. Post human-readable summary to Slack
6. Flag any commits that don't map to tickets (scope creep)
7. Flag any tickets with no recent progress (blockers)
8. Save sync event to DB
```

#### 10.2 Claude agent prompt design
- System prompt: "You are a project sync agent. Given commits and ticket requirements, determine what was done, update statuses, and write a clear update."
- Use tool_use to call MCP tools
- Output: structured JSON (updates made, blockers flagged, summary text)

#### 10.3 Weekly report generation (`backend/routers/reports.py`)
- Pull all sync events for the past 7 days
- Ask Claude to summarize into client-ready report
- Format: Markdown → convert to PDF (use `weasyprint` or `reportlab`)
- Store in `reports` table, make available in dashboard

---

### Phase 11 — Stripe Billing

**Goal:** Subscription management with plan enforcement.

#### 11.1 Stripe setup
Install: `stripe` (frontend + backend)

Plans:
- Free: 1 project, basic syncing
- Pro ($19/mo): unlimited projects, PDF reports
- Agency ($49/mo): team members, client portal

#### 11.2 Frontend
- `frontend/src/app/(dashboard)/billing/page.tsx` — current plan + upgrade CTA
- `frontend/src/app/api/stripe/webhook/route.ts` — Stripe webhook handler
- tRPC `billing` router: `getSubscription`, `createCheckoutSession`, `createPortalSession`

#### 11.3 Plan enforcement
- Check `users.plan` before allowing certain actions
- Middleware in tRPC context to enforce limits

---

### Phase 12 — Polish + Deploy

#### 12.1 Frontend deploy
- Vercel (connect GitHub repo, set env vars)

#### 12.2 Backend deploy
- Railway or Render (FastAPI, set env vars)
- Add `BACKEND_URL` to Vercel env

#### 12.3 Final checklist
- [ ] Error boundaries in dashboard
- [ ] Loading states on all async operations
- [ ] Mobile responsive landing page
- [ ] SEO meta tags on landing page
- [ ] Rate limiting on API routes
- [ ] Webhook signature verification (GitHub, Stripe)
- [ ] Proper error handling in orchestrator

---

## Build Order Summary

| # | Phase | Deliverable |
|---|---|---|
| 1 | Foundation | DB schema, tRPC, env setup |
| 2 | Auth | Login/signup, session management |
| 3 | Dashboard | Projects, integrations UI, sync event feed |
| 4 | Landing page | GSAP marketing page |
| 5 | FastAPI backend | Agent infrastructure, API endpoints |
| 6 | GitHub | Webhooks + commit reading |
| 7 | Notion | Ticket reading + status updates |
| 8 | Slack | Progress post messages |
| 9 | Linear | Issue sync |
| 10 | AI orchestrator | Claude agent tying it all together |
| 11 | Stripe | Subscription billing |
| 12 | Polish + deploy | Production ready |
