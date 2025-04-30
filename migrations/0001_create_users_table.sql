-- Migration number: 0001 	 2025-03-27T21:41:11.183Z
CREATE TABLE IF NOT EXISTS users (
  email TEXT PRIMARY KEY,
  token TEXT UNIQUE,
  magic_token TEXT UNIQUE,
  magic_token_expires_at TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  registered BOOLEAN NOT NULL DEFAULT FALSE
);