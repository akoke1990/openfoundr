-- Store workspace conversation so users can return to it
ALTER TABLE founder_profiles
  ADD COLUMN IF NOT EXISTS workspace_messages JSONB,
  ADD COLUMN IF NOT EXISTS formation_date DATE;
