-- Quran juz reading progress
CREATE TABLE IF NOT EXISTS public.quran_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  juz_number integer NOT NULL CHECK (juz_number >= 1 AND juz_number <= 30),
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, juz_number)
);

CREATE INDEX IF NOT EXISTS idx_quran_progress_user_id ON public.quran_progress(user_id);

ALTER TABLE public.quran_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quran progress"
  ON public.quran_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quran progress"
  ON public.quran_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quran progress"
  ON public.quran_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own quran progress"
  ON public.quran_progress FOR DELETE
  USING (auth.uid() = user_id);
