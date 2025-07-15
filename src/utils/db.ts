import sqlite3 from 'sqlite3';
import path from 'path';

// DB file path (payments.db in root)
const dbPath = path.resolve(__dirname, '../../payments.db');

// SQLite DB instance (singleton)
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    // Log error if DB connection fails
    // eslint-disable-next-line no-console
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    // eslint-disable-next-line no-console
    console.log('Connected to SQLite database.');
  }
});

// Query execution (Promise wrapper)
export function run(sql: string, params: any[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
}

export function get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row as T);
    });
  });
}

export function all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
} 