import { db, run } from '../utils/db';

const createPaymentsTable = `
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  total REAL NOT NULL,
  record_type TEXT CHECK (record_type IN ('invoice','bill','none')) NOT NULL,
  status TEXT CHECK (status IN ('pending','void','completed')) NOT NULL,
  create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  modified_date DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

async function migrate() {
  try {
    await run(createPaymentsTable);
    // eslint-disable-next-line no-console
    console.log('Migration complete: payments table created.');
    db.close();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Migration failed:', err);
    db.close();
    process.exit(1);
  }
}

migrate(); 