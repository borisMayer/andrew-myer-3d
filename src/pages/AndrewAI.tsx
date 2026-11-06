import { useState } from 'react';
import { BOOKS } from '../lib/books';

type Channel = 'Instagram' | 'Facebook' | 'TikTok' | 'YouTube' | 'Blog';
const channels: Channel[] = ['Instagram', 'Facebook', 'TikTok', 'YouTube', 'Blog'];
const card = { background: 'rgba(18,16,25,.95)', border: '1px solid rgba(180,155,90,.22)', borderRadius: 8, padding: 20, marginBottom: 16 };
const field = { background: '#181720', color: '#f0e9da', border: '1px solid #645c4b', borderRadius: 5, padding: 10, width: '100%', boxSizing: 'border-box' as const };
export default function AndrewAI() {
  const [id, setId] = useState(BOOKS[0]?.id ?? '');
  const [lang, setLang] = useState<'es'|'en'>('es');
  const [channel, setChannel] = useState<Channel>('Instagram');
  const [angle, setAngle] = useState('');
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);
  const book = BOOKS.find(b => b.id === id);
  function prepare() {
    if (!book) return;
    const title = lang === 'es' ? book.titleEs : book.titleEn;
    const description = lang === 'es' ? book.description : (book.descriptionEn || book.description);
    const heading = angle.trim() || (lang === 'es' ? 'Una lectura para descubrir' : 'A book worth exploring');
    const cta = lang === 'es' ? 'Descubre esta obra en la página oficial del autor.' : 'Discover this book on the author’s official website.';
    setDraft([heading, '', title, '', description.slice(0, 380), '', cta, '', book.amazonUrl, '', lang === 'es' ? '[Revisar contenido y enlace antes de publicar]' : '[Review content and link before publishing]'].join('\n'));
    setCopied(false);
  }
  return <section style={{ color: '#e8dfcf' }}>
    <p style={{ letterSpacing: 3, color: '#b49b5a', fontSize: 11 }}>EDITORIAL INTELLIGENCE · V1</p>
    <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 30, fontWeight: 400 }}>Andrew Myer AI</h2>
    <p style={{ color: '#aba49a' }}>Estudio editorial privado. Borradores locales sin IA externa, publicidad de pago ni publicación automática.</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, margin: '22px 0' }}>
      {([['Obras en catálogo', String(BOOKS.length)], ['Gasto publicitario', 'US$0'], ['Publicación', 'Manual'], ['Ventas Amazon', 'No conectadas']] as const).map(([a,b]) => <div key={a} style={card}><small style={{ color: '#a8a19a' }}>{a}</small><div style={{ fontSize: 21, marginTop: 8 }}>{b}</div></div>)}
    </div>
    <div style={card}>
      <h3>Preparar contenido para redes</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
        <label>Libro<select aria-label="Libro" style={field} value={id} onChange={e=>setId(e.target.value)}>{BOOKS.map(b=><option key={b.id} value={b.id}>{b.titleEs}</option>)}</select></label>
        <label>Canal<select aria-label="Canal" style={field} value={channel} onChange={e=>setChannel(e.target.value as Channel)}>{channels.map(c=><option key={c}>{c}</option>)}</select></label>
        <label>Idioma<select aria-label="Idioma" style={field} value={lang} onChange={e=>setLang(e.target.value as 'es'|'en')}><option value="es">Español</option><option value="en">English</option></select></label>
      </div>
      <label style={{ display: 'block', marginTop: 16 }}>Tema o enfoque<input style={field} value={angle} onChange={e=>setAngle(e.target.value)} placeholder="Reflexión, pregunta, público..." /></label>
      <button type="button" onClick={prepare} style={{ ...field, width: 'auto', marginTop: 14, cursor: 'pointer', color: '#e3c784' }}>Preparar borrador</button>
      {draft && <div style={{ marginTop: 18 }}>
        <label htmlFor="am-ai-draft">Borrador editable · {channel}</label>
        <textarea id="am-ai-draft" style={{ ...field, display: 'block', marginTop: 8, lineHeight: 1.6 }} rows={12} value={draft} onChange={e=>{setDraft(e.target.value);setCopied(false);}} />
        <button type="button" onClick={async()=>{try{await navigator.clipboard.writeText(draft);setCopied(true);}catch{setCopied(false);}}} style={{ ...field, width: 'auto', marginTop: 12, cursor: 'pointer' }}>{copied?'Copiado':'Copiar texto'}</button>
      </div>}
    </div>
    <p style={{ color: '#aba49a', fontSize: 12 }}>Próximas fases: enlaces ASIN por libro, calendario persistente, importación KDP y aprobación editorial. No se atribuyen ventas a clics sin evidencia.</p>
  </section>;
}
