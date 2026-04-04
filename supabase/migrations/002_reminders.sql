-- OpenFounder: deadline reminders
-- Run this in Supabase SQL Editor after 001_founder_profiles.sql

-- Add formation date + reminders opt-in to existing profiles table
ALTER TABLE founder_profiles
  ADD COLUMN IF NOT EXISTS formation_date DATE,
  ADD COLUMN IF NOT EXISTS reminders_enabled BOOLEAN NOT NULL DEFAULT true;

-- One row per (profile × deadline date × send window)
-- e.g. Q1 tax 30 days out AND Q1 tax 7 days out are two separate rows
CREATE TABLE IF NOT EXISTS reminders (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id        UUID        NOT NULL REFERENCES founder_profiles(id) ON DELETE CASCADE,
  email             TEXT        NOT NULL,
  type              TEXT        NOT NULL,   -- 'q1_estimated_tax', 'annual_report_texas', etc.
  label             TEXT        NOT NULL,   -- human-readable: 'Q1 Estimated Tax Payment'
  due_date          DATE        NOT NULL,
  details           TEXT,
  fee               TEXT,
  link              TEXT,
  send_days_before  INT         NOT NULL,   -- 30 or 7
  sent_at           TIMESTAMPTZ,            -- null = pending
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cron query: WHERE due_date = CURRENT_DATE + send_days_before AND sent_at IS NULL
CREATE INDEX IF NOT EXISTS reminders_pending_idx
  ON reminders (due_date, send_days_before)
  WHERE sent_at IS NULL;

CREATE INDEX IF NOT EXISTS reminders_profile_idx
  ON reminders (profile_id);
