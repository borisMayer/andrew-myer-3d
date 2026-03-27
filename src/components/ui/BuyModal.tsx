/**
 * BuyModal — Compra directa con Mercado Pago
 * Se monta sobre el sitio 3D, llama al backend Next.js de pagina-libros-autor
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import type { Book } from '../../lib/books';

// ─── Config ──────────────────────────────────────────────────────────────────
const BACKEND_URL = 'https://pagina-libros-autor.vercel.app';

// Book ID map: local slug → DB cuid (set via admin panel of pagina-libros-autor)
// These get overridden dynamically from the catalog API
let BOOK_ID_MAP: Record<string, string> = {};

interface CatalogBook {
  id:      string;
  slug:    string;
  titleEs: string;
  prices:  { currency: string; amount: number }[];
}

interface BuyModalProps {
  book:    Book;
  onClose: () => void;
}

const CURRENCIES = [
  { code: 'CLP', label: 'CLP — Peso chileno',    symbol: '$',  flag: '🇨🇱' },
  { code: 'ARS', label: 'ARS — Peso argentino',  symbol: '$',  flag: '🇦🇷' },
  { code: 'USD', label: 'USD — Dólar',           symbol: 'US$',flag: '🇺🇸' },
];

export default function BuyModal({ book, onClose }: BuyModalProps) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const [step,      setStep]      = useState<'form'|'loading'|'error'>('form');
  const [email,     setEmail]     = useState('');
  const [name,      setName]      = useState('');
  const [currency,  setCurrency]  = useState('CLP');
  const [error,     setError]     = useState('');
  const [dbBookId,  setDbBookId]  = useState<string|null>(null);
  const [price,     setPrice]     = useState<number|null>(null);
  const [catalogOk, setCatalogOk] = useState<boolean|null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);

  const title = isEn ? book.titleEn : book.titleEs;

  // Load catalog to get real DB book ID and prices
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/books/catalog`)
      .then(r => r.json())
      .then((data: { books: CatalogBook[] }) => {
        const found = data.books.find(b =>
          b.slug === book.id ||
          b.titleEs.toLowerCase().includes(book.titleEs.toLowerCase().slice(0, 12))
        );
        if (found) {
          BOOK_ID_MAP[book.id] = found.id;
          setDbBookId(found.id);
          // Set initial price
          const p = found.prices.find(p => p.currency === currency);
          if (p) setPrice(p.amount);
          setCatalogOk(true);
        } else {
          setCatalogOk(false);
        }
      })
      .catch(() => setCatalogOk(false));
  }, [book.id]);

  // Update price when currency changes
  useEffect(() => {
    if (!dbBookId) return;
    fetch(`${BACKEND_URL}/api/books/catalog`)
      .then(r => r.json())
      .then((data: { books: CatalogBook[] }) => {
        const found = data.books.find(b => b.id === dbBookId);
        if (found) {
          const p = found.prices.find(p => p.currency === currency);
          setPrice(p ? p.amount : null);
        }
      }).catch(() => {});
  }, [currency, dbBookId]);

  // Entrance animation
  useEffect(() => {
    const nav = document.querySelector('nav') as HTMLElement | null;
    if (nav) nav.style.visibility = 'hidden';
    document.body.style.overflow = 'hidden';
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    gsap.fromTo(panelRef.current,   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
    return () => {
      if (nav) nav.style.visibility = 'visible';
      document.body.style.overflow = '';
    };
  }, []);

  const close = useCallback(() => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, onComplete: onClose });
  }, [onClose]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [close]);

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) { setError(isEn ? 'Enter a valid email.' : 'Ingresa un email válido.'); return; }
    if (!dbBookId) { setError(isEn ? 'Book not available for purchase yet.' : 'Libro no disponible aún en la tienda.'); return; }

    setStep('loading');
    setError('');

    try {
      const res = await fetch(`${BACKEND_URL}/api/payment/create`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId:     dbBookId,
          currency,
          buyerEmail: email,
          buyerName:  name || undefined,
          locale:     isEn ? 'en' : 'es',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al procesar');
      }

      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;

    } catch (e: any) {
      setError(e.message || (isEn ? 'Unexpected error.' : 'Error inesperado.'));
      setStep('form');
    }
  };

  const currSymbol = CURRENCIES.find(c => c.code === currency)?.symbol ?? '$';

  // ── Portal render ──────────────────────────────────────────────────────────
  return createPortal(
    <>
      {/* Overlay */}
      <div ref={overlayRef}
        onClick={e => { if (e.target === overlayRef.current) close(); }}
        style={{
          position:'fixed', inset:0, zIndex:9000,
          background:'rgba(4,3,8,0.88)', backdropFilter:'blur(10px)',
          display:'flex', alignItems:'center', justifyContent:'center',
          padding:'1rem',
        }}>

        {/* Panel */}
        <div ref={panelRef} style={{
          width:'min(520px,95vw)',
          background:'rgba(10,9,14,0.98)',
          border:'1px solid rgba(255,255,255,0.07)',
          borderTop:'1px solid rgba(180,155,90,0.4)',
          borderRadius:'3px',
          overflow:'hidden',
          boxShadow:'0 24px 60px rgba(0,0,0,0.7)',
        }}>

          {/* Header */}
          <div style={{ padding:'1.25rem 1.5rem', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem' }}>
            <div>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:'7.5px', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(180,155,90,0.55)', marginBottom:'0.3rem' }}>
                {isEn ? 'Purchase' : 'Comprar'}
              </p>
              <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'1.1rem', fontWeight:400, color:'rgba(232,225,212,0.95)', lineHeight:1.2, margin:0 }}>
                {title}
              </h2>
            </div>
            <button onClick={close} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(150,145,135,0.6)', borderRadius:'2px', width:'28px', height:'28px', cursor:'pointer', fontSize:'11px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color='rgba(220,210,190,0.9)'; }}
              onMouseLeave={e => { e.currentTarget.style.color='rgba(150,145,135,0.6)'; }}>
              ✕
            </button>
          </div>

          {/* Body */}
          <div style={{ padding:'1.5rem' }}>

            {/* Catalog status */}
            {catalogOk === false && (
              <div style={{ padding:'0.75rem 1rem', background:'rgba(180,100,50,0.12)', border:'1px solid rgba(180,100,50,0.25)', borderRadius:'2px', marginBottom:'1.25rem' }}>
                <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.82rem', color:'rgba(220,160,100,0.85)', margin:0 }}>
                  {isEn
                    ? 'This book is not yet available for direct purchase. Use the Amazon button.'
                    : 'Este libro aún no está disponible para compra directa. Usa el botón de Amazon.'}
                </p>
                <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display:'inline-flex', alignItems:'center', gap:'5px', marginTop:'0.6rem', padding:'0.4rem 0.9rem', background:'rgba(180,155,90,0.1)', border:'1px solid rgba(180,155,90,0.3)', color:'rgba(190,165,75,0.85)', borderRadius:'2px', textDecoration:'none', fontFamily:'var(--font-mono)', fontSize:'8.5px', letterSpacing:'0.1em', textTransform:'uppercase' }}>
                  ↗ Amazon
                </a>
              </div>
            )}

            {/* Form — only show if catalog OK or loading */}
            {catalogOk !== false && (
              <>
                {/* Currency selector */}
                <div style={{ marginBottom:'1.1rem' }}>
                  <label style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(160,155,145,0.5)', display:'block', marginBottom:'0.4rem' }}>
                    {isEn ? 'Currency' : 'Moneda'}
                  </label>
                  <div style={{ display:'flex', gap:'0.4rem' }}>
                    {CURRENCIES.map(c => (
                      <button key={c.code} onClick={() => setCurrency(c.code)}
                        style={{
                          flex:1, padding:'0.5rem 0.3rem',
                          background: currency === c.code ? 'rgba(180,155,90,0.14)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${currency === c.code ? 'rgba(180,155,90,0.5)' : 'rgba(255,255,255,0.07)'}`,
                          borderRadius:'2px', cursor:'pointer', transition:'all 0.2s',
                          display:'flex', flexDirection:'column', alignItems:'center', gap:'2px',
                        }}>
                        <span style={{ fontSize:'16px' }}>{c.flag}</span>
                        <span style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.08em', color: currency === c.code ? 'rgba(190,165,75,0.9)' : 'rgba(140,135,125,0.6)' }}>
                          {c.code}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price display */}
                {price !== null && (
                  <div style={{ padding:'0.75rem 1rem', background:'rgba(180,155,90,0.06)', border:'1px solid rgba(180,155,90,0.18)', borderRadius:'2px', marginBottom:'1.1rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontFamily:'var(--font-sans)', fontSize:'0.82rem', color:'rgba(180,170,150,0.7)', fontWeight:300 }}>
                      {isEn ? 'Price' : 'Precio'}
                    </span>
                    <span style={{ fontFamily:'var(--font-serif)', fontSize:'1.3rem', color:'rgba(210,185,100,0.95)' }}>
                      {currSymbol} {price.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Email */}
                <div style={{ marginBottom:'0.85rem' }}>
                  <label style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(160,155,145,0.5)', display:'block', marginBottom:'0.4rem' }}>
                    {isEn ? 'Email *' : 'Correo electrónico *'}
                  </label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder={isEn ? 'you@email.com' : 'tu@correo.com'}
                    style={{
                      width:'100%', padding:'0.65rem 0.85rem', boxSizing:'border-box',
                      background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)',
                      borderRadius:'2px', color:'rgba(220,215,205,0.9)',
                      fontFamily:'var(--font-sans)', fontSize:'0.88rem',
                      outline:'none', transition:'border-color 0.2s',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor='rgba(180,155,90,0.45)'; }}
                    onBlur={e  => { e.currentTarget.style.borderColor='rgba(255,255,255,0.09)'; }}
                  />
                </div>

                {/* Name (optional) */}
                <div style={{ marginBottom:'1.25rem' }}>
                  <label style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(160,155,145,0.5)', display:'block', marginBottom:'0.4rem' }}>
                    {isEn ? 'Name (optional)' : 'Nombre (opcional)'}
                  </label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder={isEn ? 'Your name' : 'Tu nombre'}
                    style={{
                      width:'100%', padding:'0.65rem 0.85rem', boxSizing:'border-box',
                      background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)',
                      borderRadius:'2px', color:'rgba(220,215,205,0.9)',
                      fontFamily:'var(--font-sans)', fontSize:'0.88rem',
                      outline:'none', transition:'border-color 0.2s',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor='rgba(180,155,90,0.45)'; }}
                    onBlur={e  => { e.currentTarget.style.borderColor='rgba(255,255,255,0.09)'; }}
                  />
                </div>

                {/* Error */}
                {error && (
                  <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.8rem', color:'rgba(220,100,80,0.85)', marginBottom:'0.85rem', padding:'0.5rem 0.75rem', background:'rgba(220,80,60,0.08)', border:'1px solid rgba(220,80,60,0.2)', borderRadius:'2px' }}>
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button onClick={handleSubmit} disabled={step === 'loading' || catalogOk === null}
                  style={{
                    width:'100%', padding:'0.85rem',
                    background: step === 'loading' ? 'rgba(180,155,90,0.08)' : 'rgba(180,155,90,0.15)',
                    border:'1px solid rgba(180,155,90,0.45)',
                    borderRadius:'2px', cursor: step === 'loading' ? 'wait' : 'pointer',
                    color:'rgba(205,178,90,0.95)',
                    fontFamily:'var(--font-sans)', fontWeight:500, fontSize:'0.88rem',
                    letterSpacing:'0.05em', transition:'all 0.25s',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                  }}
                  onMouseEnter={e => { if (step !== 'loading') e.currentTarget.style.background='rgba(180,155,90,0.25)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background= step === 'loading' ? 'rgba(180,155,90,0.08)' : 'rgba(180,155,90,0.15)'; }}>
                  {step === 'loading' ? (
                    <>
                      <span style={{ display:'inline-block', width:'12px', height:'12px', border:'1.5px solid rgba(205,178,90,0.4)', borderTopColor:'rgba(205,178,90,0.9)', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
                      {isEn ? 'Redirecting to Mercado Pago…' : 'Redirigiendo a Mercado Pago…'}
                    </>
                  ) : (
                    <>
                      <img src="https://www.mercadopago.com/favicon.ico" alt="" style={{ width:'16px', height:'16px', borderRadius:'2px' }} />
                      {isEn ? 'Pay with Mercado Pago' : 'Pagar con Mercado Pago'}
                    </>
                  )}
                </button>

                {/* Security note */}
                <p style={{ fontFamily:'var(--font-mono)', fontSize:'7.5px', letterSpacing:'0.1em', color:'rgba(140,135,125,0.4)', textAlign:'center', marginTop:'0.85rem' }}>
                  {isEn ? '🔒 Secure payment · PDF sent to your email after purchase' : '🔒 Pago seguro · PDF enviado a tu correo al completar la compra'}
                </p>
              </>
            )}

            {/* Loading state for catalog check */}
            {catalogOk === null && (
              <div style={{ textAlign:'center', padding:'2rem 0' }}>
                <div style={{ width:'20px', height:'20px', border:'1.5px solid rgba(180,155,90,0.2)', borderTopColor:'rgba(180,155,90,0.7)', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 0.75rem' }} />
                <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.15em', color:'rgba(140,135,125,0.5)', textTransform:'uppercase' }}>
                  {isEn ? 'Loading…' : 'Cargando…'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>,
    document.body
  );
}
