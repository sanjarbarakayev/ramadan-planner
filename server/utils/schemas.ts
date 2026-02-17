import { z } from 'zod'

export const prayerTimesQuerySchema = z.object({
  city: z.string().min(1, 'City is required'),
  country: z.string().optional().default(''),
  method: z.string().optional().default('14'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export const citiesQuerySchema = z.object({
  q: z.string().min(2, 'Query must be at least 2 characters'),
})
