-- Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  gender text check (gender in ('male', 'female')),
  language text default 'uz' check (language in ('uz', 'ru', 'en')),
  theme text default 'women' check (theme in ('women', 'men')),
  city text,
  country text,
  lat double precision,
  lng double precision,
  ramadan_start_date date default '2026-02-19',
  prayer_method integer default 14,
  time_adjustment integer default 0,
  onboarding_complete boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Habits table
create table public.habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name_uz text not null,
  name_ru text not null default '',
  name_en text not null default '',
  category text not null check (category in ('prayer', 'quran', 'charity', 'food', 'worship')),
  target_days integer not null default 30,
  sort_order integer not null default 0,
  is_custom boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Habit entries table
create table public.habit_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  habit_id uuid references public.habits on delete cascade not null,
  ramadan_day integer not null check (ramadan_day >= 1 and ramadan_day <= 30),
  completed boolean default false,
  date date,
  created_at timestamptz default now(),
  unique (habit_id, ramadan_day)
);

-- Daily tasks table
create table public.daily_tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  ramadan_day integer not null check (ramadan_day >= 1 and ramadan_day <= 30),
  title text not null,
  completed boolean default false,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

-- Goals table
create table public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text default '',
  completed boolean default false,
  created_at timestamptz default now()
);

-- Indexes
create index habits_user_id_idx on public.habits (user_id);
create index habit_entries_user_id_idx on public.habit_entries (user_id);
create index habit_entries_habit_id_idx on public.habit_entries (habit_id);
create index daily_tasks_user_id_day_idx on public.daily_tasks (user_id, ramadan_day);
create index goals_user_id_idx on public.goals (user_id);

-- RLS policies
alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habit_entries enable row level security;
alter table public.daily_tasks enable row level security;
alter table public.goals enable row level security;

-- Profiles: users can only access their own profile
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Habits: users can only access their own habits
create policy "Users can view own habits"
  on public.habits for select using (auth.uid() = user_id);
create policy "Users can insert own habits"
  on public.habits for insert with check (auth.uid() = user_id);
create policy "Users can update own habits"
  on public.habits for update using (auth.uid() = user_id);
create policy "Users can delete own habits"
  on public.habits for delete using (auth.uid() = user_id);

-- Habit entries: users can only access their own entries
create policy "Users can view own habit entries"
  on public.habit_entries for select using (auth.uid() = user_id);
create policy "Users can insert own habit entries"
  on public.habit_entries for insert with check (auth.uid() = user_id);
create policy "Users can update own habit entries"
  on public.habit_entries for update using (auth.uid() = user_id);
create policy "Users can delete own habit entries"
  on public.habit_entries for delete using (auth.uid() = user_id);

-- Daily tasks: users can only access their own tasks
create policy "Users can view own daily tasks"
  on public.daily_tasks for select using (auth.uid() = user_id);
create policy "Users can insert own daily tasks"
  on public.daily_tasks for insert with check (auth.uid() = user_id);
create policy "Users can update own daily tasks"
  on public.daily_tasks for update using (auth.uid() = user_id);
create policy "Users can delete own daily tasks"
  on public.daily_tasks for delete using (auth.uid() = user_id);

-- Goals: users can only access their own goals
create policy "Users can view own goals"
  on public.goals for select using (auth.uid() = user_id);
create policy "Users can insert own goals"
  on public.goals for insert with check (auth.uid() = user_id);
create policy "Users can update own goals"
  on public.goals for update using (auth.uid() = user_id);
create policy "Users can delete own goals"
  on public.goals for delete using (auth.uid() = user_id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();
