# GymCRM — Personal Edition

A single-owner gym management workspace built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features
- Dashboard for members, revenue, attendance, expiries and follow-ups
- Member and lead management
- Membership plans, subscriptions and renewals
- Attendance and payment tracking
- Workout plans and assignments
- Reminders and reports

## Architecture
- One authenticated owner; no multi-tenant SaaS layer
- Supabase Auth with cookie-based SSR sessions
- PostgreSQL with Row Level Security on every exposed application table
- All business records are scoped to the authenticated owner via `owner_id`

## Setup
1. Install Node.js LTS.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and add your Supabase URL and publishable key.
4. Run `npm run dev`.

Apply `supabase/migrations/0001_initial_schema.sql` to the dedicated GymCRM Supabase project.

Never commit `.env.local`, Supabase secret keys, or service-role keys.
