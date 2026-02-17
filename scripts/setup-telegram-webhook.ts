/**
 * One-time setup script for Telegram deep link login.
 * Run with: npx tsx scripts/setup-telegram-webhook.ts
 *
 * Prerequisites:
 * - TELEGRAM_BOT_TOKEN in .env
 * - SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 *
 * This script:
 * 1. Creates the telegram_login_tokens table in Supabase
 * 2. Registers the Telegram webhook
 */
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config()

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const WEBHOOK_URL = 'https://sanjar-ramadan-planner.vercel.app/api/telegram/webhook'
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET || ''

async function main() {
  if (!TELEGRAM_BOT_TOKEN || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing required environment variables')
    process.exit(1)
  }

  // Step 1: Create table in Supabase
  console.log('Creating telegram_login_tokens table...')
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { error: sqlError } = await supabase.rpc('exec_sql', {
    query: `
      CREATE TABLE IF NOT EXISTS telegram_login_tokens (
        token TEXT PRIMARY KEY,
        telegram_user_id BIGINT,
        telegram_data JSONB,
        created_at TIMESTAMPTZ DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_telegram_login_tokens_created ON telegram_login_tokens(created_at);
      ALTER TABLE telegram_login_tokens ENABLE ROW LEVEL SECURITY;
    `,
  }).catch(() => ({ error: { message: 'RPC not available' } })) as { error: { message: string } | null }

  if (sqlError) {
    console.log('Could not create table via RPC. Please run the SQL manually in Supabase Dashboard:')
    console.log('  Go to: SQL Editor > New Query')
    console.log('  Paste the contents of: supabase/migrations/004_telegram_login_tokens.sql')
    console.log()
  }
  else {
    console.log('Table created successfully!')
  }

  // Step 2: Register Telegram webhook
  console.log('Registering Telegram webhook...')

  const params: Record<string, string> = { url: WEBHOOK_URL }
  if (WEBHOOK_SECRET) {
    params.secret_token = WEBHOOK_SECRET
  }

  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    },
  )

  const result = await response.json() as { ok: boolean; description?: string }

  if (result.ok) {
    console.log(`Webhook registered: ${WEBHOOK_URL}`)
  }
  else {
    console.error('Failed to register webhook:', result.description)
  }

  // Step 3: Verify
  console.log('\nVerifying setup...')
  const infoResponse = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`,
  )
  const info = await infoResponse.json() as { result?: { url?: string } }
  console.log('Webhook URL:', info.result?.url || 'not set')
  console.log('\nSetup complete!')
}

main().catch(console.error)
