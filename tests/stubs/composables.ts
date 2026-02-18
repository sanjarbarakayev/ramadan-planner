// Re-export actual composables for global stub resolution
// This file is required() lazily from setup.ts to avoid circular deps
export { useHabits } from '~/composables/useHabits'
export { useProfile } from '~/composables/useProfile'
export { useRamadanDay } from '~/composables/useRamadanDay'
export { useStats } from '~/composables/useStats'
export { useDevDate, useDevGarden } from '~/composables/useDevDate'
export { useGarden } from '~/composables/useGarden'
