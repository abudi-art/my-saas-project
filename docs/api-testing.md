# API Testing Guide

Phase 1 foundation endpoints for local development.

## Prerequisites

1. Set valid PostgreSQL URLs in `.env` (see `.env.example`).
2. Apply migrations: `npm run db:migrate`
3. Generate client: `npm run db:generate`
4. Seed demo data: `npm run db:seed`
5. Start the app: `npm run dev` (defaults to port 3000; if occupied, Next.js picks another port)

The seed script prints the merchant API key, program ID, and pass IDs to use below.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/health` | None |
| POST | `/api/passes` | API key |
| GET | `/api/passes/{passId}` | API key |
| POST | `/api/stamps/scan` | API key |

Authentication accepts either header:

- `Authorization: Bearer <apiKey>`
- `X-API-Key: <apiKey>`

## curl examples

Replace placeholders with values from `npm run db:seed` output.

```bash
# Health check
curl http://localhost:3000/api/health

# Create a pass
curl -X POST http://localhost:3000/api/passes \
  -H "Authorization: Bearer <seed-api-key>" \
  -H "Content-Type: application/json" \
  -d '{"programId":"<program-id>","customerIdentifier":"customer-3"}'

# Read a pass
curl http://localhost:3000/api/passes/<pass-id> \
  -H "Authorization: Bearer <seed-api-key>"

# Scan (increment stamp count)
curl -X POST http://localhost:3000/api/stamps/scan \
  -H "Authorization: Bearer <seed-api-key>" \
  -H "Content-Type: application/json" \
  -d '{"passId":"<pass-id>"}'
```

## Expected scan response

```json
{
  "passId": "...",
  "stampCount": 1,
  "stampThreshold": 10,
  "rewardDescription": "Free coffee on us!",
  "rewardEarned": false
}
```

## Verification checklist

1. Repeat scan calls and confirm `stampCount` increments.
2. Open Prisma Studio (`npm run db:studio`) and confirm `StampEvent` rows are created.
3. Call scan with a pass owned by another merchant and confirm `403 Forbidden`.
4. Call any protected route without an API key and confirm `401 Unauthorized`.

## Database notes (Prisma 7)

- Migrations use `DIRECT_URL` when set (non-placeholder); otherwise `DATABASE_URL`.
- Runtime queries use `DATABASE_URL` via the `@prisma/adapter-pg` driver adapter.
- For Supabase: use the pooler URL for `DATABASE_URL` (port 6543) and direct URL for `DIRECT_URL` (port 5432).
- URL-encode special characters in passwords (e.g. `[` → `%5B`, `]` → `%5D`, `@` → `%40`).

## Production deployment

See [deployment.md](./deployment.md) for Vercel setup and secure environment variable configuration.
