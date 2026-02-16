import { differenceInDays, startOfDay, addDays, isWithinInterval } from 'date-fns'

export const DEFAULT_RAMADAN_START = new Date(2026, 1, 19) // Feb 19, 2026

export function getRamadanDay(today: Date, ramadanStart: Date): number {
  const start = startOfDay(ramadanStart)
  const current = startOfDay(today)
  const diff = differenceInDays(current, start) + 1
  if (diff < 1 || diff > 30) return 0
  return diff
}

export function getDaysUntilRamadan(today: Date, ramadanStart: Date): number {
  const start = startOfDay(ramadanStart)
  const current = startOfDay(today)
  const diff = differenceInDays(start, current)
  return Math.max(0, diff)
}

export function isBeforeRamadan(today: Date, ramadanStart: Date): boolean {
  return startOfDay(today) < startOfDay(ramadanStart)
}

export function isDuringRamadan(today: Date, ramadanStart: Date): boolean {
  const start = startOfDay(ramadanStart)
  const end = addDays(start, 29) // 30 days total (day 1 to day 30)
  return isWithinInterval(startOfDay(today), { start, end })
}

export function isAfterRamadan(today: Date, ramadanStart: Date): boolean {
  const end = addDays(startOfDay(ramadanStart), 30)
  return startOfDay(today) >= end
}

export function getRamadanDateForDay(day: number, ramadanStart: Date): Date {
  return addDays(startOfDay(ramadanStart), day - 1)
}
