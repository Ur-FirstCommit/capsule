# Capsule by FirstCommit

Capsule is a private time-capsule app for leaving messages for your future self. It uses Next.js, Supabase Auth/Postgres/RLS, and Resend.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Install the database using `supabase/schema.sql`, then fill in `.env.local`. Full deployment instructions are in `docs/SETUP.md`.

```bash
npm test
npm run build
```
