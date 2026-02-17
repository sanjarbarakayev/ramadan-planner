import { ref, computed, readonly, watch, type Ref } from 'vue'

// Re-export Vue primitives that Nuxt auto-imports
export { ref, computed, readonly, watch, onMounted, onUnmounted } from 'vue'

// useState registry to share state across composable calls within a test
const stateRegistry = new Map<string, Ref>()

export function useState<T>(key: string, init?: () => T): Ref<T> {
  if (stateRegistry.has(key)) {
    return stateRegistry.get(key)! as Ref<T>
  }
  const state = ref(init ? init() : undefined) as Ref<T>
  stateRegistry.set(key, state)
  return state
}

// Allow tests to clear shared state between runs
export function clearStateRegistry(): void {
  stateRegistry.clear()
}

// Configurable Supabase mock response
interface MockResponse {
  data: unknown
  error: unknown
}

let nextMockResponse: MockResponse = { data: null, error: null }

export function setSupabaseMockResponse(response: MockResponse): void {
  nextMockResponse = response
}

export function resetSupabaseMockResponse(): void {
  nextMockResponse = { data: null, error: null }
}

// Supabase mocks
const mockChain = () => {
  const chain: Record<string, (...args: unknown[]) => typeof chain & MockResponse> = {}
  const methods = ['from', 'select', 'insert', 'update', 'delete', 'upsert', 'eq', 'neq', 'gt', 'lt', 'order', 'single', 'limit', 'range', 'in', 'is']
  for (const method of methods) {
    chain[method] = () => Object.assign(chain, { ...nextMockResponse })
  }
  return chain
}

export function useSupabaseClient() {
  return mockChain()
}

export function useSupabaseUser() {
  return ref({ id: 'test-user-id' })
}

export function useSupabaseSession() {
  return ref(null)
}

// Configurable i18n locale
const localeRef = ref('en')

export function setMockLocale(locale: string): void {
  localeRef.value = locale
}

// i18n mock
export function useI18n() {
  return {
    t: (key: string) => key,
    locale: localeRef,
  }
}

// VueUse mock
export function useNow(_opts?: { interval?: number }) {
  return ref(new Date('2026-03-01T12:00:00'))
}

// $fetch mock (overridable per test)
export const $fetch = async (..._args: unknown[]) => ({})
