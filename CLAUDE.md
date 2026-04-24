# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Owner-only analytics dashboard for **Higher Image Hair Studio** (Chicago, IL). The AI receptionist (Retell AI + n8n) POSTs booking data to this dashboard after every call. The dashboard displays revenue, appointments, after-hours captures, and call counts — filterable by This Week / This Month / All Time.

## Commands

All commands run from the `dashboard/` subdirectory:

```bash
npm run dev      # local dev server at localhost:3000
npm run build    # production build (type-checks + compiles)
npm run lint     # ESLint
```

## Architecture

### Data flow
1. Customer calls → Retell AI handles → n8n workflow runs
2. n8n POSTs to `/api/webhook` with booking payload (secured by `x-webhook-secret` header)
3. Webhook stores row in Supabase `bookings` table
4. Owner opens dashboard → `/api/metrics?range=week|month|all` aggregates rows → 4 metric cards update

### Auth
Single-owner password gate via NextAuth credentials provider (`lib/` → `app/api/auth/[...nextauth]/authOptions.ts`). Password stored in `OWNER_PASSWORD` env var. `middleware.ts` protects all `/dashboard/*` routes — unauthenticated requests redirect to `/login`.

### Key files
- `app/api/webhook/route.ts` — n8n writes booking data here; validates `x-webhook-secret` header
- `app/api/metrics/route.ts` — aggregates revenue/appointments/after-hours from Supabase; requires session
- `lib/bookings.ts` — Supabase query with date range filtering
- `lib/dateUtils.ts` — `getDateRange(range)` returns `{ start, end }` for week/month/all
- `lib/supabase.ts` — single Supabase client instance (service role key, bypasses RLS)
- `components/MetricCard.tsx` — reusable stat card (icon, label, value, sublabel)
- `components/DateFilter.tsx` — pill toggle; controls all 4 cards simultaneously

### Supabase table: `bookings`
| column | type | notes |
|---|---|---|
| `booking_date` | timestamptz | appointment start time from Acuity |
| `customer_name` | text | |
| `customer_phone` | text | |
| `service` | text | service name from Acuity |
| `barber` | text | barber name |
| `price` | numeric | pulled from Acuity booking response |
| `after_hours` | boolean | computed in n8n Code node using America/Chicago timezone |

### Unused files
`lib/sheets.ts` and `lib/square.ts` are unused leftovers — Google Sheets and Square were replaced by Supabase + n8n price tracking.

## Environment variables

```
OWNER_PASSWORD           # dashboard login password
NEXTAUTH_SECRET          # random string for JWT signing
NEXTAUTH_URL             # full deployment URL (no trailing slash)
SUPABASE_URL             # https://<ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY
WEBHOOK_SECRET           # must match x-webhook-secret header sent by n8n
```

## Deployment

Deployed on Vercel (project: `dashboard`, team: `pats-projects-6459a59a`). Production URL: `https://dashboard-swart-alpha-88.vercel.app`. Pushing to `main` on GitHub auto-deploys via Vercel's GitHub integration.
