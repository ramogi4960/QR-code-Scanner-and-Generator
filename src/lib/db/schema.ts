import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('qrapp.db');
// This opens (or creates, if it doesn't exist yet) a database file 
// named "qrapp.db" on the device's storage.

export function initDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action_type TEXT NOT NULL,
      source_type TEXT,
      content TEXT NOT NULL,
      image_uri TEXT,
      created_at INTEGER NOT NULL
    );
  `);
  // execSync runs the SQL immediately and waits for it to finish
  // before continuing — good for setup code that must run first.
}

export default db;