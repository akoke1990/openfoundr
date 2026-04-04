-- Add user_id to founder_profiles to link token-based profiles to auth accounts
ALTER TABLE founder_profiles
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS founder_profiles_user_id_idx ON founder_profiles(user_id);
