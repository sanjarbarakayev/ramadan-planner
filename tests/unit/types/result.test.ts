import { describe, it, expect } from 'vitest'
import { success, failure } from '../../../app/types/result'
import type { OperationResult } from '../../../app/types/result'

describe('OperationResult helpers', () => {
  it('success creates an ok result with data', () => {
    const result: OperationResult<string> = success('hello')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toBe('hello')
    }
  })

  it('success works with complex data', () => {
    const data = { id: '1', name: 'test' }
    const result = success(data)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toEqual(data)
    }
  })

  it('failure creates a not-ok result with error message', () => {
    const result: OperationResult<string> = failure('something went wrong')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe('something went wrong')
    }
  })

  it('success with undefined data', () => {
    const result = success(undefined)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toBeUndefined()
    }
  })
})
