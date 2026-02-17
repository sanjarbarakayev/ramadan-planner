import crypto from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

interface TelegramUpdate {
  readonly update_id: number
  readonly message?: {
    readonly message_id: number
    readonly from: {
      readonly id: number
      readonly first_name: string
      readonly last_name?: string
      readonly username?: string
    }
    readonly chat: {
      readonly id: number
      readonly type: string
    }
    readonly text?: string
  }
}

function verifyWebhookSecret(event: Parameters<typeof defineEventHandler>[0] extends (e: infer E) => unknown ? E : never, secret: string): boolean {
  const headerToken = getHeader(event, 'x-telegram-bot-api-secret-token')
  return headerToken === secret
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const botToken = config.telegramBotToken as string
  const webhookSecret = config.telegramWebhookSecret as string

  if (!botToken) {
    throw createError({ statusCode: 500, message: 'Bot token not configured' })
  }

  // Verify webhook secret if configured
  if (webhookSecret && !verifyWebhookSecret(event, webhookSecret)) {
    throw createError({ statusCode: 403, message: 'Invalid webhook secret' })
  }

  const update = await readBody<TelegramUpdate>(event)
  const message = update?.message

  if (!message?.text || !message.from) {
    return { ok: true }
  }

  const text = message.text.trim()

  // Handle /start login_TOKEN
  if (text.startsWith('/start login_')) {
    const token = text.replace('/start login_', '').trim()

    if (!token) {
      await sendTelegramMessage(botToken, message.chat.id, 'Invalid login token.')
      return { ok: true }
    }

    const supabaseUrl = config.supabaseUrl as string
    const supabaseServiceKey = config.supabaseServiceKey as string

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Check if token exists and is pending
    const { data: row } = await supabase
      .from('telegram_login_tokens')
      .select('token, telegram_user_id')
      .eq('token', token)
      .single()

    if (!row) {
      await sendTelegramMessage(botToken, message.chat.id, 'Login link expired. Please try again.')
      return { ok: true }
    }

    if (row.telegram_user_id) {
      await sendTelegramMessage(botToken, message.chat.id, 'This login was already confirmed.')
      return { ok: true }
    }

    // Confirm the login token
    const { error } = await supabase
      .from('telegram_login_tokens')
      .update({
        telegram_user_id: message.from.id,
        telegram_data: {
          first_name: message.from.first_name,
          last_name: message.from.last_name,
          username: message.from.username,
        },
      })
      .eq('token', token)

    if (error) {
      await sendTelegramMessage(botToken, message.chat.id, 'Login failed. Please try again.')
      return { ok: true }
    }

    await sendTelegramMessage(
      botToken,
      message.chat.id,
      `Login confirmed! You can now close Telegram and return to the app.`,
    )

    return { ok: true }
  }

  // Handle regular /start
  if (text === '/start') {
    await sendTelegramMessage(
      botToken,
      message.chat.id,
      `Welcome to Ramadan Planner! Visit sanjar-ramadan-planner.vercel.app to use the app.`,
    )
    return { ok: true }
  }

  return { ok: true }
})

async function sendTelegramMessage(botToken: string, chatId: number, text: string): Promise<void> {
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  })
}
