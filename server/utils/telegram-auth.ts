import type { SupabaseClient } from '@supabase/supabase-js'

interface TelegramUserMeta {
  readonly telegramId: number
  readonly fullName: string
  readonly avatarUrl: string
}

export async function findOrCreateTelegramUser(
  supabase: SupabaseClient,
  meta: TelegramUserMeta,
): Promise<string> {
  const email = `tg_${meta.telegramId}@telegram.local`

  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const exists = existingUsers?.users?.some((u) => u.email === email)

  if (!exists) {
    const { error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        telegram_id: meta.telegramId,
        full_name: meta.fullName,
        avatar_url: meta.avatarUrl,
        provider: 'telegram',
      },
    })

    if (error) {
      throw createError({
        statusCode: 500,
        message: `Failed to create user: ${error.message}`,
      })
    }
  }

  return email
}

export async function generateTelegramSession(
  supabase: SupabaseClient,
  email: string,
): Promise<{ readonly token_hash: string; readonly email: string }> {
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
  })

  if (linkError || !linkData?.properties?.hashed_token) {
    throw createError({
      statusCode: 500,
      message: `Failed to generate session: ${linkError?.message}`,
    })
  }

  return {
    token_hash: linkData.properties.hashed_token,
    email,
  }
}
