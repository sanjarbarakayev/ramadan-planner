import { z } from 'zod'
import { HABIT_CATEGORIES } from '~/utils/constants'

export const habitSchema = z.object({
  name_uz: z.string().min(1).max(100),
  name_ru: z.string().max(100).default(''),
  name_en: z.string().max(100).default(''),
  category: z.enum(HABIT_CATEGORIES as unknown as [string, ...string[]]),
  target_days: z.number().int().min(1).max(30),
})

export const dailyTaskSchema = z.object({
  title: z.string().min(1).max(200),
})

export const goalSchema = z.object({
  title: z.string().min(1).max(200),
})

export const journalEntrySchema = z.object({
  content: z.string().min(1).max(500),
})

export const profileSchema = z.object({
  gender: z.enum(['male', 'female']).optional(),
  language: z.enum(['uz', 'ru', 'en']).optional(),
  time_adjustment: z.number().int().min(-60).max(60).optional(),
  prayer_method: z.number().int().optional(),
  ramadan_start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})
