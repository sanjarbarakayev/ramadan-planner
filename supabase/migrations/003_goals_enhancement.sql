-- Add enhanced fields to goals table
ALTER TABLE public.goals
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'general'
    CHECK (category IN ('quran', 'prayer', 'charity', 'personal', 'general')),
  ADD COLUMN IF NOT EXISTS priority integer DEFAULT 0
    CHECK (priority >= 0 AND priority <= 2),
  ADD COLUMN IF NOT EXISTS target_date date,
  ADD COLUMN IF NOT EXISTS ramadan_day integer
    CHECK (ramadan_day IS NULL OR (ramadan_day >= 1 AND ramadan_day <= 30)),
  ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;
