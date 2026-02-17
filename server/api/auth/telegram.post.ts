import crypto from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

interface TelegramAuthData {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

function verifyTelegramHash(data: TelegramAuthData, botToken: string): boolean {
  const secret = crypto.createHash('sha256').update(botToken).digest()

  const checkString = Object.entries(data)
    .filter(([key]) => key !== 'hash')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex')

  return hmac === data.hash
}

const checkRateLimit = useRateLimit({ maxRequests: 5, windowMs: 60_000 })

export default defineEventHandler(async (event) => {
  checkRateLimit(event)

  const body = await readBody<TelegramAuthData>(event)

  if (!body.id || !body.hash || !body.auth_date) {
    throw createError({ statusCode: 400, message: 'Invalid Telegram auth data' })
  }

  const config = useRuntimeConfig()
  const botToken = config.telegramBotToken as string

  if (!botToken) {
    throw createError({ statusCode: 500, message: 'Telegram bot token not configured' })
  }

  if (!verifyTelegramHash(body, botToken)) {
    throw createError({ statusCode: 401, message: 'Invalid Telegram auth signature' })
  }

  const maxAge = 3600
  if (Math.floor(Date.now() / 1000) - body.auth_date > maxAge) {
    throw createError({ statusCode: 401, message: 'Telegram auth data expired' })
  }

  const supabaseUrl = config.supabaseUrl as string
  const supabaseServiceKey = config.supabaseServiceKey as string

  if (!supabaseUrl || !supabaseServiceKey) {
    throw createError({ statusCode: 500, message: 'Supabase not configured' })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const email = await findOrCreateTelegramUser(supabase, {
    telegramId: body.id,
    fullName: [body.first_name, body.last_name].filter(Boolean).join(' '),
    avatarUrl: body.photo_url ?? '',
  })

  return generateTelegramSession(supabase, email)
})
