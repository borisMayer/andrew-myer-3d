import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Navigation() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const currentLang = i18n.language.startsWith('en') ? 'en' : 'es';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navLinks = [
    { key: 'nav.author',   href: '#author'   },
    { key: 'nav.thought',  href: '#thought'  },
    { key: 'nav.books',    href: '#books'    },
    { key: 'nav.excerpts', href: '#excerpts' },
    { key: 'nav.contact',  href: '#contact'  },
  ];

  const linkStyle: React.CSSProperties = {
    fontFamily: 'var(--font-sans)', fontSize: '11px',
    letterSpacing: '0.12em', textTransform: 'uppercase' as const,
    color: 'rgba(180,180,200,0.6)', textDecoration: 'none',
    transition: 'color 0.25s', fontWeight: 400,
    cursor: 'pointer',
  };

  return (
    <nav style={{
      width: '100%',
      padding: scrolled ? '0.9rem var(--space-gutter)' : '1.4rem var(--space-gutter)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transition: 'all 0.35s ease',
      background: scrolled ? 'rgba(6,6,11,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
      position: 'relative',
    }}>

      {/* Logo — typographic, no decorative symbols */}
      <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '0', flexShrink: 0 }}>
        <span style={{
          fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400,
          color: 'rgba(230,225,215,0.95)', letterSpacing: '0.02em',
        }}>
          Andrew Myer
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 300,
          color: 'rgba(180,155,90,0.6)', letterSpacing: '0.15em', marginLeft: '10px',
          alignSelf: 'center', textTransform: 'uppercase',
        }}>
          Ph.D.
        </span>
      </a>

      {/* Desktop links */}
      <div style={{ display: 'none', gap: '2.2rem', alignItems: 'center' }} className="desk-links">
        {navLinks.map(item => (
          <a key={item.key} href={item.href} style={linkStyle}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(200,165,80,0.9)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(180,180,200,0.6)'; }}>
            {t(item.key)}
          </a>
        ))}
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

        {/* Lang switcher — minimal */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setLangOpen(!langOpen)} style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: 'transparent',
            border: '1px solid rgba(180,155,90,0.25)',
            borderRadius: '3px', padding: '0.35rem 0.7rem',
            cursor: 'pointer', fontFamily: 'var(--font-mono)',
            fontSize: '9px', letterSpacing: '0.15em',
            color: 'rgba(180,155,90,0.7)', textTransform: 'uppercase',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(180,155,90,0.5)'; e.currentTarget.style.color = 'rgba(200,165,80,0.9)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(180,155,90,0.25)'; e.currentTarget.style.color = 'rgba(180,155,90,0.7)'; }}>
            {currentLang.toUpperCase()}
            <span style={{ fontSize: '6px', opacity: 0.6 }}>▾</span>
          </button>

          {langOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0,
              background: 'rgba(6,6,11,0.98)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '4px', overflow: 'hidden', zIndex: 200,
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              minWidth: '100px',
            }}>
              {[{ code: 'es', label: 'Español' }, { code: 'en', label: 'English' }].map(lang => (
                <button key={lang.code}
                  onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '0.6rem 0.9rem', border: 'none',
                    background: currentLang === lang.code ? 'rgba(180,155,90,0.08)' : 'transparent',
                    cursor: 'pointer', fontFamily: 'var(--font-sans)',
                    fontSize: '11px', color: currentLang === lang.code ? 'rgba(200,165,80,0.9)' : 'rgba(180,180,200,0.6)',
                    textAlign: 'left', transition: 'background 0.15s', gap: '8px',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(180,155,90,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = currentLang === lang.code ? 'rgba(180,155,90,0.08)' : 'transparent'; }}>
                  {lang.label}
                  {currentLang === lang.code && <span style={{ fontSize: '9px', color: 'rgba(180,155,90,0.7)' }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', display: 'flex', flexDirection: 'column', gap: '4px' }}
          className="mob-toggle">
          <div style={{ width: '18px', height: '1px', background: 'rgba(200,190,170,0.6)', transition: 'all 0.25s', transform: menuOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none' }} />
          <div style={{ width: '12px', height: '1px', background: 'rgba(200,190,170,0.6)', transition: 'all 0.25s', opacity: menuOpen ? 0 : 1 }} />
          <div style={{ width: '18px', height: '1px', background: 'rgba(200,190,170,0.6)', transition: 'all 0.25s', transform: menuOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(6,6,11,0.98)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '1rem var(--space-gutter)',
          zIndex: 100,
        }}>
          {navLinks.map(item => (
            <a key={item.key} href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{ ...linkStyle, display: 'block', padding: '0.7rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              {t(item.key)}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desk-links { display: flex !important; }
          .mob-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
