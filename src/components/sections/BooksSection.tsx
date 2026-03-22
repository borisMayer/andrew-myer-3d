import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BOOKS } from '../../lib/books';
import type { Book } from '../../lib/books';
gsap.registerPlugin(ScrollTrigger);

interface Props { onSelectBook: (b: Book) => void; }

// Category label per book — shows academic scope
const BOOK_CATEGORIES: Record<string, { es: string; en: string }> = {
  'espejo-quebrado':         { es: 'Metafísica · Psicología', en: 'Metaphysics · Psychology' },
  'the-reborn':              { es: 'Espiritualidad · Transformación', en: 'Spirituality · Transformation' },
  'el-renacido':             { es: 'Espiritualidad · Edición ES', en: 'Spirituality · Spanish Ed.' },
  'narcisismo-cristalizacion':{ es: 'Filosofía · Psicología', en: 'Philosophy · Psychology' },
  'entre-dos-mundos':        { es: 'Teología · Filosofía', en: 'Theology · Philosophy' },
  'entre-dos-mundos-vol2':   { es: 'Teología · Filosofía', en: 'Theology · Philosophy' },
};

function BookCard({ book, index, onSelect }: { book: Book; index: number; onSelect: (b: Book) => void }) {
  const { t, i18n } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const isEn    = i18n.language.startsWith('en');
  const cat     = BOOK_CATEGORIES[book.id];

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: index * 0.08,
        scrollTrigger: { trigger: cardRef.current, start: 'top 88%' } });
  }, [index]);

  return (
    <div ref={cardRef}
      style={{
        display: 'flex', flexDirection: 'column',
        cursor: book.comingSoon ? 'default' : 'pointer',
        opacity: book.comingSoon ? 0.45 : 1,
      }}
      onClick={() => !book.comingSoon && onSelect(book)}
      onMouseEnter={e => {
        if (book.comingSoon) return;
        const cover = e.currentTarget.querySelector('.book-cover') as HTMLElement;
        if (cover) { cover.style.transform = 'scale(1.02)'; cover.style.boxShadow = '0 16px 40px rgba(0,0,0,0.5)'; }
      }}
      onMouseLeave={e => {
        const cover = e.currentTarget.querySelector('.book-cover') as HTMLElement;
        if (cover) { cover.style.transform = 'scale(1)'; cover.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'; }
      }}>

      {/* Book cover */}
      <div className="book-cover" style={{
        width: '100%', aspectRatio: '2/3', borderRadius: '2px',
        background: `linear-gradient(160deg, ${book.coverColor} 0%, ${book.spineColor} 100%)`,
        marginBottom: '1.1rem', position: 'relative', overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        transition: 'transform 0.35s ease, box-shadow 0.35s ease',
        border: '1px solid rgba(255,255,255,0.05)',
      }}>
        {book.comingSoon ? (
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(180,180,190,0.4)' }}>
              {t('books.coming_soon')}
            </span>
          </div>
        ) : (
          <>
            {/* Spine shadow */}
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'6px', background:'rgba(0,0,0,0.3)' }} />
            {/* Top light */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'30%', background:'linear-gradient(to bottom, rgba(255,255,255,0.06), transparent)' }} />
          </>
        )}
      </div>

      {/* Category */}
      {cat && (
        <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(180,155,90,0.5)', marginBottom:'0.35rem' }}>
          {isEn ? cat.en : cat.es}
        </p>
      )}

      {/* Title */}
      <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'0.97rem', fontWeight:500, color:'rgba(220,215,205,0.9)', lineHeight:1.3, marginBottom:'0.4rem' }}>
        {isEn ? book.titleEn : book.titleEs}
      </h3>

      {/* Description */}
      {!book.comingSoon && (
        <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.8rem', color:'rgba(150,155,165,0.65)', lineHeight:1.7, fontWeight:300, marginBottom:'0.9rem', flex:1 }}>
          {isEn ? (book.descriptionEn ?? book.description) : book.description}
        </p>
      )}

      {/* Buy link */}
      {!book.comingSoon && (
        <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '0.55rem 1rem', marginTop: 'auto',
            background: 'transparent',
            border: '1px solid rgba(180,155,90,0.3)',
            color: 'rgba(180,155,90,0.75)',
            borderRadius: '2px', textDecoration: 'none',
            fontFamily: 'var(--font-sans)', fontSize: '10px',
            letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500,
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(180,155,90,0.1)'; e.currentTarget.style.borderColor = 'rgba(180,155,90,0.6)'; e.currentTarget.style.color = 'rgba(200,170,80,0.95)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(180,155,90,0.3)'; e.currentTarget.style.color = 'rgba(180,155,90,0.75)'; }}>
          <span style={{ fontSize: '11px' }}>↗</span>
          {t('books.buy')}
        </a>
      )}
    </div>
  );
}

export default function BooksSection({ onSelectBook }: Props) {
  const { t } = useTranslation();

  const allBooks = [
    ...BOOKS,
    { id:'placeholder-1', titleEs:t('books.placeholder_title'), titleEn:t('books.placeholder_title'),
      subtitle:'', series:'', coverColor:'#0e0e14', spineColor:'#0a0a10',
      glowColor:'#404050', amazonUrl:'#', description:t('books.placeholder_desc'), comingSoon:true,
    } as Book & { comingSoon: boolean },
  ];

  return (
    <section style={{ padding: 'var(--space-section) var(--space-gutter)', pointerEvents: 'auto', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>

        <div className="section-rule">
          <span className="label-tag">{t('books.label')}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', alignItems: 'end', marginBottom: '3.5rem' }} className="books-header">
          <div>
            <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:400, color:'rgba(235,228,215,0.95)', lineHeight:1.15 }}>
              {t('books.title')}
            </h2>
          </div>
          <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.9rem', color:'rgba(155,160,170,0.6)', lineHeight:1.8, fontWeight:300, maxWidth:'500px' }}>
            {t('books.subtitle')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px,1fr))', gap: '2rem' }}>
          {allBooks.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} onSelect={onSelectBook} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .books-header { grid-template-columns: 1fr !important; gap: 1rem !important; } }
      `}</style>
    </section>
  );
}
