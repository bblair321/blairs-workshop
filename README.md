# Blair's Workshop

Public mod catalog for PC game mods and Lua scripts. Free downloads now, with Stripe-powered paid mods and a user library.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind
- **PostgreSQL** via Prisma (Neon or Supabase recommended)
- **Cloudflare R2** for private mod file storage with signed download URLs
- **NextAuth** for user accounts
- **Stripe** for paid mod checkout

## Quick start

1. Copy environment variables:

```bash
cp .env.example .env
```

2. Set `DATABASE_URL`, `AUTH_SECRET`, and `ADMIN_PASSWORD` at minimum.

3. Push the database schema:

```bash
npm run db:push
```

### Neon (recommended)

1. Create a free project at [console.neon.tech](https://console.neon.tech).
2. Click **Connect** and copy both connection strings:
   - **Pooled** (`-pooler` in hostname) → `DATABASE_URL`
   - **Direct** (no `-pooler`) → `DATABASE_URL_UNPOOLED`
3. Add to `.env` (include `sslmode=require` on both; optional `connect_timeout=15` on `DATABASE_URL`).
4. Run `npm run db:push` once to create tables.

The app auto-uses the Neon adapter when `DATABASE_URL` contains `neon.tech`.

4. Start the dev server:

```bash
npm run dev
```

5. Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) and sign in with `ADMIN_PASSWORD`.

## File storage (R2)

Create a Cloudflare R2 bucket and API token. Set:

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`

Downloads are served via short-lived signed URLs from `/api/download/[versionId]`.

## Stripe (paid mods)

1. Create a Stripe account and add keys to `.env`.
2. Set up a webhook pointing to `https://your-domain.com/api/stripe/webhook` for `checkout.session.completed`.
3. Set a mod's price in Admin (price in USD). Users must sign in and purchase before downloading.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add all environment variables from `.env.example`.
4. Use a hosted Postgres provider (Neon integrates with Vercel).
5. Run `npm run db:push` against production `DATABASE_URL` once (locally or via CI).

```bash
npx vercel --prod
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Homepage with featured mods |
| `/mods` | Browse all mods |
| `/mods/[slug]` | Mod detail + download |
| `/lua` | Lua scripts category |
| `/games/[game]` | Mods filtered by game |
| `/library` | Purchased mods (signed-in users) |
| `/login`, `/register` | User auth |
| `/terms`, `/privacy` | Legal pages |
| `/admin` | Mod management (admin password) |

## Legal pages

Contact email and legal copy are driven by `CONTACT_EMAIL` in `.env`. Pages:

| Path | Description |
|------|-------------|
| `/terms` | Terms of Use (includes DMCA procedure) |
| `/privacy` | Privacy Policy |

Update `LEGAL_LAST_UPDATED` in `src/lib/site.ts` when you change legal text.
