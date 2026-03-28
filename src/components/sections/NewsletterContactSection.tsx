import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function NewsletterContactSection() {
  const { t } = useTranslation();
  const [email,     setEmail]     = useState('');
  const [subDone,   setSubDone]   = useState(false);
  const [name,      setName]      = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message,   setMessage]   = useState('');
  const [sending,   setSending]   = useState(false);
  const [sent,      setSent]      = useState(false);

  const fieldStyle: React.CSSProperties = {
    width: '100%', padding: '0.85rem 1rem', boxSizing: 'border-box',
    background: 'rgba(14,14,20,0.8)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '2px', color: 'rgba(210,205,195,0.85)',
    fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 300,
    outline: 'none', transition: 'border-color 0.25s',
  };

  const onFocus: React.FocusEventHandler = e => { (e.target as HTMLElement).style.borderColor = 'rgba(180,155,90,0.35)'; };
  const onBlur:  React.FocusEventHandler = e => { (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; };

  const [subError, setSubError] = useState('');

  const handleSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubError('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setSubDone(true);
      setEmail('');
    } catch (err: any) {
      setSubError(err.message);
    }
  };
  const [contactError, setContactError] = useState('');

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !userEmail || !message) return;
    setSending(true);
    setContactError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: userEmail, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al enviar');
      setSent(true);
      setName(''); setUserEmail(''); setMessage('');
    } catch (err: any) {
      setContactError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>

      {/* Newsletter */}
      <section id="newsletter" style={{ padding: 'var(--space-section) var(--space-gutter)', pointerEvents: 'auto' }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="nl-grid">
            <div>
              <div className="section-rule">
                <span className="label-tag">{t('newsletter.label')}</span>
              </div>
              <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:400, color:'rgba(235,228,215,0.95)', lineHeight:1.15, marginBottom:'0.9rem' }}>
                {t('newsletter.title')}
              </h2>
              <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.9rem', color:'rgba(155,160,170,0.6)', lineHeight:1.8, fontWeight:300 }}>
                {t('newsletter.subtitle')}
              </p>
            </div>
            <div>
              {subDone ? (
                <div style={{ padding:'1.25rem', border:'1px solid rgba(180,155,90,0.2)', borderRadius:'2px', background:'rgba(180,155,90,0.04)' }}>
                  <p style={{ fontFamily:'var(--font-serif)', fontSize:'1rem', fontStyle:'italic', color:'rgba(200,170,80,0.8)' }}>
                    ✓ {t('hero.series')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSub} style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder={t('newsletter.placeholder')}
                    style={{ ...fieldStyle, flex:'1', minWidth:'220px' }}
                    onFocus={onFocus} onBlur={onBlur} />
                  <button type="submit" style={{
                    padding:'0.85rem 1.5rem', flexShrink:0,
                    background:'rgba(180,155,90,0.12)', border:'1px solid rgba(180,155,90,0.4)',
                    color:'rgba(200,170,80,0.9)', borderRadius:'2px', cursor:'pointer',
                    fontFamily:'var(--font-sans)', fontSize:'10px',
                    letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:500,
                    transition:'all 0.25s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(180,155,90,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(180,155,90,0.12)'; }}>
                    {t('newsletter.button')}
                  </button>
                </form>
              )}
              <p style={{ marginTop:'0.6rem', fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.12em', color:'rgba(150,155,165,0.4)' }}>
                {t('newsletter.privacy')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: 'var(--space-section) var(--space-gutter)', pointerEvents: 'auto', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }} className="ct-grid">
            <div>
              <div className="section-rule">
                <span className="label-tag">{t('contact.label')}</span>
              </div>
              <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:400, color:'rgba(235,228,215,0.95)', lineHeight:1.15, marginBottom:'0.9rem' }}>
                {t('contact.title')}
              </h2>
              <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.9rem', color:'rgba(155,160,170,0.6)', lineHeight:1.8, fontWeight:300 }}>
                {t('contact.subtitle')}
              </p>
            </div>
            <div>
              {sent ? (
                <p style={{ fontFamily:'var(--font-serif)', fontSize:'1.1rem', fontStyle:'italic', color:'rgba(200,170,80,0.75)', padding:'1.5rem 0' }}>
                  ✓ {t('contact.send')}
                </p>
              ) : (
                <form onSubmit={handleContact} style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder={t('contact.name_placeholder')} style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
                  <input type="email" required value={userEmail} onChange={e => setUserEmail(e.target.value)}
                    placeholder={t('contact.email_placeholder')} style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
                  <textarea required value={message} onChange={e => setMessage(e.target.value)}
                    placeholder={t('contact.message_placeholder')} rows={5}
                    style={{ ...fieldStyle, resize:'vertical', minHeight:'110px' }} onFocus={onFocus} onBlur={onBlur} />
                  <button type="submit" disabled={sending} style={{
                    padding:'0.9rem', background:'transparent',
                    border:'1px solid rgba(180,155,90,0.3)', color:'rgba(180,155,90,0.75)',
                    borderRadius:'2px', fontFamily:'var(--font-sans)', fontSize:'10px',
                    letterSpacing:'0.12em', textTransform:'uppercase', cursor:'pointer',
                    transition:'all 0.25s', opacity: sending ? 0.5 : 1,
                  }}
                  onMouseEnter={e => { if (!sending) { e.currentTarget.style.background = 'rgba(180,155,90,0.08)'; e.currentTarget.style.borderColor = 'rgba(180,155,90,0.5)'; }}}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(180,155,90,0.3)'; }}>
                    {sending ? t('contact.sending') : t('contact.send')}
                  </button>
                  {contactError && (
                    <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.82rem', color:'rgba(220,100,80,0.85)', marginTop:'0.5rem', padding:'0.5rem 0.75rem', background:'rgba(220,80,60,0.08)', border:'1px solid rgba(220,80,60,0.2)', borderRadius:'2px' }}>
                      {contactError}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .nl-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .ct-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </div>
  );
}
