-- Daily prayer completion tracking
CREATE TABLE IF NOT EXISTS public.prayer_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ramadan_day integer NOT NULL CHECK (ramadan_day >= 1 AND ramadan_day <= 30),
  prayer_name text NOT NULL CHECK (prayer_name IN ('fajr', 'dhuhr', 'asr', 'maghrib', 'isha')),
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, ramadan_day, prayer_name)
);

CREATE INDEX IF NOT EXISTS idx_prayer_entries_user_id ON public.prayer_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_prayer_entries_user_day ON public.prayer_entries(user_id, ramadan_day);

ALTER TABLE public.prayer_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own prayer entries"
  ON public.prayer_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prayer entries"
  ON public.prayer_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prayer entries"
  ON public.prayer_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prayer entries"
  ON public.prayer_entries FOR DELETE
  USING (auth.uid() = user_id);
