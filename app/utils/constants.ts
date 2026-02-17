export interface DefaultHabit {
  readonly key: string
  readonly nameUz: string
  readonly nameRu: string
  readonly nameEn: string
  readonly category: HabitCategory
  readonly targetDays: number
  readonly sortOrder: number
}

export type HabitCategory = 'prayer' | 'quran' | 'charity' | 'food' | 'worship'

export const DEFAULT_HABITS: readonly DefaultHabit[] = [
  { key: 'fasting', nameUz: "Ro'za", nameRu: 'Пост', nameEn: 'Fasting', category: 'worship', targetDays: 30, sortOrder: 1 },
  { key: 'prayers', nameUz: 'Namozlar', nameRu: 'Намазы', nameEn: 'Prayers', category: 'prayer', targetDays: 30, sortOrder: 2 },
  { key: 'quran', nameUz: "Qur'on tilovati - 1 soat", nameRu: 'Чтение Корана - 1 час', nameEn: 'Quran Recitation - 1 hour', category: 'quran', targetDays: 30, sortOrder: 3 },
  { key: 'dhikr', nameUz: 'Zikrlar - 1000 ta', nameRu: 'Зикр - 1000 раз', nameEn: 'Dhikr - 1000 times', category: 'worship', targetDays: 30, sortOrder: 4 },
  { key: 'salawat', nameUz: 'Salovot aytish', nameRu: 'Салават', nameEn: 'Salawat', category: 'worship', targetDays: 30, sortOrder: 5 },
  { key: 'ehson', nameUz: 'Ehson', nameRu: 'Благотворительность', nameEn: 'Charity', category: 'charity', targetDays: 30, sortOrder: 6 },
  { key: 'silai_rahm', nameUz: 'Silai rahm - kamida 1 kishi', nameRu: 'Поддержание родственных связей - минимум 1 человек', nameEn: 'Family ties - at least 1 person', category: 'charity', targetDays: 30, sortOrder: 7 },
  { key: 'social_media', nameUz: 'Ijtimoiy tarmoqlar', nameRu: 'Социальные сети', nameEn: 'Social media', category: 'worship', targetDays: 30, sortOrder: 8 },
  { key: 'tahajjud', nameUz: 'Tahajjud va tungi ibodatlar', nameRu: 'Тахаджуд и ночные молитвы', nameEn: 'Tahajjud & night prayers', category: 'prayer', targetDays: 30, sortOrder: 9 },
  { key: 'asma_ul_husna', nameUz: 'Asmol Husno', nameRu: 'Асмауль Хусна', nameEn: 'Asma ul Husna', category: 'worship', targetDays: 30, sortOrder: 10 },
  { key: 'duas', nameUz: 'Duolar', nameRu: 'Дуа', nameEn: 'Duas', category: 'worship', targetDays: 30, sortOrder: 11 },
] as const

export const HABIT_CATEGORIES: readonly HabitCategory[] = ['prayer', 'quran', 'charity', 'food', 'worship'] as const

export const RAMADAN_DAYS = 30

// Garden growth stages ordered from highest to lowest threshold
export const GROWTH_STAGES = ['barren', 'sprouts', 'small', 'medium', 'lush', 'paradise'] as const

export const GROWTH_STAGE_THRESHOLDS: readonly { readonly min: number; readonly stage: typeof GROWTH_STAGES[number] }[] = [
  { min: 90, stage: 'paradise' },
  { min: 70, stage: 'lush' },
  { min: 50, stage: 'medium' },
  { min: 30, stage: 'small' },
  { min: 10, stage: 'sprouts' },
  { min: 0, stage: 'barren' },
] as const

export const FLOWER_COUNT_DIVISOR = 10

export const PRAYER_METHODS = [
  { id: 2, name: 'Islamic Society of North America (ISNA)' },
  { id: 3, name: 'Muslim World League' },
  { id: 4, name: 'Umm Al-Qura University, Makkah' },
  { id: 5, name: 'Egyptian General Authority of Survey' },
  { id: 1, name: 'University of Islamic Sciences, Karachi' },
  { id: 8, name: 'Gulf Region' },
  { id: 9, name: 'Kuwait' },
  { id: 10, name: 'Qatar' },
  { id: 11, name: 'Majlis Ugama Islam Singapura' },
  { id: 12, name: 'UOIF (France)' },
  { id: 13, name: 'Diyanet (Turkey)' },
  { id: 14, name: 'Spiritual Administration of Muslims of Russia' },
  { id: 15, name: "Moonsighting Committee Worldwide" },
] as const
