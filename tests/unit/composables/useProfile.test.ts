import { describe, it, expect, beforeEach } from 'vitest'
import {
  clearStateRegistry,
  setSupabaseMockResponse,
} from '../../mocks/imports'

import { useProfile, type Profile } from '~/composables/useProfile'

beforeEach(() => {
  clearStateRegistry()
})

const mockProfile: Profile = {
  id: 'test-user-id',
  language: 'en',
  theme: 'default',
  city: 'Tashkent',
  country: 'Uzbekistan',
  lat: 41.3,
  lng: 69.3,
  ramadan_start_date: '2026-02-19',
  prayer_method: 14,
  time_adjustment: 0,
  onboarding_complete: true,
}

describe('useProfile', () => {
  it('profile starts as null', () => {
    const { profile } = useProfile()
    expect(profile.value).toBe(null)
  })

  it('loading starts as false', () => {
    const { loading } = useProfile()
    expect(loading.value).toBe(false)
  })

  describe('fetchProfile', () => {
    it('sets profile from Supabase response', async () => {
      setSupabaseMockResponse({ data: mockProfile, error: null })
      const { fetchProfile, profile } = useProfile()
      const result = await fetchProfile()
      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.data).toEqual(mockProfile)
      }
      expect(profile.value).toEqual(mockProfile)
    })

    it('returns failure on error', async () => {
      setSupabaseMockResponse({ data: null, error: { message: 'Not found' } })
      const { fetchProfile, profile } = useProfile()
      const result = await fetchProfile()
      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBe('Not found')
      }
      expect(profile.value).toBe(null)
    })

    it('sets loading to false after fetch', async () => {
      const { fetchProfile, loading } = useProfile()
      await fetchProfile()
      expect(loading.value).toBe(false)
    })

    it('sets loading to false after error', async () => {
      setSupabaseMockResponse({ data: null, error: { message: 'error' } })
      const { fetchProfile, loading } = useProfile()
      await fetchProfile()
      expect(loading.value).toBe(false)
    })
  })

  describe('updateProfile', () => {
    it('returns success with updated profile', async () => {
      const updated = { ...mockProfile, city: 'London' }
      setSupabaseMockResponse({ data: updated, error: null })
      const { updateProfile, profile } = useProfile()
      const result = await updateProfile({ city: 'London' })
      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.data).toEqual(updated)
      }
      expect(profile.value).toEqual(updated)
    })

    it('returns failure on error', async () => {
      setSupabaseMockResponse({ data: null, error: { message: 'Update failed' } })
      const { updateProfile } = useProfile()
      const result = await updateProfile({ city: 'London' })
      expect(result.ok).toBe(false)
    })
  })

  describe('completeOnboarding', () => {
    it('delegates to updateProfile with onboarding_complete', async () => {
      setSupabaseMockResponse({ data: { ...mockProfile, onboarding_complete: true }, error: null })
      const { completeOnboarding } = useProfile()
      const result = await completeOnboarding({ city: 'Tashkent' })
      expect(result.ok).toBe(true)
    })
  })

  it('shares state across multiple calls', () => {
    const first = useProfile()
    const second = useProfile()
    expect(first.profile).toBe(second.profile)
  })
})
