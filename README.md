# GymCRM — Personal Edition

A private, single-owner gym management workspace intended to be accessible online from a laptop or phone.

## Stack
- Next.js App Router + TypeScript
- Neon PostgreSQL
- Prisma ORM
- Better Auth (email/password; public registration disabled)
- Vercel hosting

## Product scope
- Dashboard: members, revenue, attendance, expiring memberships and follow-ups
- Members and lead pipeline
- Membership plans, memberships and renewals
- Attendance tracking
- Payments and revenue records
- Workout plans and member assignments
- Reminders and reports
- Gym profile and settings

## Local setup
1. Use Node.js 22 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Create a Neon PostgreSQL database and set `DATABASE_URL`.
5. Generate a strong `BETTER_AUTH_SECRET` (for example, `openssl rand -base64 32`).
6. Set `BETTER_AUTH_URL=http://localhost:3000` and `NEXT_PUBLIC_APP_URL=http://localhost:3000`.
7. Set a strong temporary `GYMCRM_SETUP_TOKEN`.
8. Run `npm run db:generate`, then `npm run db:push`.
9. Start the app with `npm run dev`.
10. Open `/setup` and create the owner account using the temporary setup token.
11. Remove `GYMCRM_SETUP_TOKEN` from the environment immediately after the owner account is created. The setup endpoint also refuses to create another owner once a user exists.
12. Sign in at `/login`.

## Security
- One owner account; public self-registration is disabled.
- Initial owner creation requires a one-time secret and is closed once the first user exists.
- All gym records are scoped to the authenticated owner.
- Never commit `.env.local`, database credentials, setup tokens, or auth secrets.
- Configure production environment variables as encrypted secrets in Vercel.

## Deployment
Connect this repository to Vercel and configure `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `NEXT_PUBLIC_APP_URL`. Set `GYMCRM_SETUP_TOKEN` only for the initial owner bootstrap, then remove it. Apply Prisma schema changes with a controlled `npm run db:push` during initial setup; use reviewed migrations for ongoing production schema changes.

## Current implementation status
The owner sign-in and first-run setup flow are scaffolded. Member creation and member listing are database-backed. Dashboard metrics and the remaining modules are still placeholders and need implementation and testing.
