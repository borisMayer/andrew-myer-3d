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
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out', delay: index * 0.07,
        scrollTrigger: { trigger: cardRef.current, start: 'top 90%' } });
  }, [index]);

  const title    = isEn ? book.titleEn    : book.titleEs;
  const category = isEn ? book.categoryEn : book.categoryEs;
  const desc     = isEn ? (book.descriptionEn ?? book.description) : book.description;

  return (
    <div ref={cardRef}
      onClick={() => !book.comingSoon && onSelect(book)}
      style={{ display:'flex', flexDirection:'column', cursor: book.comingSoon ? 'default' : 'pointer', opacity: book.comingSoon ? 0.4 : 1 }}
      onMouseEnter={e => {
        if (book.comingSoon) return;
        const cover = e.currentTarget.querySelector('.bk-cover') as HTMLElement;
        if (cover) { cover.style.transform = 'translateY(-4px)'; cover.style.boxShadow = '0 20px 40px rgba(0,0,0,0.6)'; }
      }}
      onMouseLeave={e => {
        const cover = e.currentTarget.querySelector('.bk-cover') as HTMLElement;
        if (cover) { cover.style.transform = 'translateY(0)'; cover.style.boxShadow = '0 6px 20px rgba(0,0,0,0.35)'; }
      }}>

      {/* Cover */}
      <div className="bk-cover" style={{
        width:'100%', aspectRatio:'2/3', borderRadius:'2px',
        background:`linear-gradient(160deg, ${book.coverColor} 0%, ${book.spineColor} 100%)`,
        marginBottom:'1rem', position:'relative', overflow:'hidden',
        boxShadow:'0 6px 20px rgba(0,0,0,0.35)',
        transition:'transform 0.35s ease, box-shadow 0.35s ease',
        border:'1px solid rgba(255,255,255,0.04)',
      }}>
        {book.comingSoon ? (
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(160,160,170,0.35)' }}>
              {t('books.coming_soon')}
            </span>
          </div>
        ) : (
          <>
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'5px', background:'rgba(0,0,0,0.35)' }} />
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'35%', background:'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)' }} />
            {/* Year badge */}
            {book.year && (
              <div style={{ position:'absolute', bottom:'0.6rem', right:'0.6rem', fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.1em', color:'rgba(255,255,255,0.25)' }}>
                {book.year}
              </div>
            )}
          </>
        )}
      </div>

      {/* Category */}
      <p style={{ fontFamily:'var(--font-mono)', fontSize:'7.5px', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(180,155,90,0.5)', marginBottom:'0.3rem', lineHeight:1.5 }}>
        {category}
      </p>

      {/* Title */}
      <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'0.95rem', fontWeight:500, color:'rgba(218,212,202,0.92)', lineHeight:1.3, marginBottom:'0.4rem' }}>
        {title}
      </h3>

      {/* Subtitle */}
      {!book.comingSoon && book.subtitle && (
        <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.75rem', color:'rgba(140,145,155,0.55)', lineHeight:1.6, fontWeight:300, marginBottom:'0.65rem', fontStyle:'italic' }}>
          {book.subtitle}
        </p>
      )}

      {/* Description */}
      {!book.comingSoon && (
        <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.78rem', color:'rgba(145,150,160,0.6)', lineHeight:1.75, fontWeight:300, marginBottom:'0.9rem', flex:1 }}>
          {desc.length > 180 ? desc.slice(0, 180) + '...' : desc}
        </p>
      )}

      {/* Buy link */}
      {!book.comingSoon && (
        <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{
            display:'inline-flex', alignItems:'center', gap:'5px', marginTop:'auto',
            padding:'0.5rem 0.9rem', background:'transparent',
            border:'1px solid rgba(180,155,90,0.28)', color:'rgba(180,155,90,0.7)',
            borderRadius:'2px', textDecoration:'none',
            fontFamily:'var(--font-mono)', fontSize:'9px',
            letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:400,
            transition:'all 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(180,155,90,0.08)'; e.currentTarget.style.borderColor='rgba(180,155,90,0.55)'; e.currentTarget.style.color='rgba(195,168,80,0.95)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(180,155,90,0.28)'; e.currentTarget.style.color='rgba(180,155,90,0.7)'; }}>
          <span style={{ fontSize:'11px' }}>↗</span>
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
    { id:'future-1', titleEs:t('books.placeholder_title'), titleEn:t('books.placeholder_title'),
      subtitle:'', series:'', coverColor:'#0c0c10', spineColor:'#08080c', glowColor:'#383840',
      amazonUrl:'#', description:t('books.placeholder_desc'), descriptionEn:t('books.placeholder_desc'),
      categoryEs:'En preparación', categoryEn:'In preparation', comingSoon:true,
    } as Book & { comingSoon: boolean },
  ];

  return (
    <section style={{ padding:'var(--space-section) var(--space-gutter)', pointerEvents:'auto', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ maxWidth:'var(--max-width)', margin:'0 auto' }}>

        <div className="section-rule">
          <span className="label-tag">{t('books.label')}</span>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'3rem', alignItems:'end', marginBottom:'3.5rem' }} className="bks-header">
          <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:400, color:'rgba(235,228,215,0.95)', lineHeight:1.15 }}>
            {t('books.title')}
          </h2>
          <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.875rem', color:'rgba(150,155,165,0.6)', lineHeight:1.85, fontWeight:300, maxWidth:'500px' }}>
            {t('books.subtitle')}
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px,1fr))', gap:'2rem 1.75rem' }}>
          {allBooks.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} onSelect={onSelectBook} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .bks-header { grid-template-columns:1fr !important; gap:1rem !important; } }
      `}</style>
    </section>
  );
}
