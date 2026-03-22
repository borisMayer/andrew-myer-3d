import { BOOKS } from '../../lib/books';

export default function MobileFallback() {
  return (
    <div style={{ minHeight: '100vh', background: '#020008', color: '#e2d9f3', fontFamily: "'Raleway', sans-serif" }}>
      {/* Hero */}
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '2rem',
        background: 'radial-gradient(ellipse at center, #1a0a3d 0%, #07001f 40%, #020008 100%)',
      }}>
        <p style={{ color: '#c9a227', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Navegando por el Océano del Infinito
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(3rem, 12vw, 5rem)', fontWeight: 300,
          color: '#ffffff', lineHeight: 1.1, marginBottom: '1.5rem',
          textShadow: '0 0 40px rgba(124,58,237,0.5)',
        }}>
          Andrew<br />
          <span style={{ background: 'linear-gradient(90deg, #c9a227, #f5e27d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Myer
          </span>
        </h1>
        <p style={{ color: 'rgba(226,217,243,0.7)', maxWidth: '320px', lineHeight: 1.7, marginBottom: '2rem', fontWeight: 300 }}>
          Autor espiritual y metafísico. Revelaciones del más allá.
        </p>
        <a href="#books-mobile" style={{
          padding: '12px 28px',
          background: 'linear-gradient(135deg, #7c3aed, #c9a227)',
          color: '#fff', borderRadius: '9999px', textDecoration: 'none',
          fontWeight: 600, fontSize: '14px', letterSpacing: '0.05em',
        }}>
          ✦ Ver Libros
        </a>
      </div>

      {/* Books list */}
      <div id="books-mobile" style={{ padding: '3rem 1.5rem', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '2.5rem', fontWeight: 300, textAlign: 'center',
          marginBottom: '2rem', color: '#fff',
        }}>
          La Obra
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {BOOKS.map(book => (
            <div key={book.id} style={{
              background: `linear-gradient(135deg, ${book.coverColor}, ${book.spineColor})`,
              border: `1px solid ${book.glowColor}40`,
              borderRadius: '14px', padding: '1.25rem',
              display: 'flex', gap: '1rem', alignItems: 'center',
              boxShadow: `0 0 20px ${book.glowColor}20`,
            }}>
              <div style={{
                width: '48px', height: '64px', borderRadius: '6px', flexShrink: 0,
                background: `radial-gradient(circle, ${book.glowColor}40, ${book.coverColor})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', color: book.glowColor,
                filter: `drop-shadow(0 0 6px ${book.glowColor})`,
              }}>◈</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1rem', fontWeight: 600, color: '#fff',
                  lineHeight: 1.3, marginBottom: '4px',
                }}>{book.titleEs}</h3>
                <p style={{ fontSize: '11px', color: book.glowColor, letterSpacing: '0.1em' }}>Andrew Myer</p>
              </div>
              <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" style={{
                padding: '8px 14px', background: book.glowColor,
                borderRadius: '8px', color: '#020008',
                textDecoration: 'none', fontSize: '12px', fontWeight: 700, flexShrink: 0,
              }}>Amazon</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
