-- Migration number: 0005    2025-05-08T00:00:00Z
ALTER TABLE documents
  ADD COLUMN drive_id TEXT; 