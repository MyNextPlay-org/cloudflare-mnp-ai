-- Migration number: 0004    2025-05-08T00:00:00Z
CREATE TABLE IF NOT EXISTS user_drives (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL REFERENCES users(email),
  drive_id TEXT NOT NULL,
  name TEXT NOT NULL,
  file_count INTEGER NOT NULL DEFAULT 0,
  last_synced_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT (datetime('now'))
); 