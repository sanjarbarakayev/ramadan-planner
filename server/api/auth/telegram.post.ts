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

export default defineEventHandler(async (event) => {
  const body = await readBody<TelegramAuthData>(event)

  if (!body.id || !body.hash || !body.auth_date) {
    throw createError({ statusCode: 400, message: 'Invalid Telegram auth data' })
  }

  const config = useRuntimeConfig()
  const botToken = config.telegramBotToken as string

  if (!botToken) {
    throw createError({ statusCode: 500, message: 'Telegram bot token not configured' })
  }

  // Verify hash signature
  if (!verifyTelegramHash(body, botToken)) {
    throw createError({ statusCode: 401, message: 'Invalid Telegram auth signature' })
  }

  // Reject stale auth data (older than 1 hour)
  const maxAge = 3600
  if (Math.floor(Date.now() / 1000) - body.auth_date > maxAge) {
    throw createError({ statusCode: 401, message: 'Telegram auth data expired' })
  }

  // Create admin Supabase client
  const supabaseUrl = config.supabaseUrl as string
  const supabaseServiceKey = config.supabaseServiceKey as string

  if (!supabaseUrl || !supabaseServiceKey) {
    throw createError({ statusCode: 500, message: 'Supabase not configured' })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const syntheticEmail = `tg_${body.id}@telegram.local`

  // Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const existingUser = existingUsers?.users?.find((u) => u.email === syntheticEmail)

  if (!existingUser) {
    // Create new user
    const { error: createError_ } = await supabase.auth.admin.createUser({
      email: syntheticEmail,
      email_confirm: true,
      user_metadata: {
        telegram_id: body.id,
        full_name: [body.first_name, body.last_name].filter(Boolean).join(' '),
        avatar_url: body.photo_url ?? '',
        provider: 'telegram',
      },
    })

    if (createError_) {
      throw createError({ statusCode: 500, message: `Failed to create user: ${createError_.message}` })
    }
  }

  // Generate magic link for sign-in
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: syntheticEmail,
  })

  if (linkError || !linkData?.properties?.hashed_token) {
    throw createError({ statusCode: 500, message: `Failed to generate session: ${linkError?.message}` })
  }

  return {
    token_hash: linkData.properties.hashed_token,
    email: syntheticEmail,
  }
})
