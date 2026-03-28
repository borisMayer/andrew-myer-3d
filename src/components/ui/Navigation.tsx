import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Navigation() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [langOpen, setLangOpen]   = useState(false);
  const [atTop, setAtTop]         = useState(true);
  const currentLang = i18n.language.startsWith('en') ? 'en' : 'es';

  useEffect(() => {
    const fn = () => { setScrolled(window.scrollY > 60); setAtTop(window.scrollY < 10); };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navLinks = [
    { key: 'nav.author',   href: '#author',   label_es: 'El Autor',      label_en: 'The Author' },
    { key: 'nav.thought',  href: '#thought',  label_es: 'Pensamiento',   label_en: 'Thought' },
    { key: 'nav.books',    href: '#books',    label_es: 'Publicaciones', label_en: 'Works' },
    { key: 'nav.excerpts', href: '#excerpts', label_es: 'Extractos',     label_en: 'Excerpts' },
    { key: 'nav.contact',  href: '#contact',  label_es: 'Contacto',      label_en: 'Contact' },
  ];

  const isEn = currentLang === 'en';

  return (
    <nav style={{
      width: '100%',
      padding: scrolled ? '0.75rem var(--space-gutter)' : '1.25rem var(--space-gutter)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      background: scrolled ? 'rgba(5,4,9,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(24px) saturate(1.8)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(180,155,90,0.12)' : 'none',
      position: 'relative',
    }}>

      {/* Logo */}
      <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
        {/* Monogram mark */}
        <div style={{
          width: '28px', height: '28px',
          border: '1px solid rgba(180,155,90,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-serif)', fontSize: '13px',
            color: 'rgba(180,155,90,0.8)', fontStyle: 'italic', lineHeight: 1,
          }}>A</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <span style={{
            fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 400,
            color: 'rgba(232,226,214,0.95)', letterSpacing: '0.03em', lineHeight: 1.1,
          }}>Andrew Myer</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '7px', fontWeight: 300,
            color: 'rgba(180,155,90,0.5)', letterSpacing: '0.18em', textTransform: 'uppercase',
          }}>Ph.D. · {isEn ? 'Author' : 'Autor'}</span>
        </div>
      </a>

      {/* Desktop links */}
      <div style={{ display: 'none', gap: '0', alignItems: 'center' }} className="desk-links">
        {navLinks.map((item, i) => (
          <a key={item.key} href={item.href}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '8.5px',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'rgba(165,160,150,0.55)', textDecoration: 'none',
              transition: 'color 0.2s', fontWeight: 400,
              padding: '0.4rem 1.1rem',
              borderRight: i < navLinks.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(200,175,100,0.9)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(165,160,150,0.55)'; }}>
            {isEn ? item.label_en : item.label_es}
          </a>
        ))}
      </div>

      {/* Right: lang + mobile toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

        {/* Lang switcher */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setLangOpen(!langOpen)} style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'transparent', border: '1px solid rgba(180,155,90,0.22)',
            padding: '4px 10px', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.16em',
            color: 'rgba(180,155,90,0.65)', textTransform: 'uppercase', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(180,155,90,0.5)'; e.currentTarget.style.color = 'rgba(200,175,100,0.9)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(180,155,90,0.22)'; e.currentTarget.style.color = 'rgba(180,155,90,0.65)'; }}>
            {currentLang === 'es' ? '🇨🇱' : '🇺🇸'} {currentLang.toUpperCase()}
            <span style={{ opacity: 0.5, fontSize: '6px' }}>▾</span>
          </button>
          {langOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 200,
              background: 'rgba(5,4,9,0.98)', border: '1px solid rgba(180,155,90,0.15)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.7)', minWidth: '130px',
            }}>
              {[{ code:'es', flag:'🇨🇱', label:'Español' }, { code:'en', flag:'🇺🇸', label:'English' }].map(lang => (
                <button key={lang.code} onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    width: '100%', padding: '0.65rem 0.9rem', border: 'none',
                    background: currentLang === lang.code ? 'rgba(180,155,90,0.08)' : 'transparent',
                    cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '11px',
                    color: currentLang === lang.code ? 'rgba(200,175,100,0.95)' : 'rgba(175,170,160,0.65)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(180,155,90,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = currentLang === lang.code ? 'rgba(180,155,90,0.08)' : 'transparent'; }}>
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                  {currentLang === lang.code && <span style={{ marginLeft: 'auto', fontSize: '9px', color: 'rgba(180,155,90,0.6)' }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="mob-toggle"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ width: '20px', height: '1px', background: 'rgba(200,195,180,0.6)', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
          <div style={{ width: '13px', height: '1px', background: 'rgba(200,195,180,0.6)', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
          <div style={{ width: '20px', height: '1px', background: 'rgba(200,195,180,0.6)', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
          background: 'rgba(5,4,9,0.98)', backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(180,155,90,0.12)', padding: '1.25rem var(--space-gutter)',
        }}>
          {navLinks.map((item, i) => (
            <a key={item.key} href={item.href} onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.8rem 0',
                borderBottom: i < navLinks.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em',
                textTransform: 'uppercase', color: 'rgba(165,160,150,0.65)', textDecoration: 'none',
              }}>
              {isEn ? item.label_en : item.label_es}
              <span style={{ opacity: 0.3, fontSize: '10px' }}>→</span>
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
