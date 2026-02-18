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
  { key: 'taraweeh', nameUz: 'Taroveh namozi', nameRu: 'Таравих намаз', nameEn: 'Taraweeh prayer', category: 'prayer', targetDays: 30, sortOrder: 2 },
  { key: 'tahajjud', nameUz: 'Tahajjud namozi', nameRu: 'Тахаджуд намаз', nameEn: 'Tahajjud prayer', category: 'prayer', targetDays: 30, sortOrder: 3 },
  { key: 'quran', nameUz: "Qur'on tilovati", nameRu: 'Чтение Корана', nameEn: 'Quran recitation', category: 'quran', targetDays: 30, sortOrder: 4 },
  { key: 'dhikr', nameUz: 'Zikr', nameRu: 'Зикр', nameEn: 'Dhikr', category: 'worship', targetDays: 30, sortOrder: 5 },
  { key: 'salawat', nameUz: 'Salovot', nameRu: 'Салават', nameEn: 'Salawat', category: 'worship', targetDays: 30, sortOrder: 6 },
  { key: 'dua', nameUz: 'Duo', nameRu: 'Дуа', nameEn: 'Dua', category: 'worship', targetDays: 30, sortOrder: 7 },
  { key: 'sadaqah', nameUz: 'Sadaqa', nameRu: 'Садака', nameEn: 'Sadaqah', category: 'charity', targetDays: 30, sortOrder: 8 },
  { key: 'silai_rahm', nameUz: 'Silai rahm', nameRu: 'Поддержание родственных связей', nameEn: 'Family ties', category: 'charity', targetDays: 30, sortOrder: 9 },
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
  { id: 3, name: 'Muslim World League' },
  { id: 14, name: 'Spiritual Administration of Muslims of Russia' },
  { id: 13, name: 'Diyanet (Turkey)' },
  { id: 2, name: 'Islamic Society of North America (ISNA)' },
  { id: 4, name: 'Umm Al-Qura University, Makkah' },
  { id: 5, name: 'Egyptian General Authority of Survey' },
  { id: 1, name: 'University of Islamic Sciences, Karachi' },
  { id: 8, name: 'Gulf Region' },
  { id: 9, name: 'Kuwait' },
  { id: 10, name: 'Qatar' },
  { id: 11, name: 'Majlis Ugama Islam Singapura' },
  { id: 12, name: 'UOIF (France)' },
  { id: 15, name: 'Moonsighting Committee Worldwide' },
  { id: 16, name: 'Dubai' },
  { id: 17, name: 'JAKIM (Malaysia)' },
  { id: 18, name: 'Tunisia' },
  { id: 19, name: 'Algeria' },
  { id: 20, name: 'Indonesia (KEMENAG)' },
  { id: 21, name: 'Morocco' },
  { id: 22, name: 'Comunidade Islamica de Lisboa (Portugal)' },
  { id: 23, name: 'Jordan' },
] as const
