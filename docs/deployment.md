# Deployment Guide

Deploy the loyalty SaaS API to [Vercel](https://vercel.com) with [Supabase](https://supabase.com) PostgreSQL.

## Prerequisites

- GitHub repository with this project pushed to `main`
- Supabase project with migrations already applied locally (or ready to run on first deploy)
- Vercel account linked to GitHub

## 1. Push to GitHub

Ensure secrets are **not** committed. Only `.env.example` belongs in the repo — `.env` is gitignored.

```bash
git add .
git commit -m "Prepare Phase 1 foundation for deployment"
git remote add origin https://github.com/YOUR_USERNAME/my-saas-project.git
git push -u origin main
```

## 2. Import project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects **Next.js**; [`vercel.json`](vercel.json) sets region `fra1` (close to Supabase `eu-central-2`)

Default settings:

| Setting | Value |
|---------|-------|
| Framework | Next.js |
| Build Command | `npm run build` |
| Install Command | `npm install` |
| Output Directory | (auto) |

## 3. Environment variables (secure)

Add these in **Vercel → Project → Settings → Environment Variables**.  
Apply to **Production**, **Preview**, and **Development** as needed.

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | Runtime queries (transaction pooler, port **6543**) | `postgresql://postgres.xxx:PASSWORD@aws-1-eu-central-2.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | Prisma migrations during build (session pooler, port **5432**) | `postgresql://postgres.xxx:PASSWORD@aws-1-eu-central-2.pooler.supabase.com:5432/postgres` |

**Security rules:**

- Never commit `.env` or paste credentials into `vercel.json`, source code, or README
- Use Vercel's encrypted env storage only
- URL-encode special characters in passwords (`[` → `%5B`, `@` → `%40`, etc.)
- Rotate Supabase database password if it was ever exposed in chat or logs

Copy values from your local `.env` (Supabase → Project Settings → Database → Connection string).

## 4. Build pipeline

[`package.json`](package.json) build script:

```bash
prisma generate && prisma migrate deploy && next build
```

On each deploy, Vercel:

1. Generates the Prisma client
2. Applies pending migrations via `DIRECT_URL`
3. Builds the Next.js app (API routes use `DATABASE_URL` at runtime)

## 5. Verify production

After deploy completes:

```bash
curl https://YOUR_PROJECT.vercel.app/api/health
```

Expected response:

```json
{"status":"ok"}
```

Then test authenticated routes using your merchant API key — see [api-testing.md](./api-testing.md).

## 6. Optional: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.local   # pulls non-production envs for local testing
vercel --prod
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails on `migrate deploy` | Check `DIRECT_URL` is set in Vercel; use session pooler port 5432 |
| Runtime DB errors | Check `DATABASE_URL` uses port 6543 with `?pgbouncer=true` |
| `P1001` can't reach database | Confirm Supabase project is active; check IP/network restrictions |
| 401 on API routes | Use `Authorization: Bearer <apiKey>` from seeded merchant |

## Files reference

| File | Role |
|------|------|
| [`vercel.json`](../vercel.json) | Vercel project settings (region, build commands) |
| [`.env.example`](../.env.example) | Template for local env (no secrets) |
| [`prisma.config.ts`](../prisma.config.ts) | Migration datasource (`DIRECT_URL`) |
| [`lib/db.ts`](../lib/db.ts) | Runtime Prisma client (`DATABASE_URL`) |
