import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
export default sql;

export async function initTables() {
  await sql`CREATE TABLE IF NOT EXISTS am_books (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    slug TEXT UNIQUE NOT NULL,
    title_es TEXT NOT NULL,
    title_en TEXT NOT NULL DEFAULT '',
    subtitle_es TEXT,
    subtitle_en TEXT,
    description_es TEXT NOT NULL DEFAULT '',
    description_en TEXT NOT NULL DEFAULT '',
    cover_url TEXT,
    pdf_url TEXT,
    isbn TEXT,
    year INT,
    is_published BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS am_prices (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    book_id TEXT REFERENCES am_books(id) ON DELETE CASCADE,
    currency TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(book_id, currency)
  )`;
  await sql`CREATE TABLE IF NOT EXISTS am_sales (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    book_id TEXT REFERENCES am_books(id),
    buyer_email TEXT NOT NULL,
    buyer_name TEXT,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING',
    mp_preference_id TEXT,
    mp_payment_id TEXT,
    download_token TEXT UNIQUE,
    download_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS am_admin (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`;
}
