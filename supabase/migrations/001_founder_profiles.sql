-- OpenFounder: founder profile persistence
-- Run this in Supabase SQL Editor (supabase.com → your project → SQL Editor)

CREATE TABLE IF NOT EXISTS founder_profiles (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  token             TEXT        UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  email             TEXT        UNIQUE NOT NULL,
  profile           JSONB       NOT NULL,
  package           JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fast lookup by token (return visits)
CREATE INDEX IF NOT EXISTS founder_profiles_token_idx ON founder_profiles (token);

-- Auto-update updated_at on changes
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER founder_profiles_updated_at
  BEFORE UPDATE ON founder_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
