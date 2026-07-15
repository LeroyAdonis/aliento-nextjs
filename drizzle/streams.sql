-- Migration: Add stream column for multi-stream support
-- Adds 'stream' text column with default 'consult' for backwards compatibility

ALTER TABLE payments ADD COLUMN IF NOT EXISTS stream TEXT NOT NULL DEFAULT 'consult';
ALTER TABLE questionnaires ADD COLUMN IF NOT EXISTS stream TEXT NOT NULL DEFAULT 'consult';
