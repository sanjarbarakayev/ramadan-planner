import { describe, it, expect, beforeEach } from 'vitest'
import { clearStateRegistry } from '../../mocks/imports'

// Must import after mocks resolve via alias
import { useDevDate, useDevGarden } from '~/composables/useDevDate'

beforeEach(() => {
  clearStateRegistry()
})

describe('useDevDate', () => {
  it('starts inactive by default', () => {
    const { isActive } = useDevDate()
    expect(isActive.value).toBe(false)
  })

  it('override is null by default', () => {
    const { override } = useDevDate()
    expect(override.value).toBe(null)
  })

  it('currentDate returns current date when inactive', () => {
    const { currentDate, isActive } = useDevDate()
    expect(isActive.value).toBe(false)
    // Should be close to "now" - at least a valid Date
    expect(currentDate.value).toBeInstanceOf(Date)
  })

  it('setDate activates override', () => {
    const { setDate, isActive, override } = useDevDate()
    setDate('2026-03-10')
    expect(isActive.value).toBe(true)
    expect(override.value).toBe('2026-03-10')
  })

  it('currentDate returns overridden date when active', () => {
    const { setDate, currentDate } = useDevDate()
    setDate('2026-03-10')
    expect(currentDate.value.getFullYear()).toBe(2026)
    expect(currentDate.value.getMonth()).toBe(2) // March
    expect(currentDate.value.getDate()).toBe(10)
  })

  it('reset deactivates override', () => {
    const { setDate, reset, isActive, override } = useDevDate()
    setDate('2026-03-10')
    expect(isActive.value).toBe(true)
    reset()
    expect(isActive.value).toBe(false)
    expect(override.value).toBe(null)
  })

  it('setDate with null deactivates override', () => {
    const { setDate, isActive } = useDevDate()
    setDate('2026-03-10')
    setDate(null)
    expect(isActive.value).toBe(false)
  })

  it('shares state across multiple calls via useState', () => {
    const first = useDevDate()
    const second = useDevDate()
    first.setDate('2026-02-25')
    expect(second.override.value).toBe('2026-02-25')
    expect(second.isActive.value).toBe(true)
  })
})

describe('useDevGarden', () => {
  it('starts inactive by default', () => {
    const { isActive } = useDevGarden()
    expect(isActive.value).toBe(false)
  })

  it('override is null by default', () => {
    const { override } = useDevGarden()
    expect(override.value).toBe(null)
  })

  it('setPercentage activates override', () => {
    const { setPercentage, isActive, override } = useDevGarden()
    setPercentage(75)
    expect(isActive.value).toBe(true)
    expect(override.value).toBe(75)
  })

  it('setPercentage with 0 is still active', () => {
    const { setPercentage, isActive, override } = useDevGarden()
    setPercentage(0)
    expect(isActive.value).toBe(true)
    expect(override.value).toBe(0)
  })

  it('reset deactivates override', () => {
    const { setPercentage, reset, isActive } = useDevGarden()
    setPercentage(50)
    reset()
    expect(isActive.value).toBe(false)
  })

  it('setPercentage with null deactivates override', () => {
    const { setPercentage, isActive } = useDevGarden()
    setPercentage(50)
    setPercentage(null)
    expect(isActive.value).toBe(false)
  })

  it('shares state across multiple calls via useState', () => {
    const first = useDevGarden()
    const second = useDevGarden()
    first.setPercentage(42)
    expect(second.override.value).toBe(42)
  })
})
