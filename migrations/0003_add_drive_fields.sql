-- Migration number: 0003    2025-05-03T00:00:00Z
ALTER TABLE users ADD COLUMN drive_refresh_token TEXT;
ALTER TABLE users ADD COLUMN drive_connected BOOLEAN NOT NULL DEFAULT FALSE; 