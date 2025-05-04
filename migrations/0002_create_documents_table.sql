-- Migration number: 0002    2025-05-03T00:00:00Z
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT (datetime('now')),
  drive_file_id TEXT,
  drive_connected BOOLEAN NOT NULL DEFAULT FALSE
); 