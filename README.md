# GymCRM — Personal Edition

A private, single-admin gym management workspace. The app is intended to be accessible online from a laptop or phone.

## Stack
- Next.js App Router + TypeScript
- Neon PostgreSQL
- Prisma ORM
- Better Auth for single-admin authentication
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
1. Install Node.js 20.19+ or 22.12+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Create a Neon PostgreSQL database and set `DATABASE_URL`.
5. Generate a strong `BETTER_AUTH_SECRET` and set `BETTER_AUTH_URL=http://localhost:3000`.
6. Run `npm run db:generate`.
7. Run `npm run db:migrate` after configuring the Prisma schema.
8. Run `npm run dev`.

## Security
- Single owner account; no public self-registration.
- All gym records are related to the authenticated owner.
- Never commit `.env.local`, database credentials, or auth secrets.
- Production access must be protected by authentication.

## Deployment
Deploy the Next.js app to Vercel and configure the production Neon connection string and Better Auth environment variables in Vercel. Database migrations should be applied as part of a controlled release.
