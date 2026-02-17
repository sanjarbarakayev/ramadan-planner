-- Temporary tokens for Telegram deep link login flow
CREATE TABLE IF NOT EXISTS telegram_login_tokens (
  token TEXT PRIMARY KEY,
  telegram_user_id BIGINT,
  telegram_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-cleanup old tokens (older than 10 minutes)
CREATE INDEX idx_telegram_login_tokens_created ON telegram_login_tokens(created_at);

-- RLS: only service role can access this table
ALTER TABLE telegram_login_tokens ENABLE ROW LEVEL SECURITY;
