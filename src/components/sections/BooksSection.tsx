import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BOOKS } from '../../lib/books';
import type { Book } from '../../lib/books';
gsap.registerPlugin(ScrollTrigger);

const LiveBook = lazy(() => import('../3d/LiveBook'));

interface Props { onSelectBook: (b: Book) => void; }

function BookCard({ book, index, onSelect, onOpenLiveBook }: {
  book: Book; index: number;
  onSelect: (b: Book) => void;
  onOpenLiveBook: (b: Book) => void;
}) {
  const { t, i18n } = useTranslation();
  const cardRef  = useRef<HTMLDivElement>(null);
  const imgRef   = useRef<HTMLDivElement>(null);
  const isEn     = i18n.language.startsWith('en');
  const title    = isEn ? book.titleEn    : book.titleEs;
  const category = isEn ? book.categoryEn : book.categoryEs;
  const desc     = isEn ? (book.descriptionEn ?? book.description) : book.description;

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out', delay: index * 0.07,
        scrollTrigger: { trigger: cardRef.current, start: 'top 90%' } });
  }, [index]);

  return (
    <div ref={cardRef}
      style={{ display:'flex', flexDirection:'column', opacity: book.comingSoon ? 0.4 : 1 }}>

      {/* Cover — real image or fallback */}
      <div ref={imgRef}
        onClick={() => !book.comingSoon && onSelect(book)}
        style={{
          width:'100%',
          paddingBottom:'152.6%',  /* matches real cover ratio 1.526 */
          position:'relative', overflow:'hidden',
          borderRadius:'2px',
          marginBottom:'0.9rem',
          boxShadow:'0 6px 24px rgba(0,0,0,0.5)',
          cursor: book.comingSoon ? 'default' : 'pointer',
          transition:'transform 0.35s ease, box-shadow 0.35s ease',
          border:'1px solid rgba(255,255,255,0.06)',
          background: book.coverColor,
          flexShrink: 0,
        }}
        onMouseEnter={e => {
          if (book.comingSoon) return;
          e.currentTarget.style.transform = 'translateY(-5px) scale(1.01)';
          e.currentTarget.style.boxShadow = `0 18px 40px rgba(0,0,0,0.65), 0 0 20px ${book.glowColor}30`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.5)';
        }}>

        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={title}
            loading="lazy"
            style={{
              position:'absolute', inset:0,
              width:'100%', height:'100%',
              objectFit:'cover', objectPosition:'center top',
              display:'block',
            }}
          />
        ) : book.comingSoon ? (
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(160,160,170,0.35)' }}>
              {t('books.coming_soon')}
            </span>
          </div>
        ) : (
          <div style={{ position:'absolute', inset:0, background:`linear-gradient(160deg, ${book.coverColor} 0%, ${book.spineColor} 100%)` }}>
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'5px', background:'rgba(0,0,0,0.35)' }} />
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'35%', background:'linear-gradient(to bottom, rgba(255,255,255,0.04), transparent)' }} />
          </div>
        )}

        {/* Year badge */}
        {book.year && !book.comingSoon && (
          <div style={{ position:'absolute', bottom:'0.5rem', right:'0.5rem', fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.1em', color:'rgba(255,255,255,0.3)', background:'rgba(0,0,0,0.4)', padding:'2px 5px', borderRadius:'1px' }}>
            {book.year}
          </div>
        )}

        {/* 3D viewer hint */}
        {!book.comingSoon && (
          <div style={{ position:'absolute', top:'0.5rem', right:'0.5rem', fontFamily:'var(--font-mono)', fontSize:'7px', letterSpacing:'0.1em', color:'rgba(255,255,255,0.2)', background:'rgba(0,0,0,0.35)', padding:'2px 5px', borderRadius:'1px', opacity:0, transition:'opacity 0.3s' }} className="view3d-hint">
            360°
          </div>
        )}
      </div>

      {/* Category */}
      <p style={{ fontFamily:'var(--font-mono)', fontSize:'7.5px', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(180,155,90,0.5)', marginBottom:'0.3rem', lineHeight:1.5 }}>
        {category}
      </p>

      {/* Title */}
      <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'0.93rem', fontWeight:500, color:'rgba(218,212,202,0.92)', lineHeight:1.3, marginBottom:'0.35rem' }}>
        {title}
      </h3>

      {/* Subtitle */}
      {!book.comingSoon && book.subtitle && (
        <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.72rem', color:'rgba(135,140,150,0.5)', lineHeight:1.55, fontWeight:300, marginBottom:'0.6rem', fontStyle:'italic' }}>
          {book.subtitle}
        </p>
      )}

      {/* Description */}
      {!book.comingSoon && (
        <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.775rem', color:'rgba(140,145,155,0.58)', lineHeight:1.75, fontWeight:300, marginBottom:'0.85rem', flex:1 }}>
          {desc.length > 175 ? desc.slice(0, 175) + '…' : desc}
        </p>
      )}

      {/* Actions */}
      {!book.comingSoon && (
        <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginTop:'auto' }}>
          {/* Amazon */}
          <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'0.45rem 0.85rem', background:'transparent', border:'1px solid rgba(180,155,90,0.28)', color:'rgba(175,150,70,0.72)', borderRadius:'2px', textDecoration:'none', fontFamily:'var(--font-mono)', fontSize:'8.5px', letterSpacing:'0.1em', textTransform:'uppercase', transition:'all 0.25s' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(180,155,90,0.09)'; e.currentTarget.style.borderColor='rgba(180,155,90,0.5)'; e.currentTarget.style.color='rgba(195,168,80,0.95)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(180,155,90,0.28)'; e.currentTarget.style.color='rgba(175,150,70,0.72)'; }}>
            <span>↗</span> {t('books.buy')}
          </a>

          {/* Libro Vivo button */}
          {book.hasLiveBook && (
            <button
              onClick={() => onOpenLiveBook(book)}
              style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'0.45rem 0.85rem', background:'rgba(60,90,140,0.15)', border:'1px solid rgba(60,90,140,0.35)', color:'rgba(120,155,210,0.75)', borderRadius:'2px', fontFamily:'var(--font-mono)', fontSize:'8.5px', letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer', transition:'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(60,90,140,0.28)'; e.currentTarget.style.borderColor='rgba(90,130,210,0.55)'; e.currentTarget.style.color='rgba(140,180,240,0.95)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(60,90,140,0.15)'; e.currentTarget.style.borderColor='rgba(60,90,140,0.35)'; e.currentTarget.style.color='rgba(120,155,210,0.75)'; }}>
              <span style={{ fontSize:'10px' }}>⊞</span> Leer
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function BooksSection({ onSelectBook }: Props) {
  const { t } = useTranslation();
  const [liveBookData, setLiveBookData] = useState<Book | null>(null);

  const allBooks = [
    ...BOOKS,
    { id:'future-1', titleEs:t('books.placeholder_title'), titleEn:t('books.placeholder_title'),
      subtitle:'', series:'', coverColor:'#0c0c10', spineColor:'#08080c', glowColor:'#383840',
      amazonUrl:'#', description:t('books.placeholder_desc'), descriptionEn:t('books.placeholder_desc'),
      categoryEs:'En preparación', categoryEn:'In preparation', comingSoon:true,
    } as Book & { comingSoon: boolean },
  ];

  return (
    <>
      <section style={{ padding:'var(--space-section) var(--space-gutter)', pointerEvents:'auto', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth:'var(--max-width)', margin:'0 auto' }}>

          <div className="section-rule">
            <span className="label-tag">{t('books.label')}</span>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'3rem', alignItems:'end', marginBottom:'3.5rem' }} className="bks-hdr">
            <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:400, color:'rgba(235,228,215,0.95)', lineHeight:1.15 }}>
              {t('books.title')}
            </h2>
            <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.875rem', color:'rgba(150,155,165,0.6)', lineHeight:1.85, fontWeight:300, maxWidth:'500px' }}>
              {t('books.subtitle')}
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(185px,1fr))', gap:'2.25rem 1.75rem' }}>
            {allBooks.map((book, i) => (
              <BookCard
                key={book.id} book={book} index={i}
                onSelect={onSelectBook}
                onOpenLiveBook={(b) => setLiveBookData(b)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Libro Vivo modal */}
      {liveBookData && (
        <Suspense fallback={
          <div style={{ position:'fixed', inset:0, zIndex:300, background:'#05040a', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <p style={{ fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.2em', color:'rgba(180,155,90,0.4)', textTransform:'uppercase' }}>
              Abriendo libro…
            </p>
          </div>
        }>
          <LiveBook
            bookId={liveBookData.id}
            coverSrc={liveBookData.coverImage ?? ''}
            title={liveBookData.titleEs}
            onClose={() => setLiveBookData(null)}
          />
        </Suspense>
      )}

      <style>{`
        @media (max-width: 768px) { .bks-hdr { grid-template-columns:1fr !important; gap:1rem !important; } }
        .book-card:hover .view3d-hint { opacity: 1 !important; }
      `}</style>
    </>
  );
}
