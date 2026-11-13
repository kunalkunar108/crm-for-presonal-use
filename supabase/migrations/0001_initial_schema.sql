create extension if not exists pgcrypto;

create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 full_name text, email text, phone text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table public.gym_settings (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null unique references auth.users(id) on delete cascade,
 gym_name text not null default 'My Gym',
 address text, phone text, email text,
 currency text not null default 'INR',
 timezone text not null default 'Asia/Kolkata',
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table public.members (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 member_code text, full_name text not null, phone text, email text,
 date_of_birth date,
 gender text check (gender in ('male','female','other','prefer_not_to_say')),
 address text, emergency_contact_name text, emergency_contact_phone text,
 fitness_goal text, medical_notes text, joined_on date not null default current_date,
 status text not null default 'active' check (status in ('active','inactive','blocked')),
 notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(owner_id, member_code)
);

create table public.leads (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 full_name text not null, phone text, email text, source text, interest text,
 stage text not null default 'new' check (stage in ('new','contacted','trial_scheduled','trial_completed','negotiation','won','lost')),
 next_follow_up_at timestamptz, last_contacted_at timestamptz,
 converted_member_id uuid references public.members(id) on delete set null,
 notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.membership_plans (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 name text not null, duration_days integer not null check (duration_days > 0),
 price numeric(12,2) not null check (price >= 0), description text,
 is_active boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(owner_id, name)
);

create table public.memberships (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 member_id uuid not null references public.members(id) on delete restrict,
 plan_id uuid references public.membership_plans(id) on delete set null,
 plan_name text not null, amount numeric(12,2) not null check (amount >= 0),
 start_date date not null, end_date date not null,
 status text not null default 'active' check (status in ('active','expired','cancelled','paused')),
 notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check (end_date >= start_date)
);

create table public.attendance (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 member_id uuid not null references public.members(id) on delete cascade,
 checked_in_at timestamptz not null default now(), checked_out_at timestamptz,
 attendance_date date not null default current_date,
 source text not null default 'manual' check (source in ('manual','qr','import')),
 notes text, created_at timestamptz not null default now()
);

create table public.payments (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 member_id uuid not null references public.members(id) on delete restrict,
 membership_id uuid references public.memberships(id) on delete set null,
 amount numeric(12,2) not null check (amount > 0),
 payment_date date not null default current_date,
 payment_method text not null default 'cash' check (payment_method in ('cash','upi','card','bank_transfer','other')),
 status text not null default 'paid' check (status in ('paid','pending','failed','refunded')),
 reference_number text, notes text, created_at timestamptz not null default now()
);

create table public.workout_plans (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 name text not null, goal text,
 difficulty text check (difficulty in ('beginner','intermediate','advanced')),
 description text, plan_data jsonb not null default '[]'::jsonb,
 is_active boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.member_workout_plans (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 member_id uuid not null references public.members(id) on delete cascade,
 workout_plan_id uuid not null references public.workout_plans(id) on delete cascade,
 starts_on date not null default current_date, ends_on date, notes text,
 created_at timestamptz not null default now(),
 check (ends_on is null or ends_on >= starts_on)
);

create table public.reminders (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 member_id uuid references public.members(id) on delete cascade,
 lead_id uuid references public.leads(id) on delete cascade,
 title text not null, description text, due_at timestamptz not null,
 status text not null default 'pending' check (status in ('pending','completed','dismissed')),
 reminder_type text not null default 'general' check (reminder_type in ('general','membership_expiry','payment_due','lead_follow_up','birthday')),
 created_at timestamptz not null default now(), completed_at timestamptz,
 check (member_id is not null or lead_id is not null or reminder_type = 'general')
);

create index members_owner_status_idx on public.members(owner_id,status);
create index members_owner_name_idx on public.members(owner_id,full_name);
create index leads_owner_stage_idx on public.leads(owner_id,stage);
create index leads_follow_up_idx on public.leads(owner_id,next_follow_up_at);
create index memberships_expiry_idx on public.memberships(owner_id,end_date);
create index attendance_member_date_idx on public.attendance(owner_id,member_id,attendance_date desc);
create index payments_date_idx on public.payments(owner_id,payment_date desc);
create index reminders_due_idx on public.reminders(owner_id,due_at) where status='pending';

-- Keep related records inside the same personal account.
create or replace function public.enforce_same_owner()
returns trigger language plpgsql set search_path = ''
as $$
begin
 if tg_table_name = 'memberships' then
  if not exists(select 1 from public.members m where m.id=new.member_id and m.owner_id=new.owner_id) then raise exception 'member must belong to same owner'; end if;
  if new.plan_id is not null and not exists(select 1 from public.membership_plans p where p.id=new.plan_id and p.owner_id=new.owner_id) then raise exception 'plan must belong to same owner'; end if;
 elsif tg_table_name in ('attendance','payments') then
  if not exists(select 1 from public.members m where m.id=new.member_id and m.owner_id=new.owner_id) then raise exception 'member must belong to same owner'; end if;
  if tg_table_name='payments' and new.membership_id is not null and not exists(select 1 from public.memberships ms where ms.id=new.membership_id and ms.owner_id=new.owner_id) then raise exception 'membership must belong to same owner'; end if;
 elsif tg_table_name='member_workout_plans' then
  if not exists(select 1 from public.members m where m.id=new.member_id and m.owner_id=new.owner_id) then raise exception 'member must belong to same owner'; end if;
  if not exists(select 1 from public.workout_plans w where w.id=new.workout_plan_id and w.owner_id=new.owner_id) then raise exception 'workout plan must belong to same owner'; end if;
 elsif tg_table_name='reminders' then
  if new.member_id is not null and not exists(select 1 from public.members m where m.id=new.member_id and m.owner_id=new.owner_id) then raise exception 'member must belong to same owner'; end if;
  if new.lead_id is not null and not exists(select 1 from public.leads l where l.id=new.lead_id and l.owner_id=new.owner_id) then raise exception 'lead must belong to same owner'; end if;
 end if;
 return new;
end;
$$;

create trigger memberships_same_owner before insert or update on public.memberships for each row execute function public.enforce_same_owner();
create trigger attendance_same_owner before insert or update on public.attendance for each row execute function public.enforce_same_owner();
create trigger payments_same_owner before insert or update on public.payments for each row execute function public.enforce_same_owner();
create trigger member_workout_plans_same_owner before insert or update on public.member_workout_plans for each row execute function public.enforce_same_owner();
create trigger reminders_same_owner before insert or update on public.reminders for each row execute function public.enforce_same_owner();

alter table public.profiles enable row level security;
alter table public.gym_settings enable row level security;
alter table public.members enable row level security;
alter table public.leads enable row level security;
alter table public.membership_plans enable row level security;
alter table public.memberships enable row level security;
alter table public.attendance enable row level security;
alter table public.payments enable row level security;
alter table public.workout_plans enable row level security;
alter table public.member_workout_plans enable row level security;
alter table public.reminders enable row level security;

create policy "owner manages own profile" on public.profiles for all to authenticated using ((select auth.uid())=id) with check ((select auth.uid())=id);
create policy "owner manages own gym settings" on public.gym_settings for all to authenticated using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
create policy "owner manages own members" on public.members for all to authenticated using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
create policy "owner manages own leads" on public.leads for all to authenticated using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
create policy "owner manages own membership plans" on public.membership_plans for all to authenticated using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
create policy "owner manages own memberships" on public.memberships for all to authenticated using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
create policy "owner manages own attendance" on public.attendance for all to authenticated using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
create policy "owner manages own payments" on public.payments for all to authenticated using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
create policy "owner manages own workout plans" on public.workout_plans for all to authenticated using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
create policy "owner manages own workout assignments" on public.member_workout_plans for all to authenticated using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
create policy "owner manages own reminders" on public.reminders for all to authenticated using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);

grant usage on schema public to authenticated;
grant select,insert,update,delete on public.profiles,public.gym_settings,public.members,public.leads,public.membership_plans,public.memberships,public.attendance,public.payments,public.workout_plans,public.member_workout_plans,public.reminders to authenticated;
