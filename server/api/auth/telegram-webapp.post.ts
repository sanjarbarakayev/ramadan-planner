import { validate, parse } from '@telegram-apps/init-data-node'
import { createClient } from '@supabase/supabase-js'

const checkRateLimit = useRateLimit({ maxRequests: 10, windowMs: 60_000 })

export default defineEventHandler(async (event) => {
  checkRateLimit(event)

  const body = await readBody<{ initData: string }>(event)

  if (!body.initData) {
    throw createError({ statusCode: 400, message: 'Missing initData' })
  }

  const config = useRuntimeConfig()
  const botToken = config.telegramBotToken as string

  if (!botToken) {
    throw createError({ statusCode: 500, message: 'Telegram bot token not configured' })
  }

  try {
    validate(body.initData, botToken, { expiresIn: 86400 })
  } catch {
    throw createError({ statusCode: 401, message: 'Invalid Telegram init data' })
  }

  const parsed = parse(body.initData)
  const tgUser = parsed.user

  if (!tgUser) {
    throw createError({ statusCode: 400, message: 'No user data in initData' })
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
    telegramId: tgUser.id as number,
    fullName: [tgUser.firstName, tgUser.lastName].filter(Boolean).join(' '),
    avatarUrl: (tgUser.photoUrl as string | undefined) ?? '',
  })

  return generateTelegramSession(supabase, email)
})
