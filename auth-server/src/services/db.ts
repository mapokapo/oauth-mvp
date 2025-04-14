// src/services/db.ts
import { Database } from "bun:sqlite";

// Opens (or creates) ./data/db.sqlite
export const db = new Database();

// Auto‑migrate on import
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    sub           TEXT PRIMARY KEY,
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS auth_codes (
    code           TEXT PRIMARY KEY,
    code_challenge TEXT NOT NULL,
    client_id      TEXT NOT NULL,
    redirect_uri   TEXT NOT NULL,
    sub            TEXT NOT NULL,
    created_at     INTEGER NOT NULL DEFAULT (strftime('%s','now'))
  );
`);
