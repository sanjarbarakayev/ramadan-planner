import type { H3Event } from 'h3'

interface RateLimitEntry {
  readonly count: number
  readonly resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanup(): void {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) {
      store.delete(key)
    }
  }
}

function getClientIp(event: H3Event): string {
  const forwarded = getHeader(event, 'x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? 'unknown'
  }
  return getHeader(event, 'x-real-ip') || 'unknown'
}

export function useRateLimit(options: {
  readonly maxRequests: number
  readonly windowMs: number
}): (event: H3Event) => void {
  const { maxRequests, windowMs } = options

  return (event: H3Event): void => {
    cleanup()

    const ip = getClientIp(event)
    const path = getRequestURL(event).pathname
    const key = `${ip}:${path}`
    const now = Date.now()

    const existing = store.get(key)

    if (!existing || existing.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + windowMs })
      return
    }

    if (existing.count >= maxRequests) {
      const retryAfterSec = Math.ceil((existing.resetAt - now) / 1000)
      setResponseHeader(event, 'Retry-After', retryAfterSec)
      throw createError({
        statusCode: 429,
        message: 'Too many requests. Please try again later.',
      })
    }

    store.set(key, { ...existing, count: existing.count + 1 })
  }
}
