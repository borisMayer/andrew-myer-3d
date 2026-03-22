import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BOOKS } from '../../lib/books';
import type { Book } from '../../lib/books';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  onSelectBook: (book: Book) => void;
}

function BookCard({ book, index, onSelect }: { book: Book; index: number; onSelect: (b: Book) => void }) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out',
        delay: index * 0.1,
        scrollTrigger: { trigger: cardRef.current, start: 'top 90%', once: true },
      }
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect(book)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor:     'pointer',
        borderRadius: '16px',
        overflow:   'hidden',
        background: `linear-gradient(160deg, ${book.coverColor}, ${book.spineColor})`,
        border:     `1px solid ${hovered ? book.glowColor + '60' : 'rgba(124,58,237,0.2)'}`,
        boxShadow:  hovered
          ? `0 0 40px ${book.glowColor}40, 0 0 80px ${book.glowColor}20, 0 20px 40px rgba(0,0,0,0.4)`
          : '0 4px 20px rgba(0,0,0,0.3)',
        transform:  hovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position:   'relative',
      }}
    >
      {/* Book cover area */}
      <div style={{
        aspectRatio: '2/3',
        display:     'flex',
        flexDirection: 'column',
        alignItems:  'center',
        justifyContent: 'center',
        padding:     '1.5rem',
        position:    'relative',
        overflow:    'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at center, ${book.glowColor}20 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0.5,
          transition: 'opacity 0.4s',
        }} />

        {/* Decorative symbol */}
        <div style={{
          fontSize:   '3rem',
          color:      book.glowColor,
          opacity:    hovered ? 0.9 : 0.5,
          transition: 'all 0.4s',
          transform:  hovered ? 'scale(1.2) rotate(15deg)' : 'scale(1) rotate(0deg)',
          marginBottom: '1rem',
          textShadow: `0 0 20px ${book.glowColor}`,
          filter:     `drop-shadow(0 0 10px ${book.glowColor})`,
        }}>
          {['◈', '✦', '◆', '⬡', '✧', '◉'][index % 6]}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily:  "'Cormorant Garamond', Georgia, serif",
          fontSize:    'clamp(0.9rem, 2vw, 1.15rem)',
          fontWeight:  600,
          color:       '#ffffff',
          textAlign:   'center',
          lineHeight:  1.3,
          marginBottom: '0.5rem',
          textShadow:  '0 2px 10px rgba(0,0,0,0.5)',
          zIndex:      1,
          position:    'relative',
        }}>
          {book.titleEs}
        </h3>
        <p style={{
          fontFamily:  "'Raleway', sans-serif",
          fontSize:    '0.65rem',
          color:       book.glowColor,
          textAlign:   'center',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          position:    'relative', zIndex: 1,
        }}>
          Andrew Myer
        </p>

        {/* Hover overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `linear-gradient(to top, ${book.coverColor}dd, transparent)`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s',
        }}>
          <div style={{
            padding: '10px 20px',
            background: book.glowColor,
            borderRadius: '9999px',
            color: '#020008',
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 700,
            fontSize: '13px',
            transform: hovered ? 'translateY(0)' : 'translateY(20px)',
            transition: 'transform 0.3s ease',
          }}>
            Ver en 3D ✦
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div style={{
        padding:    '1rem 1.25rem',
        background: 'rgba(0,0,0,0.3)',
        borderTop:  `1px solid ${book.glowColor}20`,
      }}>
        <p style={{
          fontFamily:  "'Raleway', sans-serif",
          fontSize:    '0.7rem',
          color:       'rgba(226,217,243,0.5)',
          marginBottom: '10px',
          lineHeight:  1.4,
          display:     '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow:    'hidden',
        }}>
          {book.subtitle || book.description.slice(0, 80) + '...'}
        </p>
        <a
          href={book.amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{
            display:        'block',
            textAlign:      'center',
            padding:        '8px',
            background:     `linear-gradient(135deg, ${book.glowColor}cc, #c9a22780)`,
            borderRadius:   '8px',
            color:          '#ffffff',
            textDecoration: 'none',
            fontFamily:     "'Raleway', sans-serif",
            fontSize:       '12px',
            fontWeight:     600,
            letterSpacing:  '0.05em',
            transition:     'all 0.2s',
          }}
        >
          🛒 Amazon
        </a>
      </div>
    </div>
  );
}

export default function BooksSection({ onSelectBook }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(titleRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 85%', once: true },
      }
    );
  }, []);

  return (
    <section
      id="books"
      ref={sectionRef}
      className="section-overlay"
      style={{
        minHeight: '100vh',
        padding:   'clamp(4rem, 10vh, 8rem) clamp(1.5rem, 5vw, 6rem)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div ref={titleRef} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ color: '#c9a227', fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: "'Raleway', sans-serif" }}>
            ◆ La Obra
          </p>
          <h2 style={{
            fontFamily:   "'Cormorant Garamond', Georgia, serif",
            fontSize:     'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight:   300,
            color:        '#ffffff',
            lineHeight:   1.1,
            marginBottom: '1rem',
          }}>
            Catálogo de Libros
          </h2>
          <p style={{
            fontFamily: "'Raleway', sans-serif",
            color:      'rgba(226,217,243,0.6)',
            fontSize:   'clamp(0.875rem, 2vw, 1rem)',
            maxWidth:   '500px',
            margin:     '0 auto',
            lineHeight: 1.7,
            fontWeight: 300,
          }}>
            Haz clic en cualquier libro para explorar en 3D y descubrir su energía
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display:               'grid',
          gridTemplateColumns:   'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
          gap:                   'clamp(1rem, 3vw, 1.5rem)',
        }}>
          {BOOKS.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} onSelect={onSelectBook} />
          ))}
        </div>

        {/* Series note */}
        <div style={{
          textAlign:    'center',
          marginTop:    '4rem',
          padding:      '2rem',
          background:   'rgba(13,7,40,0.5)',
          borderRadius: '16px',
          border:       '1px solid rgba(124,58,237,0.2)',
          backdropFilter: 'blur(10px)',
        }}>
          <p style={{ color: 'rgba(226,217,243,0.6)', fontFamily: "'Raleway', sans-serif", fontSize: '0.875rem', lineHeight: 1.7 }}>
            Todos los libros forman parte de la serie{' '}
            <em style={{ color: '#c9a227', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1em' }}>
              "Navegando por el Océano del Infinito"
            </em>
            {' '}— una exploración profunda de las verdades espirituales y metafísicas del cosmos.
          </p>
        </div>
      </div>
    </section>
  );
}
