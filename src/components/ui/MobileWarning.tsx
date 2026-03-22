import { useTranslation } from 'react-i18next';
import { BOOKS } from '../../lib/books';

export default function MobileFallback() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const inp: React.CSSProperties = {
    width: '100%', padding: '0.85rem 1rem', boxSizing: 'border-box',
    background: 'rgba(7,0,31,0.8)', border: '1px solid rgba(124,58,237,0.25)',
    borderRadius: '10px', color: 'rgba(226,217,243,0.85)',
    fontFamily: "'Raleway', sans-serif", fontSize: '0.9rem', outline: 'none',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#020008', color: '#e2d9f3', fontFamily: "'Raleway', sans-serif", overflowX: 'hidden' }}>

      {/* Hero */}
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '2rem 1.5rem',
        background: 'radial-gradient(ellipse at center, #1a0a3d 0%, #07001f 40%, #020008 100%)',
        position: 'relative',
      }}>
        {/* Stars bg */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {Array.from({ length: 80 }, (_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`, height: `${1 + Math.random() * 2}px`,
              borderRadius: '50%',
              background: ['#7c3aed','#c9a227','#06b6d4','#ffffff'][Math.floor(Math.random() * 4)],
              opacity: 0.3 + Math.random() * 0.5,
            }} />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(201,162,39,0.75)', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            ◆ {t('hero.series')} ◆
          </p>

          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(3rem, 14vw, 5rem)', fontWeight: 300, color: '#ffffff', lineHeight: 1.05, marginBottom: '0.25rem' }}>
            Andrew
          </h1>
          <span style={{
            display: 'block', fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(3rem, 14vw, 5rem)', fontWeight: 700, fontStyle: 'italic',
            background: 'linear-gradient(90deg, #8a6500, #f5e27d, #c9a227)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', marginBottom: '2rem',
          }}>
            Myer
          </span>

          <p style={{ fontSize: '0.9rem', color: 'rgba(226,217,243,0.6)', maxWidth: '340px', lineHeight: 1.8, marginBottom: '2.5rem', fontWeight: 300, whiteSpace: 'pre-line' }}>
            {t('hero.subtitle')}
          </p>

          <a href="#books-mobile" style={{
            display: 'inline-block', padding: '0.9rem 2rem',
            background: 'linear-gradient(135deg, #5b21b6, #c9a227)',
            color: '#fff', borderRadius: '9999px', textDecoration: 'none',
            fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600,
          }}>
            ✦ {t('hero.cta_books')}
          </a>
        </div>
      </div>

      {/* Author */}
      <section style={{ padding: '4rem 1.5rem', borderTop: '1px solid rgba(124,58,237,0.1)' }}>
        <p style={{ color: '#c9a227', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
          ◆ {t('author.label')}
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.2, marginBottom: '1.5rem' }}>
          {t('author.title')}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'rgba(226,217,243,0.7)', fontSize: '0.92rem', lineHeight: 1.8, fontWeight: 300 }}>
          <p>{t('author.bio_1')}</p>
          <p>{t('author.bio_2')}</p>
          <p>{t('author.bio_3')}</p>
        </div>
        <blockquote style={{ marginTop: '1.75rem', padding: '1.2rem 1.5rem', borderLeft: '2px solid rgba(201,162,39,0.5)', background: 'rgba(201,162,39,0.04)', borderRadius: '0 0.75rem 0.75rem 0' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: 'rgba(201,162,39,0.88)', fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.65 }}>
            {t('author.quote')}
          </p>
        </blockquote>
      </section>

      {/* Books */}
      <section id="books-mobile" style={{ padding: '4rem 1.5rem', borderTop: '1px solid rgba(124,58,237,0.1)' }}>
        <p style={{ color: '#c9a227', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
          ◆ {t('books.label')}
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2rem', fontWeight: 300, color: '#ffffff', marginBottom: '2rem' }}>
          {t('books.title')}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {BOOKS.map(book => (
            <div key={book.id} style={{
              display: 'flex', gap: '1rem', alignItems: 'flex-start',
              padding: '1.25rem', background: 'rgba(7,0,31,0.7)',
              border: '1px solid rgba(124,58,237,0.18)', borderRadius: '1rem',
            }}>
              {/* Cover */}
              <div style={{
                width: '64px', height: '90px', flexShrink: 0, borderRadius: '6px',
                background: `linear-gradient(135deg, ${book.coverColor}, ${book.spineColor})`,
                boxShadow: `0 4px 16px ${book.glowColor}30`,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.35rem', lineHeight: 1.3 }}>
                  {isEn ? book.titleEn : book.titleEs}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'rgba(226,217,243,0.5)', lineHeight: 1.6, marginBottom: '0.75rem', fontWeight: 300 }}>
                  {isEn ? (book.descriptionEn ?? book.description) : book.description}
                </p>
                <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-block', padding: '0.45rem 1rem',
                  background: `linear-gradient(135deg, ${book.glowColor}cc, #c9a227cc)`,
                  color: '#fff', borderRadius: '6px', textDecoration: 'none',
                  fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600,
                }}>
                  {t('books.buy')}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Language switcher */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', padding: '2rem', borderTop: '1px solid rgba(124,58,237,0.1)' }}>
        {[{ code: 'es', flag: '🇦🇷', label: 'Español' }, { code: 'en', flag: '🇬🇧', label: 'English' }].map(lang => (
          <button key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            style={{
              padding: '0.5rem 1.25rem',
              background: i18n.language.startsWith(lang.code) ? 'rgba(201,162,39,0.15)' : 'rgba(7,0,31,0.7)',
              border: `1px solid ${i18n.language.startsWith(lang.code) ? 'rgba(201,162,39,0.5)' : 'rgba(124,58,237,0.2)'}`,
              color: i18n.language.startsWith(lang.code) ? '#c9a227' : 'rgba(226,217,243,0.5)',
              borderRadius: '9999px', cursor: 'pointer',
              fontFamily: "'Raleway', sans-serif", fontSize: '12px',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
            {lang.flag} {lang.label}
          </button>
        ))}
      </div>

      {/* Newsletter */}
      <section style={{ padding: '3rem 1.5rem', borderTop: '1px solid rgba(124,58,237,0.1)', textAlign: 'center' }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.75rem', fontWeight: 300 }}>
          {t('newsletter.title')}
        </h3>
        <p style={{ color: 'rgba(226,217,243,0.5)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{t('newsletter.subtitle')}</p>
        <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px', margin: '0 auto' }}>
          <input type="email" placeholder={t('newsletter.placeholder')} style={inp} />
          <button type="submit" style={{ padding: '0.9rem', background: 'linear-gradient(135deg, #5b21b6, #c9a227)', color: '#fff', border: 'none', borderRadius: '10px', fontFamily: "'Raleway', sans-serif", fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 600 }}>
            {t('newsletter.button')}
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer style={{ padding: '3rem 1.5rem', textAlign: 'center', borderTop: '1px solid rgba(124,58,237,0.1)' }}>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.5rem', color: '#c9a227', marginBottom: '0.4rem' }}>Andrew Myer</p>
        <p style={{ fontSize: '9px', letterSpacing: '0.25em', color: 'rgba(226,217,243,0.25)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          {t('hero.series')}
        </p>
        <p style={{ fontSize: '10px', color: 'rgba(226,217,243,0.2)' }}>
          © {new Date().getFullYear()} Andrew Myer
        </p>
      </footer>
    </div>
  );
}
