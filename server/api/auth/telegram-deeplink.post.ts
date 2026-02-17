import crypto from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const checkRateLimit = useRateLimit({ maxRequests: 10, windowMs: 60_000 })

export default defineEventHandler(async (event) => {
  checkRateLimit(event)

  const config = useRuntimeConfig()
  const supabaseUrl = config.supabaseUrl as string
  const supabaseServiceKey = config.supabaseServiceKey as string
  const botUsername = config.public.telegramBotUsername as string

  if (!supabaseUrl || !supabaseServiceKey) {
    throw createError({ statusCode: 500, message: 'Supabase not configured' })
  }

  if (!botUsername) {
    throw createError({ statusCode: 500, message: 'Telegram bot not configured' })
  }

  const token = crypto.randomBytes(16).toString('hex')

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Clean up expired tokens (older than 10 minutes)
  await supabase
    .from('telegram_login_tokens')
    .delete()
    .lt('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString())

  // Insert new token
  const { error } = await supabase
    .from('telegram_login_tokens')
    .insert({ token })

  if (error) {
    throw createError({ statusCode: 500, message: 'Failed to create login token' })
  }

  return {
    token,
    deeplink: `https://t.me/${botUsername}?start=login_${token}`,
  }
})
