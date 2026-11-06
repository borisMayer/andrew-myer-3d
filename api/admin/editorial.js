import sql from '../_lib/db.js';
import { verifyToken } from '../_lib/auth.js';

const STATUSES = new Set(['draft','review','approved','done']);
const CHANNELS = new Set(['Instagram','Facebook','TikTok','YouTube','Blog']);
const LANGUAGES = new Set(['es','en']);
const AGENTS = new Set(['strategy','editorial','seo','social','sales','analytics','quality']);
async function authorized(req) {
  if (!process.env.ADMIN_SECRET || process.env.ADMIN_SECRET === 'fallback-secret-change-me') return false;
  const value = req.headers.authorization || '';
  if (!value.startsWith('Bearer ')) return false;
  try { const payload = await verifyToken(value.slice(7)); return payload.role === 'admin'; } catch { return false; }
}
function validTask(t) {
  return t && typeof t === 'object' && typeof t.id === 'string' && t.id.length <= 120 &&
    typeof t.bookId === 'string' && t.bookId.length <= 120 &&
    typeof t.title === 'string' && t.title.length <= 300 &&
    typeof t.content === 'string' && t.content.length <= 15000 &&
    /^\d{4}-\d{2}-\d{2}$/.test(t.scheduledDate || '') &&
    STATUSES.has(t.status) && CHANNELS.has(t.channel) &&
    LANGUAGES.has(t.language) && AGENTS.has(t.agent);
}
export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  if (!(await authorized(req))) return res.status(401).json({error:'Unauthorized'});
  if (!['GET','PUT'].includes(req.method)) return res.status(405).json({error:'Method not allowed'});
  try {
    await sql`CREATE TABLE IF NOT EXISTS am_editorial_tasks (
      id TEXT PRIMARY KEY, book_id TEXT NOT NULL, agent TEXT NOT NULL,
      channel TEXT NOT NULL, language TEXT NOT NULL, title TEXT NOT NULL,
      content TEXT NOT NULL, status TEXT NOT NULL, scheduled_date DATE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;
    if (req.method === 'GET') {
      const rows = await sql`SELECT id,book_id,agent,channel,language,title,content,status,
        to_char(scheduled_date,'YYYY-MM-DD') AS scheduled_date,
        created_at,updated_at FROM am_editorial_tasks ORDER BY scheduled_date,id LIMIT 1000`;
      return res.status(200).json({tasks:rows.map(r=>({
        id:r.id,bookId:r.book_id,agent:r.agent,channel:r.channel,language:r.language,
        title:r.title,content:r.content,status:r.status,scheduledDate:r.scheduled_date,
        createdAt:r.created_at,updatedAt:r.updated_at
      }))});
    }
    const tasks=req.body?.tasks;
    if (!Array.isArray(tasks)||tasks.length>1000||!tasks.every(validTask)) return res.status(400).json({error:'Invalid tasks'});
    const ids=new Set(tasks.map(t=>t.id));
    if(ids.size!==tasks.length)return res.status(400).json({error:'Duplicate task IDs'});
    // Upsert the submitted tasks without deleting other users' existing data.
    for(const t of tasks) {
      await sql`INSERT INTO am_editorial_tasks
        (id,book_id,agent,channel,language,title,content,status,scheduled_date)
        VALUES (${t.id},${t.bookId},${t.agent},${t.channel},${t.language},${t.title},${t.content},${t.status},${t.scheduledDate}::date)
        ON CONFLICT(id) DO UPDATE SET book_id=EXCLUDED.book_id,agent=EXCLUDED.agent,
        channel=EXCLUDED.channel,language=EXCLUDED.language,title=EXCLUDED.title,
        content=EXCLUDED.content,status=EXCLUDED.status,scheduled_date=EXCLUDED.scheduled_date,
        updated_at=NOW()`;
    }
    return res.status(200).json({ok:true,saved:tasks.length});
  } catch {
    return res.status(500).json({error:'Database operation failed'});
  }
}
