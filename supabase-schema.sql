-- Myanmar Python Learn — Supabase Schema
-- Run this entire file in the Supabase SQL Editor

-- ── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── profiles ─────────────────────────────────────────────────────────────────
create table if not exists profiles (
  id            uuid primary key,
  display_name  text not null,
  role          text not null check (role in ('student', 'teacher')),
  age_group     text not null default '',
  preferred_language text not null default 'mm',
  teacher_code  text unique,
  teacher_id    uuid references profiles(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists profiles_teacher_id_idx on profiles(teacher_id);
create index if not exists profiles_teacher_code_idx on profiles(teacher_code);

-- ── student_progress ─────────────────────────────────────────────────────────
create table if not exists student_progress (
  id                 uuid primary key default uuid_generate_v4(),
  student_id         uuid not null references profiles(id) on delete cascade,
  lesson_id          text not null,
  status             text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  time_spent_seconds int  not null default 0,
  started_at         timestamptz,
  completed_at       timestamptz,
  updated_at         timestamptz not null default now(),
  unique(student_id, lesson_id)
);

create index if not exists student_progress_student_idx on student_progress(student_id);

-- ── problem_attempts ─────────────────────────────────────────────────────────
create table if not exists problem_attempts (
  id                 uuid primary key default uuid_generate_v4(),
  student_id         uuid not null references profiles(id) on delete cascade,
  problem_id         text not null,
  code               text not null,
  passed             boolean not null,
  tests_passed       int  not null default 0,
  tests_total        int  not null default 0,
  error_message      text,
  time_spent_seconds int  not null default 0,
  attempted_at       timestamptz not null default now()
);

create index if not exists attempts_student_idx on problem_attempts(student_id);
create index if not exists attempts_problem_idx on problem_attempts(problem_id);

-- ── daily_activity ────────────────────────────────────────────────────────────
create table if not exists daily_activity (
  id                  uuid primary key default uuid_generate_v4(),
  student_id          uuid not null references profiles(id) on delete cascade,
  activity_date       date not null,
  lessons_touched     int  not null default 0,
  problems_attempted  int  not null default 0,
  problems_solved     int  not null default 0,
  total_seconds       int  not null default 0,
  unique(student_id, activity_date)
);

create index if not exists daily_activity_student_idx on daily_activity(student_id);

-- ── assignments ───────────────────────────────────────────────────────────────
create table if not exists assignments (
  id          uuid primary key default uuid_generate_v4(),
  teacher_id  uuid not null references profiles(id) on delete cascade,
  title       text not null,
  problem_ids text[] not null default '{}',
  assigned_to uuid[],          -- null = whole class
  due_date    timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists assignments_teacher_idx on assignments(teacher_id);

-- ── updated_at trigger ────────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

create trigger trg_student_progress_updated_at
  before update on student_progress
  for each row execute function set_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table profiles          enable row level security;
alter table student_progress  enable row level security;
alter table problem_attempts  enable row level security;
alter table daily_activity    enable row level security;
alter table assignments       enable row level security;

-- profiles: users see own row; teachers see their students
create policy "profiles: own row"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles: teacher sees students"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'teacher'
    )
    and teacher_id = auth.uid()
  );

create policy "profiles: insert own"
  on profiles for insert
  with check (auth.uid() = id);
  -- Note: server-side inserts (e.g. student registration) must use the
  -- service_role key (supabase-admin.ts) which bypasses RLS entirely.

create policy "profiles: update own"
  on profiles for update
  using (auth.uid() = id);

-- student_progress: own data + teacher reads
create policy "progress: own"
  on student_progress for all
  using (auth.uid() = student_id);

create policy "progress: teacher read"
  on student_progress for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'teacher'
    )
    and exists (
      select 1 from profiles s
      where s.id = student_id and s.teacher_id = auth.uid()
    )
  );

-- problem_attempts: own data + teacher reads
create policy "attempts: own"
  on problem_attempts for all
  using (auth.uid() = student_id);

create policy "attempts: teacher read"
  on problem_attempts for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'teacher'
    )
    and exists (
      select 1 from profiles s
      where s.id = student_id and s.teacher_id = auth.uid()
    )
  );

-- daily_activity: own data + teacher reads
create policy "activity: own"
  on daily_activity for all
  using (auth.uid() = student_id);

create policy "activity: teacher read"
  on daily_activity for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'teacher'
    )
    and exists (
      select 1 from profiles s
      where s.id = student_id and s.teacher_id = auth.uid()
    )
  );

-- assignments: teachers manage, students read theirs
create policy "assignments: teacher manage"
  on assignments for all
  using (auth.uid() = teacher_id);

create policy "assignments: student read"
  on assignments for select
  using (
    assigned_to is null
    or auth.uid() = any(assigned_to)
  );

-- ── Supabase keep-alive (called from /api/ping) ───────────────────────────────
-- No extra table needed — the ping route selects from profiles with limit 1.
