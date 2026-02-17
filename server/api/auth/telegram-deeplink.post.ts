import crypto from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const checkRateLimit = useRateLimit({ maxRequests: 10, windowMs: 60_000 })

export default defineEventHandler(async (event) => {
  try {
    checkRateLimit(event)

    const config = useRuntimeConfig()
    const supabaseUrl = config.supabaseUrl as string
    const supabaseServiceKey = config.supabaseServiceKey as string
    const botUsername = config.public.telegramBotUsername as string

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(`Supabase not configured: url=${!!supabaseUrl}, key=${!!supabaseServiceKey}`)
    }

    if (!botUsername) {
      throw new Error('TELEGRAM_BOT_USERNAME not configured')
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
      throw new Error(`DB insert failed: ${error.message} (code: ${error.code})`)
    }

    return {
      token,
      deeplink: `https://t.me/${botUsername}?start=login_${token}`,
    }
  }
  catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    // Return error as JSON response so it's visible in production
    setResponseStatus(event, 500)
    return { error: true, message }
  }
})
