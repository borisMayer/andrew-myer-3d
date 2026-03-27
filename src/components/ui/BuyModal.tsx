/**
 * BuyModal — Compra directa con Mercado Pago
 * PDF descargable + contenido exclusivo · Múltiples monedas
 * Via createPortal → bypass total de z-index
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import type { Book } from '../../lib/books';

const BACKEND_URL = 'https://pagina-libros-autor.vercel.app';

interface CatalogBook {
  id:      string;
  slug:    string;
  titleEs: string;
  titleEn: string;
  prices:  { currency: string; amount: number }[];
}

interface BuyModalProps {
  book:    Book;
  onClose: () => void;
}

// ─── Monedas disponibles ──────────────────────────────────────────────────────
const CURRENCIES = [
  { code: 'CLP', symbol: '$',   label: 'Peso chileno',    flag: '🇨🇱', locale: 'es-CL' },
  { code: 'ARS', symbol: '$',   label: 'Peso argentino',  flag: '🇦🇷', locale: 'es-AR' },
  { code: 'USD', symbol: 'US$', label: 'Dólar',           flag: '🇺🇸', locale: 'en-US' },
  { code: 'MXN', symbol: '$',   label: 'Peso mexicano',   flag: '🇲🇽', locale: 'es-MX' },
  { code: 'COP', symbol: '$',   label: 'Peso colombiano', flag: '🇨🇴', locale: 'es-CO' },
];

// ─── Qué incluye cada compra ──────────────────────────────────────────────────
const INCLUDES_ES = [
  { icon: '📄', text: 'PDF descargable de alta calidad' },
  { icon: '📧', text: 'Enviado a tu correo inmediatamente' },
  { icon: '♾️', text: 'Acceso de por vida — sin suscripción' },
  { icon: '🔒', text: 'Pago seguro vía Mercado Pago' },
];
const INCLUDES_EN = [
  { icon: '📄', text: 'High-quality downloadable PDF' },
  { icon: '📧', text: 'Sent to your email immediately' },
  { icon: '♾️', text: 'Lifetime access — no subscription' },
  { icon: '🔒', text: 'Secure payment via Mercado Pago' },
];

function formatPrice(amount: number, code: string, locale: string) {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency', currency: code,
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    const sym = CURRENCIES.find(c => c.code === code)?.symbol ?? '$';
    return `${sym} ${amount.toLocaleString()}`;
  }
}

// ─── Input field ──────────────────────────────────────────────────────────────
function Field({ label, type = 'text', value, onChange, placeholder, required }: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
  return (
    <div style={{ marginBottom: '0.9rem' }}>
      <label style={{ fontFamily:'var(--font-mono)', fontSize:'7.5px', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(160,155,145,0.5)', display:'block', marginBottom:'0.35rem' }}>
        {label}{required && <span style={{ color:'rgba(180,155,90,0.7)', marginLeft:'3px' }}>*</span>}
      </label>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width:'100%', padding:'0.65rem 0.9rem', boxSizing:'border-box',
          background:'rgba(255,255,255,0.04)',
          border:'1px solid rgba(255,255,255,0.09)',
          borderRadius:'2px', color:'rgba(222,216,205,0.92)',
          fontFamily:'var(--font-sans)', fontSize:'0.88rem',
          outline:'none', transition:'border-color 0.2s',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(180,155,90,0.5)'; }}
        onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; }}
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function BuyModal({ book, onClose }: BuyModalProps) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const [step,      setStep]      = useState<'form'|'loading'|'success_redirect'>('form');
  const [email,     setEmail]     = useState('');
  const [name,      setName]      = useState('');
  const [currency,  setCurrency]  = useState('CLP');
  const [error,     setError]     = useState('');
  const [dbBook,    setDbBook]    = useState<CatalogBook | null>(null);
  const [catalog,   setCatalog]   = useState<CatalogBook[]>([]);
  const [catalogOk, setCatalogOk] = useState<'loading'|'ok'|'error'>('loading');

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);

  const title = isEn ? book.titleEn : book.titleEs;
  const includes = isEn ? INCLUDES_EN : INCLUDES_ES;

  // Current currency info
  const currInfo = CURRENCIES.find(c => c.code === currency) ?? CURRENCIES[0];

  // Price for selected currency
  const priceEntry = dbBook?.prices.find(p => p.currency === currency);
  const priceFormatted = priceEntry
    ? formatPrice(priceEntry.amount, currency, currInfo.locale)
    : null;

  // Currencies that actually have a price configured
  const availableCurrencies = CURRENCIES.filter(c =>
    dbBook?.prices.some(p => p.currency === c.code)
  );

  // ── Load catalog ─────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/books/catalog`)
      .then(r => r.json())
      .then((data: { books: CatalogBook[] }) => {
        setCatalog(data.books);
        // Match by slug or title prefix
        const found = data.books.find(b =>
          b.slug === book.id ||
          b.titleEs.toLowerCase().includes(book.titleEs.toLowerCase().slice(0, 10)) ||
          b.titleEn.toLowerCase().includes(book.titleEn.toLowerCase().slice(0, 10))
        );
        setDbBook(found ?? null);
        setCatalogOk(found ? 'ok' : 'error');
        // Auto-select first available currency
        if (found && found.prices.length > 0) {
          const clp = found.prices.find(p => p.currency === 'CLP');
          setCurrency(clp ? 'CLP' : found.prices[0].currency);
        }
      })
      .catch(() => setCatalogOk('error'));
  }, [book.id, book.titleEs, book.titleEn]);

  // ── Entrance animation ────────────────────────────────────────────────────────
  useEffect(() => {
    const nav = document.querySelector('nav') as HTMLElement | null;
    if (nav) nav.style.visibility = 'hidden';
    document.body.style.overflow = 'hidden';
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    gsap.fromTo(panelRef.current,   { opacity: 0, y: 24, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' });
    return () => {
      if (nav) nav.style.visibility = 'visible';
      document.body.style.overflow = '';
    };
  }, []);

  const close = useCallback(() => {
    gsap.to(overlayRef.current, {
      opacity: 0, duration: 0.2, onComplete: onClose,
    });
  }, [onClose]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [close]);

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const errMsg = (es: string, en: string) => isEn ? en : es;
    if (!email || !email.includes('@')) {
      setError(errMsg('Ingresa un email válido.', 'Enter a valid email address.')); return;
    }
    if (!dbBook) {
      setError(errMsg('Este libro no está disponible para compra directa aún.', 'This book is not yet available for direct purchase.')); return;
    }
    if (!priceEntry) {
      setError(errMsg(`No hay precio disponible en ${currency}.`, `No price available in ${currency}.`)); return;
    }

    setStep('loading');
    setError('');

    try {
      const res = await fetch(`${BACKEND_URL}/api/payment/create`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId:     dbBook.id,
          currency,
          buyerEmail: email.trim(),
          buyerName:  name.trim() || undefined,
          locale:     isEn ? 'en' : 'es',
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? 'Error al procesar el pago.');

      // Redirect to Mercado Pago checkout
      setStep('success_redirect');
      setTimeout(() => { window.location.href = data.checkoutUrl; }, 600);

    } catch (e: any) {
      setError(e.message ?? (isEn ? 'Unexpected error. Try again.' : 'Error inesperado. Intenta de nuevo.'));
      setStep('form');
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return createPortal(
    <>
      {/* ── Overlay ── */}
      <div ref={overlayRef}
        onClick={e => { if (e.target === overlayRef.current) close(); }}
        style={{
          position:'fixed', inset:0, zIndex:9000,
          background:'rgba(3,2,6,0.9)', backdropFilter:'blur(14px)',
          display:'flex', alignItems:'center', justifyContent:'center',
          padding:'1rem',
        }}>

        {/* ── Panel ── */}
        <div ref={panelRef} style={{
          width:'min(560px,96vw)', maxHeight:'92vh', overflowY:'auto',
          background:'rgba(9,8,13,0.99)',
          border:'1px solid rgba(255,255,255,0.07)',
          borderTop:'2px solid rgba(180,155,90,0.5)',
          borderRadius:'3px',
          boxShadow:'0 32px 80px rgba(0,0,0,0.8)',
        }}>

          {/* Header */}
          <div style={{ padding:'1.25rem 1.5rem 1rem', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem' }}>
            <div>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:'7.5px', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(180,155,90,0.5)', marginBottom:'0.3rem' }}>
                {isEn ? 'Purchase · Direct download' : 'Comprar · Descarga directa'}
              </p>
              <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'1.15rem', fontWeight:400, color:'rgba(235,228,215,0.97)', lineHeight:1.2, margin:0 }}>
                {title}
              </h2>
            </div>
            <button onClick={close} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(150,145,135,0.55)', borderRadius:'2px', width:'28px', height:'28px', cursor:'pointer', fontSize:'11px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color='rgba(220,210,190,0.9)'; }}
              onMouseLeave={e => { e.currentTarget.style.color='rgba(150,145,135,0.55)'; }}>
              ✕
            </button>
          </div>

          <div style={{ padding:'1.25rem 1.5rem 1.5rem' }}>

            {/* ── Loading catalog ── */}
            {catalogOk === 'loading' && (
              <div style={{ padding:'2.5rem 0', textAlign:'center' }}>
                <div style={{ width:'22px', height:'22px', border:'2px solid rgba(180,155,90,0.15)', borderTopColor:'rgba(180,155,90,0.7)', borderRadius:'50%', animation:'spin 0.7s linear infinite', margin:'0 auto 0.85rem' }} />
                <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(140,135,125,0.5)' }}>
                  {isEn ? 'Loading…' : 'Cargando…'}
                </p>
              </div>
            )}

            {/* ── Book not in store ── */}
            {catalogOk === 'error' && (
              <div style={{ padding:'1.5rem', background:'rgba(180,100,50,0.08)', border:'1px solid rgba(180,100,50,0.2)', borderRadius:'2px', marginBottom:'1rem' }}>
                <p style={{ fontFamily:'var(--font-serif)', fontSize:'0.95rem', fontStyle:'italic', color:'rgba(215,175,130,0.8)', marginBottom:'0.7rem', lineHeight:1.6 }}>
                  {isEn
                    ? 'This title is not yet available for direct purchase. You can find it on Amazon.'
                    : 'Este título aún no está disponible para compra directa. Puedes encontrarlo en Amazon.'}
                </p>
                <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display:'inline-flex', alignItems:'center', gap:'5px', padding:'0.5rem 1.1rem', background:'rgba(180,155,90,0.1)', border:'1px solid rgba(180,155,90,0.35)', color:'rgba(190,165,75,0.9)', borderRadius:'2px', textDecoration:'none', fontFamily:'var(--font-mono)', fontSize:'8.5px', letterSpacing:'0.1em', textTransform:'uppercase', transition:'all 0.2s' }}>
                  ↗ {isEn ? 'View on Amazon' : 'Ver en Amazon'}
                </a>
              </div>
            )}

            {/* ── Form ── */}
            {catalogOk === 'ok' && step !== 'success_redirect' && (
              <>
                {/* What's included */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.4rem 0.85rem', marginBottom:'1.25rem', padding:'0.85rem 1rem', background:'rgba(180,155,90,0.05)', border:'1px solid rgba(180,155,90,0.12)', borderRadius:'2px' }}>
                  {includes.map((item, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                      <span style={{ fontSize:'13px', flexShrink:0 }}>{item.icon}</span>
                      <span style={{ fontFamily:'var(--font-sans)', fontSize:'0.75rem', color:'rgba(175,168,155,0.7)', fontWeight:300, lineHeight:1.4 }}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Currency selector */}
                <div style={{ marginBottom:'1.1rem' }}>
                  <p style={{ fontFamily:'var(--font-mono)', fontSize:'7.5px', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(160,155,145,0.5)', marginBottom:'0.45rem' }}>
                    {isEn ? 'Currency' : 'Moneda'}
                  </p>
                  <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
                    {(availableCurrencies.length > 0 ? availableCurrencies : CURRENCIES).map(c => {
                      const hasPrice = dbBook?.prices.some(p => p.currency === c.code);
                      const isActive = currency === c.code;
                      return (
                        <button key={c.code}
                          onClick={() => hasPrice && setCurrency(c.code)}
                          disabled={!hasPrice}
                          style={{
                            display:'flex', alignItems:'center', gap:'5px',
                            padding:'0.4rem 0.8rem',
                            background: isActive ? 'rgba(180,155,90,0.16)' : 'rgba(255,255,255,0.03)',
                            border:`1px solid ${isActive ? 'rgba(180,155,90,0.55)' : 'rgba(255,255,255,0.07)'}`,
                            borderRadius:'2px', cursor: hasPrice ? 'pointer' : 'not-allowed',
                            opacity: hasPrice ? 1 : 0.35, transition:'all 0.2s',
                          }}>
                          <span style={{ fontSize:'14px' }}>{c.flag}</span>
                          <span style={{ fontFamily:'var(--font-mono)', fontSize:'8.5px', letterSpacing:'0.06em', color: isActive ? 'rgba(195,170,80,0.95)' : 'rgba(145,140,130,0.6)' }}>
                            {c.code}
                          </span>
                          {hasPrice && !isActive && (
                            <span style={{ fontFamily:'var(--font-mono)', fontSize:'7.5px', color:'rgba(130,125,115,0.45)', marginLeft:'2px' }}>
                              {formatPrice(dbBook!.prices.find(p => p.currency === c.code)!.amount, c.code, c.locale)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price display */}
                {priceFormatted && (
                  <div style={{ padding:'0.85rem 1.1rem', background:'rgba(10,9,14,0.7)', border:'1px solid rgba(255,255,255,0.07)', borderLeft:'2px solid rgba(180,155,90,0.5)', borderRadius:'0 2px 2px 0', marginBottom:'1.25rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div>
                      <p style={{ fontFamily:'var(--font-mono)', fontSize:'7.5px', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(145,140,130,0.5)', marginBottom:'3px' }}>
                        {isEn ? 'Total' : 'Total a pagar'}
                      </p>
                      <p style={{ fontFamily:'var(--font-serif)', fontSize:'1.5rem', color:'rgba(215,190,105,0.97)', margin:0, letterSpacing:'-0.01em' }}>
                        {priceFormatted}
                      </p>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <p style={{ fontFamily:'var(--font-mono)', fontSize:'7.5px', letterSpacing:'0.1em', color:'rgba(145,140,130,0.4)', marginBottom:'3px', textTransform:'uppercase' }}>
                        {isEn ? 'Format' : 'Formato'}
                      </p>
                      <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.8rem', color:'rgba(170,165,155,0.65)', margin:0 }}>PDF</p>
                    </div>
                  </div>
                )}

                {/* Email */}
                <Field
                  label={isEn ? 'Email (PDF will be sent here)' : 'Correo electrónico (se enviará el PDF aquí)'}
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder={isEn ? 'your@email.com' : 'tu@correo.com'}
                  required
                />

                {/* Name */}
                <Field
                  label={isEn ? 'Name' : 'Nombre'}
                  value={name}
                  onChange={setName}
                  placeholder={isEn ? 'Optional' : 'Opcional'}
                />

                {/* Error */}
                {error && (
                  <div style={{ padding:'0.6rem 0.85rem', background:'rgba(200,70,55,0.09)', border:'1px solid rgba(200,70,55,0.25)', borderRadius:'2px', marginBottom:'1rem' }}>
                    <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.8rem', color:'rgba(220,110,90,0.9)', margin:0 }}>
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={step === 'loading'}
                  style={{
                    width:'100%', padding:'0.9rem 1rem',
                    background: step === 'loading'
                      ? 'rgba(180,155,90,0.07)'
                      : 'linear-gradient(135deg, rgba(180,155,90,0.22) 0%, rgba(160,135,70,0.18) 100%)',
                    border:`1px solid rgba(180,155,90,${step === 'loading' ? '0.25' : '0.5'})`,
                    borderRadius:'2px', cursor: step === 'loading' ? 'wait' : 'pointer',
                    color:'rgba(210,182,95,0.97)',
                    fontFamily:'var(--font-sans)', fontWeight:500, fontSize:'0.9rem',
                    letterSpacing:'0.04em', transition:'all 0.25s',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:'10px',
                  }}
                  onMouseEnter={e => {
                    if (step !== 'loading') {
                      e.currentTarget.style.background = 'rgba(180,155,90,0.32)';
                      e.currentTarget.style.borderColor = 'rgba(180,155,90,0.7)';
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(180,155,90,0.22) 0%, rgba(160,135,70,0.18) 100%)';
                    e.currentTarget.style.borderColor = 'rgba(180,155,90,0.5)';
                  }}>
                  {step === 'loading' ? (
                    <>
                      <span style={{ display:'inline-block', width:'14px', height:'14px', border:'2px solid rgba(210,182,95,0.25)', borderTopColor:'rgba(210,182,95,0.9)', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
                      {isEn ? 'Connecting to Mercado Pago…' : 'Conectando con Mercado Pago…'}
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 48 48" style={{ flexShrink:0 }}>
                        <circle cx="24" cy="24" r="22" fill="#009ee3"/>
                        <text x="24" y="30" textAnchor="middle" fontSize="20" fill="white" fontWeight="bold">MP</text>
                      </svg>
                      {isEn ? 'Pay with Mercado Pago' : 'Pagar con Mercado Pago'}
                      {priceFormatted && <span style={{ opacity:0.7, fontSize:'0.8rem' }}>· {priceFormatted}</span>}
                    </>
                  )}
                </button>

                {/* Security note */}
                <div style={{ marginTop:'0.85rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', flexWrap:'wrap' }}>
                  {[
                    isEn ? '🔒 Secure checkout' : '🔒 Pago seguro',
                    isEn ? '📄 PDF immediately' : '📄 PDF inmediato',
                    isEn ? '↩️ 7-day guarantee' : '↩️ Garantía 7 días',
                  ].map((item, i) => (
                    <span key={i} style={{ fontFamily:'var(--font-mono)', fontSize:'7px', letterSpacing:'0.1em', color:'rgba(140,135,125,0.45)', padding:'3px 7px', border:'1px solid rgba(255,255,255,0.05)', borderRadius:'2px' }}>
                      {item}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* ── Redirecting ── */}
            {step === 'success_redirect' && (
              <div style={{ padding:'2.5rem 0', textAlign:'center' }}>
                <div style={{ width:'40px', height:'40px', background:'rgba(0,158,227,0.15)', border:'1px solid rgba(0,158,227,0.3)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', fontSize:'20px' }}>
                  ✓
                </div>
                <p style={{ fontFamily:'var(--font-serif)', fontSize:'1.1rem', color:'rgba(215,208,195,0.92)', marginBottom:'0.4rem' }}>
                  {isEn ? 'Redirecting to Mercado Pago…' : 'Redirigiendo a Mercado Pago…'}
                </p>
                <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.8rem', color:'rgba(145,140,130,0.55)', fontWeight:300 }}>
                  {isEn ? 'You will be redirected automatically.' : 'Serás redirigido automáticamente.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>,
    document.body
  );
}
