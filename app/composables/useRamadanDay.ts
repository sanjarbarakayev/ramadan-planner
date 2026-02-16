import {
  getRamadanDay,
  getDaysUntilRamadan,
  isBeforeRamadan,
  isDuringRamadan,
  isAfterRamadan,
  DEFAULT_RAMADAN_START,
} from '~/utils/ramadan'

export function useRamadanDay() {
  const { profile } = useProfile()
  const { currentDate, isActive: isDevDate } = useDevDate()

  const now = useNow({ interval: 60000 })

  const today = computed(() => isDevDate.value ? currentDate.value : now.value)

  const ramadanStart = computed(() => {
    if (profile.value?.ramadan_start_date) {
      return new Date(profile.value.ramadan_start_date + 'T00:00:00')
    }
    return DEFAULT_RAMADAN_START
  })

  const currentDay = computed(() => getRamadanDay(today.value, ramadanStart.value))
  const daysUntil = computed(() => getDaysUntilRamadan(today.value, ramadanStart.value))
  const isBefore = computed(() => isBeforeRamadan(today.value, ramadanStart.value))
  const isDuring = computed(() => isDuringRamadan(today.value, ramadanStart.value))
  const isAfter = computed(() => isAfterRamadan(today.value, ramadanStart.value))

  return {
    currentDay,
    daysUntil,
    isBefore,
    isDuring,
    isAfter,
    ramadanStart,
  }
}
