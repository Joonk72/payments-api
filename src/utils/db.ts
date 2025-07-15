import sqlite3 from 'sqlite3';
import path from 'path';

// DB 파일 경로 (루트에 payments.db)
const dbPath = path.resolve(__dirname, '../../payments.db');

// SQLite DB 인스턴스 (싱글톤)
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    // DB 연결 실패 시 에러 출력
    // eslint-disable-next-line no-console
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    // eslint-disable-next-line no-console
    console.log('Connected to SQLite database.');
  }
});

// 쿼리 실행 (Promise 래핑)
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