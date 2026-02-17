import { describe, it, expect, beforeEach } from 'vitest'
import {
  clearStateRegistry,
  setSupabaseMockResponse,
} from '../../mocks/imports'

import { genderToTheme, useProfile, type Profile } from '~/composables/useProfile'

beforeEach(() => {
  clearStateRegistry()
})

const mockProfile: Profile = {
  id: 'test-user-id',
  gender: 'male',
  language: 'en',
  theme: 'men',
  city: 'Tashkent',
  country: 'Uzbekistan',
  lat: 41.3,
  lng: 69.3,
  ramadan_start_date: '2026-02-19',
  prayer_method: 14,
  time_adjustment: 0,
  onboarding_complete: true,
}

describe('genderToTheme', () => {
  it('returns "men" for male', () => {
    expect(genderToTheme('male')).toBe('men')
  })

  it('returns "women" for female', () => {
    expect(genderToTheme('female')).toBe('women')
  })

  it('returns "women" for null', () => {
    expect(genderToTheme(null)).toBe('women')
  })
})

describe('useProfile', () => {
  it('profile starts as null', () => {
    const { profile } = useProfile()
    expect(profile.value).toBe(null)
  })

  it('loading starts as false', () => {
    const { loading } = useProfile()
    expect(loading.value).toBe(false)
  })

  it('themeClass is null when no profile', () => {
    const { themeClass } = useProfile()
    expect(themeClass.value).toBe(null)
  })

  it('themeClass returns theme-men for male profile', async () => {
    setSupabaseMockResponse({ data: mockProfile, error: null })
    const { fetchProfile, themeClass } = useProfile()
    await fetchProfile()
    expect(themeClass.value).toBe('theme-men')
  })

  it('themeClass returns theme-women for female profile', async () => {
    setSupabaseMockResponse({
      data: { ...mockProfile, gender: 'female' },
      error: null,
    })
    const { fetchProfile, themeClass } = useProfile()
    await fetchProfile()
    expect(themeClass.value).toBe('theme-women')
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

    it('auto-syncs theme when gender is male (immutable update)', async () => {
      setSupabaseMockResponse({ data: mockProfile, error: null })
      const { updateProfile } = useProfile()
      const result = await updateProfile({ gender: 'male' })
      expect(result.ok).toBe(true)
    })

    it('auto-syncs theme when gender is female', async () => {
      const femaleProfile = { ...mockProfile, gender: 'female' as const, theme: 'women' }
      setSupabaseMockResponse({ data: femaleProfile, error: null })
      const { updateProfile } = useProfile()
      const result = await updateProfile({ gender: 'female' })
      expect(result.ok).toBe(true)
    })

    it('does not add theme when gender is not provided', async () => {
      setSupabaseMockResponse({ data: { ...mockProfile, city: 'Moscow' }, error: null })
      const { updateProfile } = useProfile()
      const result = await updateProfile({ city: 'Moscow' })
      expect(result.ok).toBe(true)
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
