# B2B Loyalty SaaS

Multi-merchant stamp loyalty platform (Phase 1 foundation) built with Next.js 16, Prisma 7, and Supabase PostgreSQL.

## Features

- Merchant API key authentication
- Pass creation and stamp scan API
- Audit log (`StampEvent`) for every scan
- Wallet update hook stub (Phase 2: Apple PassKit / Google Wallet)

## Local development

```bash
cp .env.example .env   # add your Supabase credentials
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000/api/health](http://localhost:3000/api/health) — expect `{"status":"ok"}`.

See [docs/api-testing.md](./docs/api-testing.md) for curl examples.

## Deployment

Deploy to Vercel with Supabase env vars (`DATABASE_URL`, `DIRECT_URL`). Full steps:

**[docs/deployment.md](./docs/deployment.md)**

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Generate client, run migrations, production build |
| `npm run db:migrate` | Apply migrations locally (dev) |
| `npm run db:migrate:deploy` | Apply migrations (production/CI) |
| `npm run db:seed` | Seed demo merchant and passes |
| `npm run db:studio` | Open Prisma Studio |

## API routes

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/health` | None |
| POST | `/api/passes` | API key |
| GET | `/api/passes/[passId]` | API key |
| POST | `/api/stamps/scan` | API key |

## Tech stack

- Next.js 16 (App Router)
- Prisma 7 + `@prisma/adapter-pg`
- PostgreSQL (Supabase)
- Tailwind CSS 4
- Zod validation
