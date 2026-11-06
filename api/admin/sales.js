import sql from '../_lib/db.js';



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
export async function editorialHandler(req,res) {
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

import { neon } from '@neondatabase/serverless';
import { verifyToken } from '../_lib/auth.js';

function makeToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2,'0')).join('');
}

async function sendEmail(to, name, title, dlUrl, apiKey) {
  if (!apiKey) return;
  const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `Andrew Myer <${fromEmail}>`,
      to: [to],
      reply_to: 'bmayer.rojel@gmail.com',
      subject: `📄 Tu libro: ${title}`,
      html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;background:#09080d;color:#ddd;padding:2rem">
        <h2 style="color:#c9a227;font-weight:400">¡Tu compra fue procesada!</h2>
        <p>${name ? `Hola ${name},` : 'Hola,'} tu pago fue confirmado.</p>
        <div style="background:rgba(180,155,90,0.08);border-left:3px solid #c9a227;padding:1rem;margin:1rem 0">
          <p style="color:#e8e2d5">${title}</p>
        </div>
        <a href="${dlUrl}" style="display:inline-block;padding:.9rem 2rem;background:rgba(180,155,90,0.2);border:1px solid rgba(180,155,90,0.5);border-radius:3px;color:#c9a227;text-decoration:none;margin:1rem 0">
          📄 Descargar PDF
        </a>
        <p style="font-size:.8rem;color:rgba(140,135,125,.6)">Enlace válido 30 días.</p>
      </div>`,
    }),
  }).catch(e => console.error('[email]', e.message));
}

export default async function handler(req, res) {
  if (req.query?.mode === 'editorial' || req.url?.includes('mode=editorial')) return editorialHandler(req,res);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  // Auth
  try {
    const auth = req.headers['authorization'] || '';
    await verifyToken(auth.replace('Bearer ', '').trim());
  } catch { return res.status(401).json({ error: 'No autorizado' }); }

  const sql = neon(process.env.DATABASE_URL);

  // GET — list all sales
  if (req.method === 'GET') {
    try {
      const sales = await sql`
        SELECT s.*, b.title_es
        FROM am_sales s JOIN am_books b ON b.id = s.book_id
        ORDER BY s.created_at DESC LIMIT 100
      `;
      return res.status(200).json({ sales });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  // POST — recover PENDING sales by querying MP directly
  if (req.method === 'POST') {
    const APP_URL = process.env.VITE_APP_URL || 'https://andrewmyer.com';

    const pending = await sql`
      SELECT s.id, s.buyer_email, s.buyer_name, b.title_es
      FROM am_sales s JOIN am_books b ON b.id = s.book_id
      WHERE s.status = 'PENDING'
      ORDER BY s.created_at DESC LIMIT 20
    `;

    if (!pending.length) return res.status(200).json({ ok: true, message: 'Sin ventas PENDING', recovered: 0 });

    const results = [];
    for (const sale of pending) {
      const r = { id: sale.id, email: sale.buyer_email, book: sale.title_es };
      try {
        // Search MP by external_reference = saleId
        const mpRes = await fetch(
          `https://api.mercadopago.com/v1/payments/search?external_reference=${sale.id}&sort=date_created&criteria=desc&limit=1`,
          { headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` } }
        );
        const mpData = await mpRes.json();
        const payment = (mpData.results || [])[0];

        if (!payment) { r.status = 'NOT_FOUND_IN_MP'; results.push(r); continue; }

        r.mp_status = payment.status;
        r.mp_id = payment.id;

        if (payment.status === 'approved') {
          const token = makeToken();
          const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          await sql`UPDATE am_sales SET status='APPROVED', mp_payment_id=${String(payment.id)}, download_token=${token}, download_expires_at=${expires.toISOString()} WHERE id=${sale.id}`;
          const dlUrl = `${APP_URL}/api/payment/download?token=${token}`;
          await sendEmail(sale.buyer_email, sale.buyer_name, sale.title_es, dlUrl, process.env.RESEND_API_KEY);
          r.status = 'RECOVERED_APPROVED';
          r.download_url = dlUrl;
        } else if (['rejected','cancelled'].includes(payment.status)) {
          await sql`UPDATE am_sales SET status='REJECTED', mp_payment_id=${String(payment.id)} WHERE id=${sale.id}`;
          r.status = 'RECOVERED_REJECTED';
        } else {
          r.status = 'STILL_PENDING';
        }
      } catch(e) { r.status = 'ERROR'; r.error = e.message; }
      results.push(r);
    }

    const recovered = results.filter(r => r.status === 'RECOVERED_APPROVED').length;
    return res.status(200).json({ ok: true, recovered, total: pending.length, results });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
