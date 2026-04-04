-- Add missing fields used by save routes + document vault
-- Safe to run multiple times (IF NOT EXISTS / IF column doesn't exist)

-- Fields the save routes already write but weren't in the original schema
ALTER TABLE founder_profiles
  ADD COLUMN IF NOT EXISTS user_id          UUID        REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS formation_date   DATE,
  ADD COLUMN IF NOT EXISTS reminders_enabled BOOLEAN    DEFAULT true,
  ADD COLUMN IF NOT EXISTS workspace_messages JSONB,
  -- Document vault: stores generated docs from both results page and workspace
  -- Shape: [{ id, type, title, content, created_at }]
  ADD COLUMN IF NOT EXISTS documents        JSONB       DEFAULT '[]'::jsonb;

-- Index for user_id lookups (dashboard)
CREATE INDEX IF NOT EXISTS founder_profiles_user_id_idx ON founder_profiles (user_id);

-- Upsert by user_id when logged in (workspace load/save for authenticated users)
-- The existing unique constraint on email handles the anon save flow
