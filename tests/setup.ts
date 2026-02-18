import { vi, beforeEach } from 'vitest'
import { ref, computed, readonly, watch } from 'vue'
import {
  clearStateRegistry,
  useState,
  useSupabaseClient,
  useSupabaseUser,
  useSupabaseSession,
  useI18n,
  useNow,
  resetSupabaseMockResponse,
  setMockLocale,
} from './mocks/imports'

// Pre-load composables so they are cached and available for global stubs
import { useHabits } from '~/composables/useHabits'
import { useProfile } from '~/composables/useProfile'
import { useRamadanDay } from '~/composables/useRamadanDay'
import { useStats } from '~/composables/useStats'
import { useDevDate, useDevGarden } from '~/composables/useDevDate'
import { useGarden } from '~/composables/useGarden'

// Clear shared state and reset mocks between tests
beforeEach(() => {
  clearStateRegistry()
  resetSupabaseMockResponse()
  setMockLocale('en')
})

// Stub all Nuxt auto-imports as globals so composables can call them
vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)
vi.stubGlobal('readonly', readonly)
vi.stubGlobal('watch', watch)
vi.stubGlobal('useState', useState)
vi.stubGlobal('useSupabaseClient', useSupabaseClient)
vi.stubGlobal('useSupabaseUser', useSupabaseUser)
vi.stubGlobal('useSupabaseSession', useSupabaseSession)
vi.stubGlobal('useI18n', useI18n)
vi.stubGlobal('useNow', useNow)
vi.stubGlobal('$fetch', vi.fn())
vi.stubGlobal('onMounted', vi.fn())
vi.stubGlobal('onUnmounted', vi.fn())

// Stub cross-composable auto-imports
vi.stubGlobal('useHabits', useHabits)
vi.stubGlobal('useProfile', useProfile)
vi.stubGlobal('useRamadanDay', useRamadanDay)
vi.stubGlobal('useStats', useStats)
vi.stubGlobal('useDevDate', useDevDate)
vi.stubGlobal('useDevGarden', useDevGarden)
vi.stubGlobal('useGarden', useGarden)
