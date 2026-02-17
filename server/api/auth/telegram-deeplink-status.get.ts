import { createClient } from '@supabase/supabase-js'

const checkRateLimit = useRateLimit({ maxRequests: 60, windowMs: 60_000 })

export default defineEventHandler(async (event) => {
  checkRateLimit(event)

  const query = getQuery(event)
  const token = query.token as string

  if (!token || typeof token !== 'string') {
    throw createError({ statusCode: 400, message: 'Token required' })
  }

  const config = useRuntimeConfig()
  const supabaseUrl = config.supabaseUrl as string
  const supabaseServiceKey = config.supabaseServiceKey as string

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: row } = await supabase
    .from('telegram_login_tokens')
    .select('telegram_user_id, telegram_data')
    .eq('token', token)
    .single()

  if (!row) {
    throw createError({ statusCode: 404, message: 'Token not found or expired' })
  }

  // Not yet confirmed by webhook
  if (!row.telegram_user_id) {
    return { status: 'pending' }
  }

  // Confirmed - create session
  const telegramData = row.telegram_data as { first_name?: string; last_name?: string; photo_url?: string }

  const email = await findOrCreateTelegramUser(supabase, {
    telegramId: row.telegram_user_id,
    fullName: [telegramData?.first_name, telegramData?.last_name].filter(Boolean).join(' '),
    avatarUrl: telegramData?.photo_url ?? '',
  })

  const session = await generateTelegramSession(supabase, email)

  // Clean up the used token
  await supabase
    .from('telegram_login_tokens')
    .delete()
    .eq('token', token)

  return {
    status: 'confirmed',
    token_hash: session.token_hash,
  }
})
