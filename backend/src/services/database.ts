/**
 * Base de données SQLite — EventHub
 *
 * Ce fichier gère la connexion et le schéma de la base SQLite.
 * better-sqlite3 est synchrone (pas de callback/async) — plus simple
 * pour un serveur Express en Node.js.
 *
 * Schéma des tables :
 * - users       : comptes utilisateurs
 * - events      : événements billetterie
 * - tickets     : billets achetés
 * - schema_migrations : historique des migrations appliquées
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// =============================================================================
// CONNEXION À LA BASE
// =============================================================================

/**
 * Chemin de la base SQLite — dans le dossier backend/data/
 * Créé automatiquement si absent.
 */
const DB_DIR = path.join(__dirname, '../../data');
const DB_PATH = path.join(DB_DIR, 'eventhub.db');

// Import dynamique pour créer le répertoire avant d'ouvrir la DB
import fs from 'fs';
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

import type { Database } from 'better-sqlite3';

const db: Database = new Database(DB_PATH);

// Mode WAL pour de meilleures performances en lecture concurrence
db.pragma('journal_mode = WAL');

// foreign_keys active les contraintes de clé étrangère
db.pragma('foreign_keys = ON');

// =============================================================================
// INITIALISATION DU SCHÉMA
// =============================================================================

db.exec(`
  -- Table des utilisateurs
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  -- Table des événements
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    price REAL NOT NULL,
    total_places INTEGER NOT NULL,
    available_places INTEGER NOT NULL,
    category TEXT NOT NULL,
    image TEXT,
    organizer_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (organizer_id) REFERENCES users(id)
  );

  -- Table des billets
  CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    qr_code TEXT NOT NULL UNIQUE,
    event_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'valid',
    purchase_date TEXT NOT NULL,
    used_at TEXT,
    cancelled_at TEXT,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- Table de suivi des migrations (pour références futures)
  CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL
  );
`);

// =============================================================================
// EXPORTS
// =============================================================================

export default db;