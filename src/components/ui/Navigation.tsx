import { useState, useEffect } from 'react';

export default function Navigation() {
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#',       label: 'Inicio'    },
    { href: '#author', label: 'El Autor'  },
    { href: '#books',  label: 'Libros'    },
  ];

  return (
    <nav style={{
      position:       'fixed',
      top:            0,
      left:           0,
      right:          0,
      zIndex:         50,
      padding:        '1rem 2rem',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      background:     scrolled ? 'rgba(2,0,8,0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom:   scrolled ? '1px solid rgba(124,58,237,0.15)' : 'none',
      transition:     'all 0.4s ease',
    }}>
      {/* Logo */}
      <a href="#" style={{
        fontFamily:     "'Cormorant Garamond', Georgia, serif",
        fontSize:       '1.5rem',
        fontWeight:     300,
        color:          '#ffffff',
        textDecoration: 'none',
        letterSpacing:  '0.05em',
        textShadow:     '0 0 20px rgba(201,162,39,0.3)',
      }}>
        A.<span style={{
          background: 'linear-gradient(90deg, #c9a227, #f5e27d)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>Myer</span>
      </a>

      {/* Desktop links */}
      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="hidden md:flex">
        {links.map(link => (
          <a key={link.href} href={link.href} style={{
            fontFamily:     "'Raleway', sans-serif",
            fontSize:       '0.8rem',
            letterSpacing:  '0.12em',
            textTransform:  'uppercase',
            color:          'rgba(226,217,243,0.7)',
            textDecoration: 'none',
            transition:     'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#c9a227')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(226,217,243,0.7)')}
          >
            {link.label}
          </a>
        ))}
        <a href="#books" style={{
          padding:        '8px 20px',
          background:     'linear-gradient(135deg, rgba(124,58,237,0.8), rgba(201,162,39,0.8))',
          borderRadius:   '9999px',
          color:          '#ffffff',
          textDecoration: 'none',
          fontFamily:     "'Raleway', sans-serif",
          fontSize:       '0.75rem',
          fontWeight:     600,
          letterSpacing:  '0.08em',
          textTransform:  'uppercase',
          transition:     'all 0.2s',
          boxShadow:      '0 0 20px rgba(124,58,237,0.3)',
        }}>
          Ver Libros
        </a>
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
        aria-label="Menu"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width:      '24px', height: '1.5px',
              background: '#c9a227',
              transition: 'all 0.3s',
              transform:  menuOpen
                ? i === 0 ? 'rotate(45deg) translate(4.5px, 4.5px)'
                  : i === 1 ? 'scaleX(0)' : 'rotate(-45deg) translate(4.5px, -4.5px)'
                : 'none',
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </div>
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position:   'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(2,0,8,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(124,58,237,0.2)',
          padding:    '1rem 2rem',
          display:    'flex',
          flexDirection: 'column',
          gap:        '1rem',
        }}>
          {links.map(link => (
            <a key={link.href} href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize:   '0.875rem', letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'rgba(226,217,243,0.8)',
                textDecoration: 'none', padding: '0.5rem 0',
                borderBottom: '1px solid rgba(124,58,237,0.1)',
              }}>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
