-- Fix: ramadan_start_date default was '2026-02-28' but should be '2026-02-19'
ALTER TABLE public.profiles
  ALTER COLUMN ramadan_start_date SET DEFAULT '2026-02-19';

-- Update any existing rows that still have the wrong default
UPDATE public.profiles
  SET ramadan_start_date = '2026-02-19'
  WHERE ramadan_start_date = '2026-02-28';
