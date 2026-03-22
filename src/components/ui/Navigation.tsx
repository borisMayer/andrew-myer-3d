import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Navigation() {
  const { t, i18n } = useTranslation();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [langOpen,  setLangOpen]  = useState(false);

  const currentLang = i18n.language.startsWith('en') ? 'en' : 'es';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const switchLang = (lang: string) => {
    i18n.changeLanguage(lang);
    setLangOpen(false);
    setMenuOpen(false);
  };

  const navLinks = [
    { key: 'nav.home',    href: '#' },
    { key: 'nav.author',  href: '#author' },
    { key: 'nav.thought', href: '#thought' },
    { key: 'nav.books',   href: '#books' },
    { key: 'nav.excerpts',href: '#excerpts' },
    { key: 'nav.contact', href: '#contact' },
  ];

  return (
    <nav style={{
      width: '100%',
      padding: scrolled ? '0.85rem 2.5rem' : '1.4rem 2.5rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transition: 'all 0.4s ease',
      background: scrolled ? 'rgba(2,0,8,0.94)' : 'transparent',
      backdropFilter: scrolled ? 'blur(24px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(124,58,237,0.12)' : 'none',
      position: 'relative',
    }}>
      {/* Logo */}
      <a href="#" style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: '1.35rem', fontWeight: 400,
        color: '#c9a227', textDecoration: 'none',
        letterSpacing: '0.05em',
        textShadow: '0 0 20px rgba(201,162,39,0.35)',
        display: 'flex', alignItems: 'baseline', gap: '2px',
        flexShrink: 0,
      }}>
        <span style={{ fontWeight: 300, color: 'rgba(226,217,243,0.75)' }}>A.</span>
        <span>Myer</span>
      </a>

      {/* Desktop nav links */}
      <div style={{
        display: 'none',
        gap: '2rem', alignItems: 'center',
      }} className="desktop-nav">
        {navLinks.map(item => (
          <a key={item.key} href={item.href} style={{
            fontFamily: "'Raleway', sans-serif", fontSize: '10px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(226,217,243,0.6)', textDecoration: 'none',
            transition: 'color 0.3s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#c9a227'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(226,217,243,0.6)'; }}>
            {t(item.key)}
          </a>
        ))}
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

        {/* Language switcher */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(201,162,39,0.08)',
              border: '1px solid rgba(201,162,39,0.3)',
              borderRadius: '9999px',
              padding: '0.4rem 0.9rem',
              cursor: 'pointer',
              fontFamily: "'Raleway', sans-serif",
              fontSize: '10px', letterSpacing: '0.15em',
              color: 'rgba(201,162,39,0.85)',
              textTransform: 'uppercase',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: '13px' }}>
              {currentLang === 'es' ? '🇦🇷' : '🇬🇧'}
            </span>
            {currentLang.toUpperCase()}
            <span style={{ fontSize: '8px', opacity: 0.7 }}>▾</span>
          </button>

          {langOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: 'rgba(7,0,31,0.97)',
              border: '1px solid rgba(124,58,237,0.2)',
              borderRadius: '10px', overflow: 'hidden',
              backdropFilter: 'blur(20px)',
              minWidth: '120px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              zIndex: 200,
            }}>
              {[
                { code: 'es', flag: '🇦🇷', label: 'Español' },
                { code: 'en', flag: '🇬🇧', label: 'English' },
              ].map(lang => (
                <button key={lang.code} onClick={() => switchLang(lang.code)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    width: '100%', padding: '0.65rem 1rem',
                    background: currentLang === lang.code ? 'rgba(201,162,39,0.1)' : 'transparent',
                    border: 'none', cursor: 'pointer',
                    fontFamily: "'Raleway', sans-serif",
                    fontSize: '12px', color: currentLang === lang.code ? '#c9a227' : 'rgba(226,217,243,0.7)',
                    textAlign: 'left', transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,162,39,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = currentLang === lang.code ? 'rgba(201,162,39,0.1)' : 'transparent'; }}
                >
                  <span>{lang.flag}</span>
                  {lang.label}
                  {currentLang === lang.code && <span style={{ marginLeft: 'auto', fontSize: '8px' }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <a href="#books" style={{
          padding: '0.55rem 1.3rem',
          background: 'transparent',
          border: '1px solid rgba(201,162,39,0.45)',
          color: '#c9a227', borderRadius: '9999px', textDecoration: 'none',
          fontFamily: "'Raleway', sans-serif", fontSize: '10px',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          transition: 'all 0.3s',
          display: 'none',
        }} className="desktop-cta"
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,162,39,0.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
          {t('nav.books')}
        </a>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: menuOpen ? (i === 1 ? '0' : '20px') : '20px',
              height: '1px', background: '#c9a227', transition: 'all 0.3s',
              transform: menuOpen ? (i === 0 ? 'rotate(45deg) translate(4px, 4px)' : i === 2 ? 'rotate(-45deg) translate(4px, -4px)' : 'none') : 'none',
            }} />
          ))}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(2,0,8,0.98)', padding: '1rem 2.5rem 1.5rem',
          borderBottom: '1px solid rgba(124,58,237,0.15)',
          backdropFilter: 'blur(20px)', zIndex: 100,
        }}>
          {navLinks.map(item => (
            <a key={item.key} href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block', padding: '0.75rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                fontFamily: "'Raleway', sans-serif", fontSize: '11px',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(226,217,243,0.65)', textDecoration: 'none',
              }}>
              {t(item.key)}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-cta { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
