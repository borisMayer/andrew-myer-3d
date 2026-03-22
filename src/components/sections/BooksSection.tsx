import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BOOKS } from '../../lib/books';
import type { Book } from '../../lib/books';
gsap.registerPlugin(ScrollTrigger);

interface Props { onSelectBook: (b: Book) => void; }

function BookCard({ book, index, onSelect }: { book: Book; index: number; onSelect: (b: Book) => void }) {
  const { t, i18n } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const isEn    = i18n.language.startsWith('en');

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 50, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out', delay: index * 0.12,
        scrollTrigger: { trigger: cardRef.current, start: 'top 85%' } });
  }, [index]);

  const title = isEn ? book.titleEn : book.titleEs;

  return (
    <div ref={cardRef} onClick={() => !book.comingSoon && onSelect(book)}
      style={{
        background: 'rgba(7,0,31,0.7)', backdropFilter: 'blur(16px)',
        border: `1px solid ${book.comingSoon ? 'rgba(255,255,255,0.08)' : 'rgba(124,58,237,0.2)'}`,
        borderRadius: '1.25rem', padding: '1.75rem',
        cursor: book.comingSoon ? 'default' : 'pointer',
        transition: 'all 0.35s ease', opacity: book.comingSoon ? 0.5 : 1,
      }}
      onMouseEnter={e => {
        if (book.comingSoon) return;
        e.currentTarget.style.borderColor = book.glowColor + '55';
        e.currentTarget.style.boxShadow = `0 0 30px ${book.glowColor}20`;
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}>

      {/* Book cover placeholder */}
      <div style={{
        width: '100%', aspectRatio: '2/3', borderRadius: '0.75rem',
        background: `linear-gradient(135deg, ${book.coverColor}, ${book.spineColor})`,
        marginBottom: '1.25rem', position: 'relative', overflow: 'hidden',
        boxShadow: `0 8px 32px ${book.glowColor}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {book.comingSoon ? (
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.85rem', color: 'rgba(226,217,243,0.4)', letterSpacing: '0.1em' }}>
            {t('books.coming_soon')}
          </span>
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 40% 30%, ${book.glowColor}25, transparent 60%)` }} />
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
      </div>

      {/* Info */}
      <div style={{ marginBottom: '0.5rem' }}>
        <p style={{ color: book.glowColor, fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Raleway', sans-serif", marginBottom: '0.4rem', opacity: 0.8 }}>
          {book.series}
        </p>
        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.3, marginBottom: '0.5rem' }}>
          {title}
        </h3>
        {!book.comingSoon && (
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: '0.8rem', color: 'rgba(226,217,243,0.5)', lineHeight: 1.6, fontWeight: 300 }}>
            {isEn ? book.descriptionEn ?? book.description : book.description}
          </p>
        )}
      </div>

      {/* Buy button */}
      {!book.comingSoon && (
        <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{
            display: 'block', marginTop: '1.25rem', padding: '0.65rem 1rem', textAlign: 'center',
            background: `linear-gradient(135deg, ${book.glowColor}cc, #c9a227cc)`,
            color: '#fff', borderRadius: '8px', textDecoration: 'none',
            fontFamily: "'Raleway', sans-serif", fontSize: '11px',
            fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
          {t('books.buy')}
        </a>
      )}
    </div>
  );
}

export default function BooksSection({ onSelectBook }: Props) {
  const { t } = useTranslation();

  // Add placeholder for future works
  const allBooks = [
    ...BOOKS,
    {
      id: 'placeholder-1', titleEs: t('books.placeholder_title'), titleEn: t('books.placeholder_title'),
      subtitle: '', series: 'Navegando por el Océano del Infinito',
      coverColor: '#0a0a1a', spineColor: '#050510', glowColor: '#4a4a6a',
      amazonUrl: '#', description: t('books.placeholder_desc'),
      comingSoon: true,
    } as Book & { comingSoon: boolean },
  ];

  return (
    <section style={{ padding: 'clamp(5rem,9vw,9rem) clamp(1.5rem,5vw,6rem)', pointerEvents: 'auto' }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        <p style={{ color: '#c9a227', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: "'Raleway', sans-serif" }}>
          ◆ {t('books.label')}
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, color: '#ffffff', lineHeight: 1.2, marginBottom: '0.75rem' }}>
          {t('books.title')}
        </h2>
        <p style={{ color: 'rgba(226,217,243,0.5)', fontFamily: "'Raleway', sans-serif", fontSize: '0.95rem', maxWidth: '550px', lineHeight: 1.8, marginBottom: '3.5rem' }}>
          {t('books.subtitle')}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1.5rem' }}>
          {allBooks.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} onSelect={onSelectBook} />
          ))}
        </div>
      </div>
    </section>
  );
}
