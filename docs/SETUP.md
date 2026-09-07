# Setup

## 1. Install dependencies

```bash
npm install
cp .env.example .env.local
```

## 2. Create Supabase project

Create a project at supabase.com. Copy Project URL and anon public key from Project Settings > API into `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Copy the service role key only into `SUPABASE_SERVICE_ROLE_KEY`.

## 3. Configure database

Easy setup: paste `supabase/schema.sql` into the Supabase SQL Editor and run it.

Development setup: install the Supabase CLI, then run `supabase link --project-ref YOUR_REF` and `supabase db push`. Migrations in `supabase/migrations/` are the source of truth for ongoing development.

In Authentication > URL Configuration, set the site URL to `NEXT_PUBLIC_APP_URL` and add `NEXT_PUBLIC_APP_URL/auth/callback` as a redirect URL.

## 4. Configure Resend

Verify a sending domain in Resend, create an API key, set it as `RESEND_API_KEY`, and set `RESEND_FROM_EMAIL` to an address on that verified domain.

## 5. Configure environment

Copy `.env.example` to `.env.local`. Set every value, including a random `CRON_SECRET` of at least 20 characters. Never expose service-role, Resend, or cron secrets with `NEXT_PUBLIC_`.

## 6. Run locally

```bash
npm run dev
```

## 7. Test auth and capsules

Open `http://localhost:3000`, create an account, confirm email if enabled, sign in, and create a capsule. Use a custom date a few minutes ahead for local testing.

## 8. Test unlock email

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/unlock
```

## 9. Deploy

Deploy to Vercel, add the required `.env.local` values under Project Settings > Environment Variables, and redeploy. No Vercel Cron configuration is required to launch the website. The protected `GET /api/cron/unlock` endpoint remains available if you later configure an external scheduler; set `CRON_SECRET` and call it every 15 minutes with `Authorization: Bearer CRON_SECRET` for automatic unlock emails.
