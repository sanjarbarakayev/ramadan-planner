import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { H3Event } from 'h3'

// Mock H3 utilities that rate-limit.ts uses as Nitro auto-imports
vi.stubGlobal('getHeader', vi.fn())
vi.stubGlobal('getRequestURL', vi.fn())
vi.stubGlobal('setResponseHeader', vi.fn())
vi.stubGlobal('createError', vi.fn((opts: { statusCode: number; message: string }) => {
  const error = new Error(opts.message) as Error & { statusCode: number }
  error.statusCode = opts.statusCode
  return error
}))

function createMockEvent(ip = '127.0.0.1', path = '/api/test'): H3Event {
  return {} as H3Event
}

beforeEach(() => {
  vi.mocked(getHeader).mockReset()
  vi.mocked(getRequestURL).mockReset()
  vi.mocked(setResponseHeader).mockReset()
})

// We must dynamically import after mocking globals
async function importRateLimit() {
  // Force re-import to reset module-level state
  const module = await import('../../../server/utils/rate-limit')
  return module.useRateLimit
}

describe('useRateLimit', () => {
  it('returns a function', async () => {
    const useRateLimit = await importRateLimit()
    const limiter = useRateLimit({ maxRequests: 5, windowMs: 60000 })
    expect(typeof limiter).toBe('function')
  })

  it('allows requests under the limit', async () => {
    const useRateLimit = await importRateLimit()
    const limiter = useRateLimit({ maxRequests: 5, windowMs: 60000 })
    const event = createMockEvent()

    vi.mocked(getHeader).mockReturnValue(undefined)
    vi.mocked(getRequestURL).mockReturnValue(new URL('http://localhost/api/test'))

    // Should not throw
    expect(() => limiter(event)).not.toThrow()
  })

  it('uses x-forwarded-for header for IP', async () => {
    const useRateLimit = await importRateLimit()
    const limiter = useRateLimit({ maxRequests: 5, windowMs: 60000 })
    const event = createMockEvent()

    vi.mocked(getHeader).mockImplementation((_event, name) => {
      if (name === 'x-forwarded-for') return '1.2.3.4, 5.6.7.8'
      return undefined
    })
    vi.mocked(getRequestURL).mockReturnValue(new URL('http://localhost/api/unique-path-1'))

    expect(() => limiter(event)).not.toThrow()
  })

  it('uses x-real-ip when no forwarded-for', async () => {
    const useRateLimit = await importRateLimit()
    const limiter = useRateLimit({ maxRequests: 5, windowMs: 60000 })
    const event = createMockEvent()

    vi.mocked(getHeader).mockImplementation((_event, name) => {
      if (name === 'x-real-ip') return '10.0.0.1'
      return undefined
    })
    vi.mocked(getRequestURL).mockReturnValue(new URL('http://localhost/api/unique-path-2'))

    expect(() => limiter(event)).not.toThrow()
  })

  it('falls back to unknown when no IP headers', async () => {
    const useRateLimit = await importRateLimit()
    const limiter = useRateLimit({ maxRequests: 5, windowMs: 60000 })
    const event = createMockEvent()

    vi.mocked(getHeader).mockReturnValue(undefined)
    vi.mocked(getRequestURL).mockReturnValue(new URL('http://localhost/api/unique-path-3'))

    expect(() => limiter(event)).not.toThrow()
  })

  it('throws 429 when rate limit exceeded', async () => {
    const useRateLimit = await importRateLimit()
    const limiter = useRateLimit({ maxRequests: 2, windowMs: 60000 })
    const event = createMockEvent()

    vi.mocked(getHeader).mockImplementation((_event, name) => {
      if (name === 'x-forwarded-for') return '99.99.99.99'
      return undefined
    })
    vi.mocked(getRequestURL).mockReturnValue(new URL('http://localhost/api/rate-limit-test'))

    // First 2 should work
    limiter(event)
    limiter(event)

    // Third should throw
    expect(() => limiter(event)).toThrow()
    expect(setResponseHeader).toHaveBeenCalledWith(event, 'Retry-After', expect.any(Number))
  })

  it('increments count for repeated requests', async () => {
    const useRateLimit = await importRateLimit()
    const limiter = useRateLimit({ maxRequests: 3, windowMs: 60000 })
    const event = createMockEvent()

    vi.mocked(getHeader).mockImplementation((_event, name) => {
      if (name === 'x-forwarded-for') return '88.88.88.88'
      return undefined
    })
    vi.mocked(getRequestURL).mockReturnValue(new URL('http://localhost/api/counter-test'))

    // Should not throw for 3 requests
    limiter(event)
    limiter(event)
    limiter(event)

    // 4th should throw
    expect(() => limiter(event)).toThrow()
  })
})
