import { useState, useEffect } from 'react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navStyle: React.CSSProperties = {
    width: '100%', padding: scrolled ? '1rem 2.5rem' : '1.5rem 2.5rem',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    transition: 'all 0.4s ease',
    background: scrolled
      ? 'rgba(2,0,8,0.92)' : 'transparent',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(124,58,237,0.12)' : 'none',
  };

  const linkStyle: React.CSSProperties = {
    fontFamily: "'Raleway', sans-serif", fontSize: '11px',
    letterSpacing: '0.2em', textTransform: 'uppercase',
    color: 'rgba(226,217,243,0.65)', textDecoration: 'none',
    transition: 'color 0.3s, text-shadow 0.3s', cursor: 'pointer',
  };

  return (
    <nav style={navStyle}>
      {/* Logo */}
      <a href="#" style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: '1.4rem', fontWeight: 400,
        color: '#c9a227', textDecoration: 'none',
        letterSpacing: '0.05em',
        textShadow: '0 0 20px rgba(201,162,39,0.4)',
        display: 'flex', alignItems: 'baseline', gap: '2px',
      }}>
        <span style={{ fontWeight: 300, color: 'rgba(226,217,243,0.8)' }}>A.</span>
        <span>Myer</span>
      </a>

      {/* Desktop links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }} className="hidden md:flex">
        {[
          { label: 'Inicio',   href: '#' },
          { label: 'El Autor', href: '#author' },
          { label: 'Libros',   href: '#books' },
        ].map(item => (
          <a key={item.label} href={item.href} style={linkStyle}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#c9a227';
              e.currentTarget.style.textShadow = '0 0 15px rgba(201,162,39,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(226,217,243,0.65)';
              e.currentTarget.style.textShadow = 'none';
            }}>
            {item.label}
          </a>
        ))}

        <a href="#books" style={{
          padding: '0.6rem 1.5rem',
          background: 'transparent',
          border: '1px solid rgba(201,162,39,0.5)',
          color: '#c9a227',
          borderRadius: '9999px',
          textDecoration: 'none',
          fontFamily: "'Raleway', sans-serif",
          fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(201,162,39,0.1)';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(201,162,39,0.2)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.boxShadow = 'none';
        }}>
          Ver Libros
        </a>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '5px' }}
        className="md:hidden"
      >
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: menuOpen ? (i === 1 ? '0' : '22px') : '22px',
            height: '1px', background: '#c9a227',
            transition: 'all 0.3s',
            transform: menuOpen ? (i === 0 ? 'rotate(45deg) translate(4px, 4px)' : i === 2 ? 'rotate(-45deg) translate(4px, -4px)' : 'none') : 'none',
          }} />
        ))}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(2,0,8,0.97)', padding: '1.5rem 2.5rem',
          borderBottom: '1px solid rgba(124,58,237,0.15)',
          backdropFilter: 'blur(20px)',
        }}>
          {[{ label: 'Inicio', href: '#' }, { label: 'El Autor', href: '#author' }, { label: 'Libros', href: '#books' }].map(item => (
            <a key={item.label} href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{ ...linkStyle, display: 'block', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
