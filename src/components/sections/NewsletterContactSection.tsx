import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function NewsletterContactSection() {
  const { t } = useTranslation();
  const [email,    setEmail]    = useState('');
  const [name,     setName]     = useState('');
  const [userEmail,setUserEmail]= useState('');
  const [message,  setMessage]  = useState('');
  const [subDone,  setSubDone]  = useState(false);
  const [sending,  setSending]  = useState(false);
  const [sent,     setSent]     = useState(false);

  const inp: React.CSSProperties = {
    width: '100%', padding: '0.85rem 1.1rem', boxSizing: 'border-box',
    background: 'rgba(7,0,31,0.7)', border: '1px solid rgba(124,58,237,0.25)',
    borderRadius: '10px', color: 'rgba(226,217,243,0.85)',
    fontFamily: "'Raleway', sans-serif", fontSize: '0.9rem',
    outline: 'none', transition: 'border-color 0.3s',
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubDone(true); setEmail(''); }
  };

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); setName(''); setUserEmail(''); setMessage(''); }, 1500);
  };

  return (
    <>
      {/* Newsletter */}
      <section id="newsletter" style={{
        padding: 'clamp(4rem,7vw,7rem) clamp(1.5rem,5vw,6rem)',
        pointerEvents: 'auto',
        borderTop: '1px solid rgba(124,58,237,0.1)',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#c9a227', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: "'Raleway', sans-serif" }}>
            ◆ {t('newsletter.label')}
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 300, color: '#ffffff', lineHeight: 1.25, marginBottom: '0.75rem' }}>
            {t('newsletter.title')}
          </h2>
          <p style={{ color: 'rgba(226,217,243,0.5)', fontFamily: "'Raleway', sans-serif", fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.7 }}>
            {t('newsletter.subtitle')}
          </p>

          {subDone ? (
            <div style={{ padding: '1.25rem', background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.25)', borderRadius: '12px', color: '#c9a227', fontFamily: "'Raleway', sans-serif", fontSize: '0.9rem' }}>
              ✦ {t('hero.series')} —  ✓
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('newsletter.placeholder')}
                style={{ ...inp, flex: '1', minWidth: '220px' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(201,162,39,0.5)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(124,58,237,0.25)'; }}
              />
              <button type="submit" style={{
                padding: '0.85rem 1.8rem', flexShrink: 0,
                background: 'linear-gradient(135deg, #5b21b6, #c9a227)',
                color: '#fff', border: 'none', borderRadius: '10px',
                fontFamily: "'Raleway', sans-serif", fontSize: '0.8rem',
                letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                fontWeight: 600, transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
                {t('newsletter.button')}
              </button>
            </form>
          )}

          <p style={{ marginTop: '0.75rem', color: 'rgba(226,217,243,0.3)', fontSize: '11px', fontFamily: "'Raleway', sans-serif", letterSpacing: '0.08em' }}>
            {t('newsletter.privacy')}
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{
        padding: 'clamp(4rem,7vw,7rem) clamp(1.5rem,5vw,6rem)',
        pointerEvents: 'auto',
        borderTop: '1px solid rgba(124,58,237,0.1)',
      }}>
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <p style={{ color: '#c9a227', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: "'Raleway', sans-serif" }}>
            ◆ {t('contact.label')}
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 300, color: '#ffffff', lineHeight: 1.25, marginBottom: '0.75rem' }}>
            {t('contact.title')}
          </h2>
          <p style={{ color: 'rgba(226,217,243,0.5)', fontFamily: "'Raleway', sans-serif", fontSize: '0.9rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            {t('contact.subtitle')}
          </p>

          {sent ? (
            <div style={{ padding: '1.5rem', background: 'rgba(201,162,39,0.06)', border: '1px solid rgba(201,162,39,0.2)', borderRadius: '12px', color: '#c9a227', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.2rem', fontStyle: 'italic', textAlign: 'center' }}>
              ✦ Mensaje enviado. Gracias.
            </div>
          ) : (
            <form onSubmit={handleContact} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder={t('contact.name_placeholder')} style={inp}
                onFocus={e => { e.target.style.borderColor = 'rgba(201,162,39,0.4)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(124,58,237,0.25)'; }} />
              <input type="email" required value={userEmail} onChange={e => setUserEmail(e.target.value)}
                placeholder={t('contact.email_placeholder')} style={inp}
                onFocus={e => { e.target.style.borderColor = 'rgba(201,162,39,0.4)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(124,58,237,0.25)'; }} />
              <textarea required value={message} onChange={e => setMessage(e.target.value)}
                placeholder={t('contact.message_placeholder')}
                rows={5}
                style={{ ...inp, resize: 'vertical', minHeight: '120px' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(201,162,39,0.4)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(124,58,237,0.25)'; }} />
              <button type="submit" disabled={sending} style={{
                padding: '1rem', background: 'transparent',
                border: '1px solid rgba(201,162,39,0.45)', color: '#c9a227',
                borderRadius: '10px', fontFamily: "'Raleway', sans-serif",
                fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.3s', opacity: sending ? 0.6 : 1,
              }}
              onMouseEnter={e => { if (!sending) { e.currentTarget.style.background = 'rgba(201,162,39,0.08)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(201,162,39,0.15)'; } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}>
                {sending ? t('contact.sending') : t('contact.send')}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
