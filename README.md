# GymCRM — Personal Edition

A private, single-owner gym management system. It is designed to be accessible securely from a laptop, desktop, or phone through the internet.

## Planned modules
- Dashboard: members, revenue, attendance, expiries and follow-ups
- Member and lead management
- Membership plans, subscriptions and renewals
- Attendance and payment tracking
- Workout plans and assignments
- Reminders and reports

## Architecture
- Next.js + TypeScript application
- PostgreSQL hosted on Neon (not Supabase)
- Prisma ORM for schema management and database access
- Vercel hosting for access from anywhere
- Single-owner authentication; no staff accounts or multi-tenant SaaS layer

## Local development
1. Install Node.js LTS.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add your Neon PostgreSQL connection string and a strong authentication secret.
5. Run `npx prisma generate`.
6. Run `npm run dev`.

## Deployment
Deploy the repository to Vercel and add the same environment variables in the Vercel project settings. Use a Neon pooled connection string for `DATABASE_URL`. Run Prisma migrations as part of the controlled deployment workflow.

## Security
Never commit `.env.local`, database credentials, authentication secrets, or production passwords. Use HTTPS and a strong unique admin password. The app is intended for one authorized owner.
